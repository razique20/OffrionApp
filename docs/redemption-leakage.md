# Handling Redemption Leakage (Merchant Skips the Terminal)

> The risk: a customer claims a deal and gets served at the shop, but the merchant
> never enters the redeem code in our terminal — out of laziness, or to dodge the
> commission. We earn nothing. This doc explains the problem and the options.

## What happens today (our actual flow)

1. Customer claims a deal → `track-conversion` creates a `Transaction` with status
   `pending` and a 6-digit `qrCode`, valid 48h
   (`src/app/api/partners/track-conversion/route.ts:69`).
2. Customer goes to the shop, shows the code.
3. **Merchant types that code into our terminal** → `redeem` marks the transaction
   `completed` and *only now* charges commission (deducts wallet balance or accrues
   liability) (`src/app/api/merchant/redeem/route.ts:104-131`).
4. If the merchant never types the code, the transaction just expires after 48h
   (TTL deletes it) and **no commission is ever charged**.

## Why this is a problem

The merchant is simultaneously:

- the **only person who pays** the commission, and
- the **only person who triggers** the event that charges it.

So the act that costs them money is entirely under their control. A lazy or
dishonest merchant just says *"sure, here's your discount"*, hands over the deal,
and skips the terminal. Customer is happy (got the discount), merchant is happy
(saved the commission), and **we earn nothing**. This is called **redemption
leakage**, and it's the #1 revenue risk in every deals marketplace (Groupon, etc.
all fought it).

We can't make it literally impossible, but we can make *not recording* the worse
choice for the merchant. There are three families of solutions.

---

## Approach A — Reverse who scans (customer-driven redemption)

**Today:** merchant types the customer's code.
**Change:** the customer triggers the redemption from their own phone — e.g. they
scan a static QR printed at the merchant's till, or tap "Redeem now" which calls
our API, and the discount only "unlocks" on the customer's screen *after* the
redeem succeeds.

**Why it helps:** the person who *wants* the discount is now the one who completes
the recorded action. The merchant can still refuse to honor the deal — but then the
customer simply doesn't get the discount, and we've lost nothing. Leakage only
happened before because the merchant could give the discount *and* skip recording
in one move. Now those are decoupled: no record = no discount.

**Trade-offs:**

- Requires customer behavior + a "redeemed" proof screen the merchant is trained
  to look for.
- Needs the customer to be on *our* app/screen at the till (today the claim may
  live on the partner's site).
- Doesn't stop a merchant who privately tells the customer "ignore the app, I'll
  just give you 20% off cash" — but that's harder and less scalable for the
  merchant.

---

## Approach B — Charge at claim time, not at redemption (economic fix)

**Today:** commission is charged at step 3 (redemption).
**Change:** charge — or place a hold/authorization for — the commission at step 1
(claim). If the deal goes unused in the window, refund/release it.

**Why it helps:** if the merchant already owes the commission the moment the
customer claims, then *skipping the scan saves them nothing*. The entire incentive
to dodge disappears, because dodging no longer reduces their bill.

**Trade-offs:**

- Changes **who pays and when**. If the merchant pays at claim time, they're paying
  for claims that may never walk through the door — they'll hate that unless we only
  keep the charge on *confirmed* redemptions.
- More naturally pairs with shifting the small fee to the **customer or partner** at
  claim time (a booking fee model).
- More billing complexity (holds, refunds, reconciliation).

---

## Approach C — Detect and enforce (keep flow, add policing)

**Today:** we have all the raw data but don't act on it.
**Change:** measure the **claim → redemption ratio per merchant** and flag outliers.
A merchant with 300 claims and 4 redemptions is almost certainly serving off-book.
Optionally ask the customer after the visit *"Did you use this deal?"* — if
customers keep saying "yes" but the merchant never scanned, that's a smoking gun.
Then enforce per our terms: warn, suspend the deal, or delist the merchant.

**Why it helps:** it doesn't prevent any single leak, but it makes systematic
leakage **visible and punishable**, which deters it. It's the lowest-risk,
fastest-to-ship option and complements A or B rather than competing with them.

**Trade-offs:**

- Reactive, not preventive — we still lose the individual leaked transactions.
- Needs a fair baseline (some legitimate claims never convert — people change their
  minds), so we flag *anomalies*, not raw non-conversion.
- Customer confirmation adds a touchpoint and only works if we can reach the
  customer after the visit.

---

## How to frame the decision

- **A** fixes the *mechanism* (who triggers the record).
- **B** fixes the *incentive* (skipping no longer saves money).
- **C** fixes the *accountability* (leakage becomes visible and costly).

They stack. In practice most marketplaces do **C immediately** (cheap, ships now,
gives data on how bad the problem actually is), then layer in **A** for prevention.
**B** is the strongest but it's a pricing/business-model change, so it's the one
that needs the most deliberate call.

The two things that genuinely depend on the business model, not engineering:

1. **Who should bear the commission** — merchant (today), merchant but billed
   earlier, or shift some to customer/partner.
2. **How aggressive to be** — pure detection vs. actually changing the redemption
   mechanic.

Suggested starting point: **Approach C (detection dashboard)** since it's safe,
reversible, and will tell us how big the leak really is before changing anything
structural.
