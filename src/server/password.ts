import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;
const SCHEME = "scrypt";

export const MIN_PASSWORD_LENGTH = 10;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${SCHEME}:${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, expectedHex] = stored.split(":");
  if (scheme !== SCHEME || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/** Short, non-reversible marker for "which env password was active". */
export function passwordFingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
