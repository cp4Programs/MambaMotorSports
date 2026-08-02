# Mamba Motor Sports

Website for Mamba Motor Sports — BMW · Audi · Mercedes-Benz specialists serving Los Angeles & Orange County.

Built with **Next.js** (App Router) and deployed on **AWS Amplify Hosting** (git-push deploys, closest AWS equivalent to Vercel). Backend resources (Cognito + DynamoDB via Amplify Data) live in the `amplify/` folder. Forms, invoice pay, and the owner dashboard use Next.js Route Handlers under `src/app/api/` and server modules in `src/server/`.

## Features

- Marketing pages: Home, Services, About
- Book a Service → persisted + email notify
- Contact → persisted + email notify
- Pay Invoice → Stripe Checkout (demo mode without keys)
- Owner Dashboard → inquiries / appointments / invoices

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials & invoices

| Item | Value |
|------|--------|
| Owner login (local) | any email + password `mamba-owner` |
| Demo invoices | `MMS-1042`, `MMS-1077` |

Without Stripe keys, **Pay Now** marks the invoice paid in the local store and redirects with `?success=1`.

Without SES config (`EMAIL_MODE=log`), booking/contact emails print to the server console.

Local data is stored in `.data/store.json` (gitignored).

## Amplify Gen 2 backend (optional locally)

```bash
npx ampx sandbox
```

This provisions Cognito + AppSync/DynamoDB and writes `amplify_outputs.json`. Then:

1. Copy outputs for the browser: `cp amplify_outputs.json public/amplify_outputs.json`
2. Set in `.env.local`:
   - `DATA_BACKEND=amplify`
   - `COGNITO_USER_POOL_ID` / `COGNITO_CLIENT_ID` from the outputs
3. Create an owner user in the Cognito user pool
4. `npm run seed` to seed demo invoices into Amplify Data

## Environment variables

See [`.env.example`](.env.example). In Amplify Console → App settings → Environment variables / Secrets, set at least:

- `NEXT_PUBLIC_APP_URL` — Amplify app URL
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SES_FROM_EMAIL`, `SHOP_NOTIFY_EMAIL` (verified in SES)
- `DATA_BACKEND=amplify` for production
- `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `AWS_REGION`
- `EMAIL_MODE` — omit or unset for real SES; `log` for console only

Point Stripe webhooks to `https://<your-domain>/api/webhooks/stripe` for `checkout.session.completed`.

## Deploy on AWS Amplify (Vercel-like)

1. Push this repo to GitHub (private recommended).
2. AWS Console → **Amplify** → **Create new app** → **Host web app** → connect GitHub → select `MambaMotorSports`.
3. Amplify auto-detects Next.js; [`amplify.yml`](amplify.yml) deploys the Gen 2 backend then builds the frontend.
4. Add environment variables / secrets once.
5. Every `git push` to the connected branch redeploys.

Create the Cognito owner user after the first backend deploy (Amplify Console → Auth, or Cognito console).

## Project layout

```
amplify/                 Amplify Gen 2 auth + data
src/app/                 Pages + API route handlers
src/components/          UI (nav, forms, dashboard)
src/lib/data.ts          Services, testimonials, copy
src/server/              Booking/contact/invoice/email/stripe
public/                  Logo + amplify_outputs (after sandbox)
```

## Stack

- Next.js 15 + TypeScript + Tailwind CSS 4
- AWS Amplify Hosting + Amplify Gen 2 (Cognito, DynamoDB/AppSync)
- Amazon SES (notifications)
- Stripe Checkout (invoice payments)
