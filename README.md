# 🚀 Offrion: Deals-as-a-Service Platform

Offrion is a high-performance, scalable SaaS ecosystem designed to bridge the gap between merchants and affiliate partners. Merchants can publish, manage, and track hyper-local deals, while partners can discover and integrate these deals into their own applications via a robust, geo-spatial API.

---

## 🎭 Role-Based Portals

### 🏪 Merchant Dashboard (`/merchant`)
A dedicated suite for business owners to drive sales and monitor performance.
- **Deal Lifecycle**: Full CRUD operations with support for scheduling (valid from/until) and usage limits.
- **Analytics Engine**: High-fidelity data visualization using Recharts, featuring conversion funnels and revenue trending.
- **QR Redemption**: Integrated flow for secure in-store deal redemption.
- **Profile Settings**: Self-service management of business identity and contact details.

### 🤝 Partner Portal (`/partner`)
A comprehensive developer ecosystem for affiliate growth.
- **API Key Management**: Secure generation and lifecycle control (Revoke/Reactivate) for integration keys.
- **Technical Documentation**: Interactive API reference with examples for advanced filtering.
- **Support Center**: Categorized help center and dedicated ticketing system.
- **Integration Analytics**: Real-time tracking of partner-driven impressions and clicks.

### 🛡️ Admin Portal (`/admin`)
Global oversight and platform governance.
- **System Health**: Overview of platform-wide transactions and commission revenue.
- **Content Moderation**: Management of merchant accounts and deal categories.

---

## 🛠️ Technical Architecture

### Core Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Design System**: Vanilla CSS + [Tailwind CSS](https://tailwindcss.com/) using a custom `oklch` vibrant palette.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Key Architectural Decisions
- **Edge-Ready Auth**: Decoupled database models from middleware to support Next.js Edge Runtime for global low-latency session validation.
- **API-First Design**: Native support for geo-spatial queries (`$nearSphere`) and full-text search.
- **Unified Settings**: Shared component architecture (`SettingsForm.tsx`) for consistent profile management across roles.
- **Stable Navigation**: Most-specific-match algorithm for sidebar highlighting, preventing UX conflicts in nested routes.

---

## 📡 API Reference Summary

### List Deals
`GET /api/deals`
| Parameter | Type | Description |
|---|---|---|
| `x-api-key` | **Header** | Required for authentication. |
| `lat` / `lng` | Query | Latitude and Longitude for proximity search. |
| `radius` | Query | Search radius in meters (default: 10km). |
| `categoryId` | Query | Filter by category ID. |
| `search` | Query | Multi-field text search. |

### Track Engagement
`POST /api/deals/[id]/click`
| Parameter | Type | Description |
|---|---|---|
| `x-api-key` | **Header** | Required for attribution. |
| `id` | **Path** | The unique ID of the deal. |

---

## 🏁 Getting Started

### 1. Environment Configuration
Create `.env.local` in the root directory:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
# Local development defaults to http://localhost:3000
```

### 2. Database Seeding
Populate your environment with verified test credentials:
```bash
npx tsx scripts/seed.ts
```
**Test Credentials:**
- **Merchant**: `merchant@example.com` / `password123`
- **Partner**: `partner@example.com` / `password123`

### 3. Installation & Boot
```bash
npm install
npm run dev
```

---

## ⚡ Recent Milestones
- [x] **Stabilized Auth**: Fixed Edge Runtime compatibility and "No token" errors.
- [x] **Analytics Suite**: Launched Merchant revenue and conversion tracking.
- [x] **Partner Portals**: Fully implemented Keys, Docs, and Support gateways.
- [x] **Unified Settings**: Standardized profile management for all users.
- [x] **Navigation Fix**: Resolved Sidebar "multiple active" highlighting bugs.

---
Built with 🖤 by **Antigravity**
