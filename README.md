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

---

## 📡 Partner API Reference

Offrion provides a high-performance, geo-spatial REST API for partners. All responses are returned in **JSON** format.

### 1. Authentication
Include your partner API key in the request headers:
`x-api-key: YOUR_PUBLIC_API_KEY`

### 2. Discover Deals
`GET /api/deals`
Supports 14 query parameters for precision targeting:

| Category | Parameter | Type | Description |
|---|---|---|---|
| **Core** | `categoryId` | String | Multi-filter (comma-separated ID list). |
| | `search` | String | Keyword search in title/description. |
| **Type** | `eventType` | Enum | `flash`, `holiday`, `seasonal`, `clearance`, `general`. |
| | `dealType` | Enum | `percentage`, `flat`, `bogo`, `free-item`. |
| **Audience** | `audience` | Enum | `student`, `senior`, `member`, `all`. |
| **Value** | `minDiscount` | Number | Minimum discount percentage (e.g., `30`). |
| | `maxDiscount` | Number | Maximum discount percentage. |
| | `minPrice` | Number | Minimum discounted price. |
| **Location** | `lat` / `lng` | Number | Coordinates for proximity search. |
| | `radius` | Number | Search radius in meters (default: 10,000). |
| **Time** | `activeNow` | Boolean | Set `true` to show only currently valid deals. |
| | `from` / `to` | Date | Date range for deal validity windows. |
| **Utility** | `page` / `limit` | Number | Pagination controls (default: 20 per page). |

### 3. Track Engagement & Attribution
Properly logging clicks and conversions is critical for commission attribution.

- **Track Click**: `POST /api/partners/track-click`
  ```json
  { "dealId": "654a..." }
  ```
- **Track Conversion**: `POST /api/partners/track-conversion`
  ```json
  { "dealId": "654a...", "amount": 49.99 }
  ```

---

## 🛠️ Partner Integration Guide (v1.0)

Follow these 3 steps to integrate Offrion into your system:

### 1. Header Requirement
Every request to the public API must include your `x-api-key`. This key maps all traffic to your partner account for real-time earnings tracking.

### 2. The "Deals Near Me" Implementation
To provide value to local users, use the geo-spatial filters.
`GET /api/deals?lat={lat}&lng={lng}&radius=5000`
*This returns all deals within 5km of the user's current coordinates.*

### 3. Handle attribution correctly
When a user clicks a deal in your UI, trigger a `POST` to `/api/partners/track-click`. This creates a session log that guarantees you get credited even if the user completes the purchase later on.

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
- **Admin**: `admin@offrion.com` / `password123`
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
