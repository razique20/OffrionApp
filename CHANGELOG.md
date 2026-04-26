# Offrion Project Changelog

This file tracks all architectural updates, security enhancements, and feature implementations made to the Offrion platform.

---

## [2026-04-25] - Observability, Security & Premium Design
### 🛡️ Security & Performance
- **Upstash Redis Integration**: Implemented Edge-based API rate limiting (10 req / 10s per IP) using `@upstash/ratelimit` to protect against API abuse.
- **Sentry Global Integration**: Added full-stack error tracking and performance monitoring across Server, Edge, and Client runtimes.

### 🎨 UI/UX & Aesthetics
- **Typography Overhaul**: Migrated the entire platform font to **Outfit**, a premium geometric Google Font, for a more state-of-the-art SaaS aesthetic.
- **Docs Stability Layer**: Fixed documentation layout "jumping" by implementing a stable `min-height` content base and **Sticky Sidebar** navigation.
- **Wallet UI Fix**: Resolved high-contrast visibility issues for primary action buttons in the financial dashboard.
- **Silent Reject Handling**: Handled rate-limit 429 rejections silently in the dashboard to prevent developer console pollution while maintaining user-facing alert states.

---

## [2026-04-23] - Webhook Reliability & Production Hardening
### ✨ Architectural Hardening
- **Webhook Retry System**: Implemented `scripts/webhook-retry.ts` and `WebhookLog` persistence.
- **Redemption TTL (Auto-Expiry)**: Added 48-hour automated cleanup for unclaimed vouchers.
- **Dynamic CORS & IP-Rate Limits**: Integrated per-key origin validation and per-IP spam protection.
- **Admin RBAC Enforcement**: Added server-side role checks and redirects to admin layers.

---

## [2026-04-22] - API Usage Tracking & Dashboard Analytics
- **Usage Attribution**: Refined the logic for per-app analytics and API request counting.
- **Performance**: Optimized dashboard data retrieval for real-time traffic visualization.

---

## [2026-04-19] - Region Logic & Custom Theme Parity
- **Region Management**: Updated geo-spatial logic to better handle multi-emirate deal discovery.
- **Minimalist Design**: Enforced light/dark mode parity across all dashboards (Vercel-style aesthetics).

---

## [2026-04-18] - Layout Refinement
- **Landing Page Redesign**: Completed the hero and body transition to the new premium design language.

---

## [2026-04-14] - Commission & Core Settings
- **Commission Policy**: Updated minimum commission thresholds to ensure platform sustainability.
- **Global Settings**: Implemented centralized system settings for platform parameters.

---

## [2026-04-13] - Brand Identity Phase 2
- **Unified Branding**: Comprehensive CSS variable update across the merchant and partner portals.

---

## [2026-04-12] - Responsive Design & Fintech Flow
- **Mobile optimization**: Full responsiveness across all tablet and phone screen sizes.
- **Fund Flow Phase 1**: Implemented core logic for balance management and fund movement.
- **Sandbox/Production Profiles**: Introduced the split environment for API testing.

---

## [2026-04-10] - Ecosystem Foundation (Webhooks & SDK)
- **Pulse Engine**: Initial implementation of the real-time event system.
- **JS Widget SDK**: Created the drop-in "Deals Near Me" widget for third-party sites.
- **Architecture**: Core refactor of the discovery endpoint for higher request throughput.

---

## [2026-04-08] - Financials & Withdrawal System
- **Payout Management**: Implemented the withdrawal request and automated ledger logic.
- **Mock Stripe Integration**: Added the conceptual bank-connection workflow.

---

## [2026-04-07] - Data Layer Hardening
- **Financial Schemas**: Finalized the Transaction, Commission, and Payout database models.

---

## [2026-04-06] - Admin Utility & Support
- **Ticketing System**: Integrated customer and partner support ticketing logic.
- **Super Admin**: Added elevated privileges for top-level platform management.

---

## [2026-04-05] - Admin Governance
- **Platform Configuration**: Added advanced settings for administrator control.

---

## [2026-04-02] - Brand Assets
- **Visual Identity**: Finalized the high-resolution logo and application favicon set.

---

## [2026-04-01] - Initial Commit
- **Foundation**: Set up the Next.js project with MongoDB, TailwindCSS, and core Auth structure.
