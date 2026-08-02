import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret() {
  return (
    process.env.OWNER_SESSION_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET ||
    "mamba-dev-session-secret-change-me"
  );
}

function ownerEmail() {
  return (process.env.OWNER_EMAIL || "owner@mambamotorsports.com").toLowerCase();
}

function ownerPassword() {
  return process.env.OWNER_PASSWORD || "mamba-owner-dev";
}

export function verifyOwnerCredentials(email: string, password: string): boolean {
  const emailOk = email.trim().toLowerCase() === ownerEmail();
  const passOk = password === ownerPassword();
  return emailOk && passOk;
}

export function createOwnerToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email: email.toLowerCase(),
      exp: Date.now() + TOKEN_TTL_MS,
    }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyOwnerToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
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
    return (data.email || "").toLowerCase() === ownerEmail();
  } catch {
    return false;
  }
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}
