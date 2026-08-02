import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function appBaseUrl(req?: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  // Only derive the base URL from request headers outside production. In prod
  // an attacker can spoof x-forwarded-host to poison Stripe redirect URLs, so
  // NEXT_PUBLIC_APP_URL is required there (falls through to localhost otherwise).
  if (process.env.NODE_ENV !== "production" && req) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "http";
    if (host) return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}
