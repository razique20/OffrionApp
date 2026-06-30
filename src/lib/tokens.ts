/**
 * Offrion token rewards (beta).
 *
 * Customers earn tokens when a claimed deal is actually redeemed at the
 * merchant (i.e. the redeem code gets scanned in store). Crediting on
 * redemption — not on claim — gives the customer a reason to complete the
 * in-store scan, which is what reduces merchant claim leakage.
 *
 * Beta note: tokens have no published monetary value yet; we only surface the
 * count. The formula is deterministic so a given deal always awards the same
 * amount.
 */

/** Tokens granted on every redemption, before any savings bonus. */
export const TOKEN_BASE_REWARD = 10;

type DealLike = {
  originalPrice?: number | null;
  discountedPrice?: number | null;
};

/**
 * Tokens awarded for redeeming a deal: a flat base plus one per unit of
 * currency saved (original − discounted). Always at least the base, never
 * negative, and rounded to a whole number.
 */
export function tokensForRedemption(deal: DealLike): number {
  const original = Number(deal?.originalPrice) || 0;
  const discounted = Number(deal?.discountedPrice) || 0;
  const savings = Math.max(0, original - discounted);
  return TOKEN_BASE_REWARD + Math.round(savings);
}
