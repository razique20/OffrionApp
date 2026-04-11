# Project Detailed Overview: Offrion

Offrion is a sophisticated **Deals-as-a-Service (DaaS)** SaaS ecosystem designed to connect hyper-local merchants with affiliate partner applications. It streamlines deal discovery, attribution, and financial settlement through a robust API and specialized portals.

---

## 🏗️ Technical Architecture
- **Framework**: Next.js 15/16 (App Router, Turbopack)
- **Database**: MongoDB with Mongoose (Geo-spatial indexing enabled)
- **Styling**: Tailwind CSS 4 with custom `oklch` vibrant color tokens.
- **Payments**: Stripe Connect (70/30 Commission Engine)
- **Analytics**: Recharts for high-fidelity data visualization.

---

## 🎭 User Roles & Capabilities

### 🏪 Merchant Portal (`/merchant`)
Designed for business owners to drive footfall and track ROI.
- **Deal Management**: Full lifecycle (CRUD) with scheduling and usage limits.
- **Scan & Redeem**: Mobile-optimized terminal for QR code validation.
- **Revenue Analytics**: Visual tracking of sales, conversion funnels, and partner performance.
- **Wallet**: Integrated treasury for managing withdrawable revenue via Stripe.

### 🤝 Partner Portal (`/partner`)
A developer-centric hub for third-party integrators (influencers, apps, blogs).
- **API Ecosystem**: Secure key management (Production vs. Sandbox).
- **Interactive Playground**: Real-time testing of API endpoints.
- **Earning Analytics**: Track referral impressions, clicks, and commissions.
- **Financial Vault**: Management of the **70% commission share** on every successful redemption.

### 🛡️ Admin Portal (`/admin`)
Operational control center for platform governance.
- **System Overwatch**: Global transaction monitoring and platform revenue (30% share).
- **Moderation Engine**: Merchant verification and deal approval queue.

---

## 📡 API Architecture
The platform is built on an **API-First** philosophy, primarily serving the `/api/deals` endpoint for discovery.

| Endpoint | Method | Key Feature |
| :--- | :--- | :--- |
| `/api/deals` | [GET](file:///Users/raziquemk/Desktop/OffrionApp/src/app/api/deals/route.ts#9-174) | Geo-spatial (`$nearSphere`), search, and 14+ filters. |
| `/api/partners/track-click` | [POST](file:///Users/raziquemk/Desktop/OffrionApp/src/app/api/merchant/redeem/route.ts#18-125) | First-touch attribution logging. |
| `/api/partners/track-conversion` | [POST](file:///Users/raziquemk/Desktop/OffrionApp/src/app/api/merchant/redeem/route.ts#18-125) | Middle-ware for tracking potential sales. |
| `/api/merchant/redeem` | [POST](file:///Users/raziquemk/Desktop/OffrionApp/src/app/api/merchant/redeem/route.ts#18-125) | Finalizes transaction; triggers 70/30 commission split. |

---

## 🚀 Prototype Deployment Checklist
Before deploying the prototype, the following "business-critical" loops should be finalized:

### 1. Financial Settlement (Highest Priority)
- [ ] **Stripe Webhook Listeners**: Ensure `api/webhooks/stripe` handles account updates and payout confirmations.
- [ ] **Payout Validation**: Verify the `api/wallet/payout` backend logic enforces minimum balances and correct currency rounding.

### 2. Trust & Safety
- [ ] **Merchant KYC Flow**: Fully implement the "Verification Pending" state for new merchants (restricting deal publishing until approved).
- [ ] **Admin Approval UI**: Ensure the Admin can "Approve/Reject" deals within the `/admin/moderation` dashboard.

### 3. User Experience
- [ ] **Real-world QR Test**: Conduct an end-to-end "Scan-to-Pay" test on mobile to ensure the `redeem` UI is seamless under low-latency network conditions.
- [ ] **Onboarding Guides**: Add tooltips or a "Quick Start" tour for new Partners to find their first API key.

### 4. Technical Debt
- [ ] **Error Boundary Polish**: Add custom error pages for 403 (Invalid API Key) to help developers debug faster.
- [ ] **Seeding Update**: Ensure [scripts/seed.ts](file:///Users/raziquemk/Desktop/OffrionApp/scripts/seed.ts) includes a set of "Hot Deals" that look great on the initial dashboard.

---
*Built & Documented by Offrion Engineering*
