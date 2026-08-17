# Mamba Motor Sports

Website for Mamba Motor Sports — BMW · Audi · Mercedes-Benz specialists serving Los Angeles & Orange County.

Stack: **Next.js (App Router)** + **AWS Amplify Hosting / Gen 2** + **Stripe** for invoice payments.

## Features

- Public site: Home, Services, About, Book, Contact, Pay Invoice
- Booking & contact forms persist submissions and email the shop (SES when configured)
- Invoice lookup + Stripe Checkout (dev fallback without Stripe keys)
- Owner dashboard (appointments, inquiries, invoices)

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Local owner login (from `.env.example` / `.env.local`):

- Email: `owner@example.com`
- Password: `dev-owner-password`

Production login is **not** those defaults. Set `OWNER_EMAIL`, `OWNER_PASSWORD`, and `OWNER_SESSION_SECRET` in the Amplify console, then redeploy. Owner dashboard: [https://www.mambamotorsportsgroup.com/dashboard](https://www.mambamotorsportsgroup.com/dashboard)

Demo invoices (local JSON only): `MMS-1042`, `MMS-1077`

Local data is stored under `.data/store.json`. CMS copy/photos/services use Amplify Data when `amplify_outputs.json` is present.

### Amplify sandbox (backend)

Requires AWS credentials configured (`aws configure` or SSO).

```bash
npm run sandbox
```

This provisions Cognito + Amplify Data from `amplify/` and writes `amplify_outputs.json`.

## Deploy on AWS Amplify (Vercel-like)

Amplify Hosting is the closest git-push deploy experience on AWS.

1. Push this repo to GitHub (see below).
2. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/) → **Create new app** → **Host web app**.
3. Connect the GitHub repo and branch (`main`).
4. Amplify uses [`amplify.yml`](amplify.yml) for Next.js + Gen 2 backend deploy.
5. In **Environment variables / Secrets**, set at least:

| Variable | Purpose |
|----------|---------|
| `OWNER_EMAIL` | Dashboard login email |
| `OWNER_PASSWORD` | Dashboard login password |
| `OWNER_SESSION_SECRET` | Session signing secret |
| `NOTIFY_EMAIL` | Inbox for booking/contact alerts |
| `SES_FROM_EMAIL` | Verified SES sender |
| `AWS_REGION` | e.g. `us-west-2` |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | `https://www.mambamotorsportsgroup.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

6. After first deploy, point a Stripe webhook to `https://<your-app>/api/webhooks/stripe` for `checkout.session.completed`.
7. Create the Cognito owner user (optional, for Amplify Auth) after the Gen 2 backend deploys, or keep using `OWNER_*` env credentials for the dashboard API.

Subsequent launches: **git push** → Amplify rebuilds automatically.

## Project layout

```
amplify/                 Amplify Gen 2 (Cognito + Data models)
src/app/                 Pages + Route Handlers
src/components/          UI
src/lib/                 Shared content + Amplify helpers
src/server/              Express-like server modules (repo, auth, email, stripe)
public/                  Logo & static assets
```

## GitHub

```bash
gh auth login   # if token is invalid
gh repo create MambaMotorSports --private --source=. --remote=origin --push
```
