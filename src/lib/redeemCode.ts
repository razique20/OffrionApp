/**
 * Offrion redeem-code helpers.
 *
 * The stored/redeemable code is a short 6-char alphanumeric (e.g. "AB12CD").
 * Customers see it branded as "OFFRION-AB12CD" so they recognise it as an
 * Offrion coupon. Wherever we look a code up (customer link, merchant redeem,
 * landing page) we normalize first, so any of these inputs resolve correctly:
 *   "AB12CD", "ab12cd", "OFFRION-AB12CD", "offrion-ab12cd",
 *   "OFFRION AB12CD", " offrion - ab 12 cd ", "OFFRIONAB12CD"
 */

export const CODE_PREFIX = 'OFFRION';

/** Normalize any user/partner-supplied code to the canonical stored form. */
export function normalizeRedeemCode(input: string): string {
  if (!input) return '';
  let s = input.toUpperCase();
  // Drop everything that isn't a letter or digit (spaces, dashes, etc.)
  s = s.replace(/[^A-Z0-9]/g, '');
  // Strip a leading OFFRION prefix if present.
  if (s.startsWith(CODE_PREFIX)) {
    s = s.slice(CODE_PREFIX.length);
  }
  return s;
}

/** Render a stored code in its customer-facing branded form. */
export function displayRedeemCode(code: string): string {
  return `${CODE_PREFIX}-${(code || '').toUpperCase()}`;
}
