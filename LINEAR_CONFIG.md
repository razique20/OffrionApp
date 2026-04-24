# Offrion Production Launch Checklist (Linear Config)

This is a comprehensive task list for your Linear workspace, covering Infrastructure, Security, Edge Cases, Operations, and Business Growth.

---

## 🔵 Team: Partner Hub (Distribution)
- [ ] **[UI]** Revoke API Key workflow: Verify the UI updates instantly and API calls immediately fail after revocation.
- [ ] **[SEC]** Key Origin Check: Test that a key with `allowedOrigins: ["example.com"]` fails when called from `attacker.com`.
- [ ] **[API]** Rate Limit Verification: Run a load script to confirm that IP-based limiting (60/min) and Key-based limiting are enforced.
- [ ] **[LOG]** Analytics Attribution: Verify that a conversion is correctly attributed to the specific `apiKeyId` that generated the initial click.
- [ ] **[DEV]** Sandbox Isolation: Verify that "Sandbox" transactions do not appear in the Partner's "Total Earned" live balance.

---

## 🟢 Team: Merchant Dash (Operations)
- [ ] **[FIN]** Wallet Balance Edge Case: Attempt a redemption when the merchant's prepaid balance is exactly equal to the commission.
- [ ] **[FIN]** Post-paid Liability: For `card_on_file` merchants, verify that `accruedLiability` increments correctly without deducting from `balance`.
- [ ] **[UX]** QR Scanner Logic: Verify the "Scan with Camera" button shows the correct placeholder alert.
- [ ] **[SEC]** IDOR Verification: Verify that the `PUT /api/merchant/deals/[id]` endpoint rejects requests if the `merchantId` in the JWT doesn't match the deal.
- [ ] **[DATA]** TTL Cleanup: Manually set a transaction `expiresAt` to 1 minute ago and verify MongoDB deletes it.

---

## 🟠 Team: Operations & Business (Admin Team)
### Phase 1: Pre-Deployment Setup
- [ ] **[DOMAIN]** Purchase core domain (`offrion.com`) and regional TLDs (e.g. `.ae`).
- [ ] **[LEGAL]** Finalize Terms of Service and Privacy Policy (focus on data attribution and payout schedules).
- [ ] **[FIN]** Activate Stripe Connect Live Account: Complete platform-level verification.
- [ ] **[BRAND]** Social Media Handle audit: Secure handles on LinkedIn, Twitter, and Instagram.

### Phase 2: Deployment & Launch
- [ ] **[SMTP]** Set up Transactional Email (SendGrid/Resend) for notifications.
- [ ] **[SEO]** Launch metadata audit (Titles, Descriptions, OpenGraph tags).
- [ ] **[SUPPORT]** Create Merchant Help Docs (Simple PDF or Notion page for QR scanning).

### Phase 3: Post-Deployment Marketing
- [ ] **[MARKETING]** Partner Launch Outreach: Schedule 1-on-1 demos with the first 5 target bank partners.
- [ ] **[ADS]** Set up Meta/Google Pixel for remarketing to merchants.
- [ ] **[CONTENT]** Publish "Partner Integration Guide" blog post to build SEO authority.

---

## 🔴 Team: Infrastructure & Governance (DevOps)
- [ ] **[GOV]** Role-Based Access: Verify that active Partner accounts are redirected away from the `/admin` path.
- [ ] **[OPS]** Webhook Logic: Force a 500 error on a partner webhook -> Run `webhook-retry.ts` -> Verify it successfully retries.
- [ ] **[PROD]** Vercel Environment Audit: Verify all `.env.local` keys are mirrored in the Vercel Production Environment.
- [ ] **[PROD]** Cron Configuration: Set up the production schedule for the background retry worker.
