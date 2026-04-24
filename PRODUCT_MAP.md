# Offrion Master Capability Map

This document outlines all current and implemented features of the Offrion platform.

## 1. Merchant Capabilities
### Major
- **Dynamic Deal Engine**: Full CRUD for deals with temporal (validity) and spatial (location) controls.
- **Voucher Redemption**: Synchronous validation of 6-digit codes/QR codes.
- **Financial Treasury**: Integrated wallet for commission management (Prepaid & Liability tracking).
- **KYC Portal**: Merchant identity verification and document management.
### Minor
- **Storefront Branding**: Merchant profile customization.
- **Redemption History**: Searchable log of past conversions.
- **Usage Limiting**: Hard-caps on how many times a deal can be claimed.

## 2. Partner Capabilities
### Major
- **Deals API**: RESTful programmatic access to filtered deal inventory.
- **Attribution Logic**: Multi-stage (Click/Conversion) event tracking.
- **Ecosystem SDK**: JS widget for zero-code integration.
- **Commission Split**: Automated transaction-level settlement (70% Partner / 30% Platform).
### Minor
- **Key Management**: Dynamic creation and revocation of integration keys.
- **Sandbox Environment**: Mock data toggle for development.
- **Webhook Dispatch**: Signed notifications for real-time data sync.

## 3. Platform & Admin Governance
### Major
- **Central Moderation**: Approval workflow for Merchants and Individual Deals.
- **Financial Settlements**: Admin clearing house for payout management.
- **Governance Automation**: Auto-activation of merchant deals upon KYC approval.
### Minor
- **RBAC**: Strict Role-Based Access Control enforcing Admin vs Partner/Merchant boundaries.
- **Category Taxonomy**: Global management of deal categories and visual metadata.
- **Health Monitoring**: Background worker for webhook retry and system maintenance.

## 4. Technical Foundations
### Security
- **IP Rate Limiting**: Anti-spam protection for public endpoints.
- **Key Rate Limiting**: Per-partner usage tiers.
- **CORS Lock**: Domain-level origin validation for API keys.
- **TTL Expiry**: 48-hour automated cleanup for unclaimed voucher data.
### Performance
- **Indexed Search**: Optimized geo-spatial and status filtering.
- **Atomic Transactions**: Database level consistency for wallet deductions.
