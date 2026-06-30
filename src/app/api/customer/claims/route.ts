import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Customer from '@/models/Customer';
import { getCustomerFromRequest } from '@/lib/auth-customer';
import { tokensForRedemption } from '@/lib/tokens';

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

  // --- Reconcile token balance from redeemed claims (beta) ---
  // The balance is derived from claims so it can't drift: we stamp tokensAwarded
  // on any redeemed-but-unawarded claim (e.g. redeemed before this feature, or
  // linked after the scan), then set the customer balance to the sum of all
  // awarded tokens. This both backfills new redemptions and self-heals a balance
  // that fell out of sync with the per-claim awards. (Limited to the 100 most
  // recent claims loaded above — sufficient while in beta.)
  for (const c of claims) {
    if (c.status === 'completed' && !c.tokensAwarded && c.dealId) {
      const award = tokensForRedemption(c.dealId as any);
      if (award > 0) {
        await Transaction.updateOne({ _id: c._id }, { $set: { tokensAwarded: award } });
        c.tokensAwarded = award; // reflect in this response
      }
    }
  }
  const totalTokens = claims.reduce(
    (sum: number, c: any) => sum + (c.status === 'completed' ? c.tokensAwarded || 0 : 0),
    0
  );

  const customer = await Customer.findById(payload.customerId).select('tokens').lean();
  if ((customer as any) && (customer as any).tokens !== totalTokens) {
    await Customer.updateOne({ _id: payload.customerId }, { $set: { tokens: totalTokens } });
    (customer as any).tokens = totalTokens;
  }

  const data = claims.map((c: any) => ({
    id: c._id,
    status: c.status,
    redeemCode: c.qrCode,
    redeemedAt: c.redeemedAt || null,
    expiresAt: c.expiresAt || null,
    channel: c.channel,
    tokensAwarded: c.tokensAwarded || 0,
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

  return NextResponse.json({ claims: data, tokens: (customer as any)?.tokens || 0 });
}
