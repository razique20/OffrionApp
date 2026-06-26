import * as jose from 'jose';

/**
 * Customer (end-user) auth, kept fully separate from staff auth in `auth.ts`.
 * Uses its own cookie name and token `aud` so a customer session can never be
 * mistaken for a staff (admin/merchant/partner) session, and vice versa.
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-dev'
);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export const CUSTOMER_COOKIE = 'customer_token';
const CUSTOMER_AUD = 'customer';

export interface CustomerTokenPayload {
  customerId: string;
  email: string;
}

export async function generateCustomerToken(payload: CustomerTokenPayload): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(CUSTOMER_AUD)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

export async function verifyCustomerToken(token: string): Promise<CustomerTokenPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, { audience: CUSTOMER_AUD });
    return { customerId: payload.customerId as string, email: payload.email as string };
  } catch {
    return null;
  }
}

/** Reads the customer cookie from a request and returns the payload, or null. */
export async function getCustomerFromRequest(req: Request): Promise<CustomerTokenPayload | null> {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${CUSTOMER_COOKIE}=([^;]+)`));
  if (!match) return null;
  return verifyCustomerToken(decodeURIComponent(match[1]));
}
