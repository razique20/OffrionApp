# Deployment Readiness — OffrionApp

## Context

OffrionApp is a Next.js 16 (App Router, React 19) "Deals-as-a-Service" SaaS connecting
merchants and partners with geo-spatial deal discovery, tracking, and redemption. Stack:
MongoDB/Mongoose, custom JWT auth, Stripe (subscriptions + Connect payouts), Cloudinary
uploads, Upstash Redis rate limiting, Sentry. It builds to `output: "standalone"` and ships
via a multi-stage `Dockerfile`.

You asked what needs to be done before deployment. This is an audit, not a code change —
the items below are what's missing or unsafe for production, ordered by severity. Nothing
here is committed yet; treat this as a checklist to work through.

---

## BLOCKERS — do not deploy without these

### 1. Rotate / replace all live secrets
`.env.local` contains **real, working** credentials (Mongo Atlas with password in URI,
Stripe test keys, Cloudinary API secret, Upstash token, Sentry auth token). They are NOT
committed (`.gitignore` has `.env*`), so the repo is clean — but these values must not be
reused as-is in production:
- `JWT_SECRET` is currently `super-secret-key-change-this-in-production` and the code
  (`src/lib/auth.ts`) falls back to `'fallback-secret-for-dev'` if unset → generate a strong
  random 32+ char secret.
- `MONGODB_URI` uses a weak `mkrazique2:mkrazique2` credential → create a production DB user
  with a strong password, locked-down IP allowlist.
- Swap Stripe **test** keys (`sk_test_…`) for **live** keys, and regenerate the webhook
  secret against the production webhook endpoint.
- Rotate Cloudinary `CLOUDINARY_API_SECRET` and Upstash token (they've been on disk in plaintext).
- Store all of these in the host platform's secret manager — never in the image or repo.

### 2. Add a `.dockerignore`
There is **no `.dockerignore`**, and the Dockerfile does `COPY . .` (line 15). This copies
`.env.local`, `.git`, `.next`, `node_modules`, and `scripts/` straight into the build image —
baking your live secrets into a layer. Create `/Users/raziquemk/Desktop/OffrionApp/.dockerignore`
covering at minimum: `.env*`, `.git`, `node_modules`, `.next`, `npm-debug.log`, `*.md`.

### 3. Commission settlement has no scheduler
`src/app/api/admin/wallet/settle/route.ts` settles partner commissions only when an admin
POSTs to it manually; the code itself notes it "would be a scheduled cron job" in production.
Without automation, partners don't get paid. Wire it to a real schedule — Vercel Cron
(`automaticVercelMonitors` is already on in `next.config.ts`) if deploying to Vercel, or an
external scheduler / `node-cron` hitting the endpoint with an auth secret if self-hosting.

### 4. IP rate limiting is in-memory, not Redis
`src/lib/ipRateLimit.ts` uses an in-process `Map` (comment: "replace with Upstash/Redis…").
This resets on every restart and is per-instance, so it's bypassable behind multiple
containers/serverless instances. Upstash is already a dependency and used in `src/proxy.ts`
— route `checkIpRateLimit` through Upstash (or confirm the storefront-claim limiter in
`proxy.ts` is the real enforcement and this file is dead code) before relying on it.

---

## HIGH PRIORITY

### 5. `NEXT_PUBLIC_APP_URL` must be set at BUILD time and consistent
It's inlined into the client bundle at build, and the codebase has **three different
fallbacks** when unset: `http://localhost:3000` (billing/wallet routes), `https://offrion.app`
(track-click/conversion), `https://offrion.com` (`layout.tsx`). If the build runs without this
var set correctly, Stripe redirect URLs and tracking links silently point at the wrong host.
The Dockerfile already declares it as an `ARG` (line 22) — ensure your build pipeline passes
the real production URL. (See memory: NEXT_PUBLIC_* frozen at build time.)

### 6. Create `.env.example`
No `.env.example` / `.env.production` template exists. Document every required var (names
only, no values) so deploys are reproducible: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
`NODE_ENV`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DEMO_MODE`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, the four `STRIPE_PRICE_*`, `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`,
`SENTRY_AUTH_TOKEN`, `DEMO_MODE`.

### 7. Turn off demo mode in production
`NEXT_PUBLIC_DEMO_MODE` is `true` and `DEMO_MODE` gates a payout bypass in
`src/app/api/wallet/payout/route.ts`. Both must be `false`/unset in production or real money
flows are short-circuited.

### 8. Verify the production build actually compiles
There are no tests and no CI. At minimum, run `npm run build` and `npm run lint` against the
current tree before shipping — a standalone build failure is otherwise discovered in the
container. Confirm a production `docker build` + `docker run` boots and `/api/health` responds.

---

## MEDIUM / RECOMMENDED

- **No CI/CD** (`.github/workflows/` absent). Add at least a build+lint check on PRs.
- **No test suite** (no Jest/Vitest). Highest-value targets: Stripe webhook signature +
  ledger idempotency (`LedgerEntry` unique index on `metadata.stripeSessionId`), auth
  middleware, commission math.
- **No transactional email** (no Resend/SendGrid/Nodemailer). Confirm whether password
  reset / receipts / payout notifications are required for launch; if so, this is a feature gap.
- **MongoDB backup/restore strategy** — Atlas continuous backups should be enabled and a
  restore tested. No migration tooling exists (Mongoose is schema-flexible); document how
  index/schema changes get applied to prod.
- **Webhook retries** are manual (`scripts/webhook-retry.ts`); decide if that's acceptable or
  needs scheduling alongside item #3.
- **Sentry DSN is hardcoded** in `sentry.server.config.ts` / `sentry.edge.config.ts`. It's a
  public DSN so this is low risk, but consider env-driving it for multi-environment setups.

---

## Verification (run before declaring ready)

1. `npm run lint` — clean.
2. `npm run build` — standalone build succeeds locally.
3. Build the image with production build-args and **without** `.env.local` leaking in:
   `docker build --build-arg NEXT_PUBLIC_APP_URL=<prod-url> … -t offrion .`
   then `docker history offrion` / inspect to confirm no `.env.local` layer.
4. `docker run` with prod env vars injected at runtime; hit `GET /api/health` → expect OK.
5. Stripe: trigger a test `checkout.session.completed` to the deployed webhook URL and
   confirm signature verification + idempotent ledger write.
6. Confirm rate limiting blocks after threshold on `/api/storefront/claim` across two requests
   from the same IP.
7. Confirm `DEMO_MODE`/`NEXT_PUBLIC_DEMO_MODE` are false in the running container.

---

## Notes

- This plan is an **audit checklist**, not a single code change. If you want, I can execute a
  subset next (e.g. create `.dockerignore` + `.env.example`, wire the settlement cron, move
  rate limiting to Upstash) — tell me which items to action and I'll implement them.
- Per `AGENTS.md`, this Next.js (16.2.2) has breaking changes vs. training data; any code
  written should be checked against `node_modules/next/dist/docs/` first.
