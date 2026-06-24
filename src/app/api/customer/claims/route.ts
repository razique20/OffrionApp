import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getCustomerFromRequest } from '@/lib/auth-customer';

/**
 * A logged-in customer's claim history (across both direct and partner channels,
 * wherever their customerId was attached). Guests have no history.
 */
export async function GET(req: Request) {
  const payload = await getCustomerFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const claims = await Transaction.find({ customerId: payload.customerId })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('dealId', 'title images discountedPrice originalPrice discountPercentage')
    .lean();

  const data = claims.map((c: any) => ({
    id: c._id,
    status: c.status,
    redeemCode: c.qrCode,
    redeemedAt: c.redeemedAt || null,
    expiresAt: c.expiresAt || null,
    channel: c.channel,
    createdAt: c.createdAt,
    deal: c.dealId
      ? {
          id: c.dealId._id,
          title: c.dealId.title,
          image: c.dealId.images?.[0] || null,
          discountedPrice: c.dealId.discountedPrice,
          originalPrice: c.dealId.originalPrice,
          discountPercentage: c.dealId.discountPercentage,
        }
      : null,
  }));

  return NextResponse.json({ claims: data });
}
