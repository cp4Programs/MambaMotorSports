import { createHmac, timingSafeEqual } from "crypto";
import {
  MIN_PASSWORD_LENGTH,
  hashPassword,
  passwordFingerprint,
  verifyPassword,
} from "./password";
import { getOwnerCredential, saveOwnerCredential } from "./repo";
import generated from "./runtime-env.generated.json";
import type { OwnerCredential } from "./types";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const IS_PROD = process.env.NODE_ENV === "production";

const baked = generated as Record<string, string | undefined>;

function bakedEnv(key: string): string | undefined {
  const value = baked[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function readEnv(key: string): string | undefined {
  const live = process.env[key]?.trim();
  if (live) return live;
  return bakedEnv(key);
}

/**
 * Owner auth is fail-closed: in production every value MUST come from the
 * environment (set in the Amplify console). If a secret/credential is missing
 * in production these return null and auth denies — we never fall back to a
 * hardcoded default. In development we allow clearly-labelled placeholders so
 * `npm run dev` works without setup; those must never reach production.
 */
function ownerSecret(): string | null {
  const s = readEnv("OWNER_SESSION_SECRET");
  if (s && s.length >= 16) return s;
  return IS_PROD ? null : "dev-insecure-session-secret-not-for-prod";
}

function ownerEmail(): string | null {
  const e = readEnv("OWNER_EMAIL");
  if (e) return e.toLowerCase();
  return IS_PROD ? null : "owner@example.com";
}

function ownerPassword(): string | null {
  const p = readEnv("OWNER_PASSWORD");
  if (p) return p;
  return IS_PROD ? null : "dev-owner-password";
}

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function isOwnerAuthConfigured(): boolean {
  return Boolean(ownerEmail() && ownerPassword() && ownerSecret());
}

/** Booleans only — used to diagnose Amplify env wiring without leaking secrets. */
export function ownerAuthStatus(): {
  email: boolean;
  password: boolean;
  secret: boolean;
} {
  const secret = readEnv("OWNER_SESSION_SECRET");
  return {
    email: Boolean(readEnv("OWNER_EMAIL")),
    password: Boolean(readEnv("OWNER_PASSWORD")),
    secret: Boolean(secret && secret.length >= 16),
  };
}

export function verifyOwnerCredentials(email: string, password: string): boolean {
  const expectedEmail = ownerEmail();
  const expectedPassword = ownerPassword();
  // Misconfigured (e.g. prod without OWNER_* set) => deny rather than allow.
  if (!expectedEmail || !expectedPassword) return false;
  const emailOk = email.trim().toLowerCase() === expectedEmail;
  const passOk = constantTimeEquals(password, expectedPassword);
  return emailOk && passOk;
}

/**
 * The owner can set their own password from the dashboard; it is stored as a
 * salted hash. Rotating OWNER_PASSWORD in the Amplify console retires that
 * stored password, which is the admin recovery path if they forget it.
 */
async function storedCredential(): Promise<OwnerCredential | null> {
  try {
    return await getOwnerCredential();
  } catch (err) {
    // Missing table / unreachable data layer must not lock the owner out.
    console.error("[auth] could not read stored credential", err);
    return null;
  }
}

function envFingerprint(): string | undefined {
  const envPassword = ownerPassword();
  return envPassword ? passwordFingerprint(envPassword) : undefined;
}

function storedPasswordIsCurrent(credential: OwnerCredential): boolean {
  const current = envFingerprint();
  if (!credential.envFingerprint || !current) return true;
  return credential.envFingerprint === current;
}

async function passwordMatches(password: string): Promise<boolean> {
  const credential = await storedCredential();
  if (credential && storedPasswordIsCurrent(credential)) {
    return verifyPassword(password, credential.passwordHash);
  }
  const envPassword = ownerPassword();
  return envPassword ? constantTimeEquals(password, envPassword) : false;
}

export async function verifyOwnerLogin(
  email: string,
  password: string,
): Promise<boolean> {
  const expectedEmail = ownerEmail();
  if (!expectedEmail || !ownerSecret()) return false;
  if (email.trim().toLowerCase() !== expectedEmail) return false;
  return passwordMatches(password);
}

export type PasswordChangeResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function changeOwnerPassword(
  currentPassword: string,
  newPassword: string,
): Promise<PasswordChangeResult> {
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      status: 400,
      error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (!(await passwordMatches(currentPassword))) {
    return { ok: false, status: 401, error: "Current password is incorrect." };
  }
  if (await passwordMatches(newPassword)) {
    return {
      ok: false,
      status: 400,
      error: "New password must be different from the current one.",
    };
  }
  try {
    await saveOwnerCredential({
      passwordHash: hashPassword(newPassword),
      envFingerprint: envFingerprint(),
    });
  } catch (err) {
    console.error("[auth] could not save new password", err);
    return {
      ok: false,
      status: 503,
      error: "Could not save the new password. Try again shortly.",
    };
  }
  return { ok: true };
}

export function createOwnerToken(email: string): string {
  const secret = ownerSecret();
  if (!secret) {
    throw new Error("OWNER_SESSION_SECRET is not configured");
  }
  const payload = Buffer.from(
    JSON.stringify({
      email: email.toLowerCase(),
      exp: Date.now() + TOKEN_TTL_MS,
    }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyOwnerToken(token: string | null | undefined): boolean {
  const secret = ownerSecret();
  const expectedEmail = ownerEmail();
  if (!secret || !expectedEmail) return false;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      exp?: number;
    };
    if (!data.exp || Date.now() > data.exp) return false;
    return (data.email || "").toLowerCase() === expectedEmail;
  } catch {
    return false;
  }
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}
