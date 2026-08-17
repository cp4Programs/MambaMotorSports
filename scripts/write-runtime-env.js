/**
 * Writes Amplify console env vars into a JSON module Next.js will bundle
 * into the server build. Safe to run locally — no-ops when vars are unset.
 */
const fs = require("fs");
const path = require("path");

const KEYS = [
  "OWNER_EMAIL",
  "OWNER_PASSWORD",
  "OWNER_SESSION_SECRET",
  "NOTIFY_EMAIL",
  "SES_FROM_EMAIL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "ALLOW_DEV_PAYMENTS",
];

const env = {};
for (const key of KEYS) {
  const value = process.env[key];
  if (value) env[key] = value;
}

const out = path.join(__dirname, "../src/server/runtime-env.generated.json");
fs.writeFileSync(out, `${JSON.stringify(env, null, 2)}\n`);
console.log(
  `[runtime-env] wrote ${Object.keys(env).length} keys: ${Object.keys(env).join(", ") || "(none)"}`,
);
