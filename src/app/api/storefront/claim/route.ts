import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import Transaction from '@/models/Transaction';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { getCustomerFromRequest } from '@/lib/auth-customer';
import { checkIpRateLimit } from '@/lib/ipRateLimit';
import { z } from 'zod';
import mongoose from 'mongoose';

const claimSchema = z.object({
  dealId: z.string(),
});

// 6-digit alphanumeric code, avoiding ambiguous characters
function generateRedeemCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

/**
 * First-party ('direct') claim. Works for anonymous guests and logged-in
 * customers alike. No partner is involved, so the transaction is recorded with
 * channel: 'direct' (partnerShare resolves to 0 at redemption — platform takes all).
 */
export async function POST(req: Request) {
  try {
    await dbConnect();

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkIpRateLimit(ip, 30).allowed) {
      return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { dealId } = claimSchema.parse(await req.json());
    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const deal = await Deal.findOne({
      _id: dealId,
      isActive: true,
      status: 'active',
      storefrontVisible: true,
      validUntil: { $gte: new Date() },
    });
    if (!deal) {
      return NextResponse.json({ error: 'Deal not available' }, { status: 404 });
    }

    // Respect usage limit (0 = unlimited)
    if (deal.usageLimit > 0 && deal.currentUsage >= deal.usageLimit) {
      return NextResponse.json({ error: 'This deal is fully claimed' }, { status: 409 });
    }

    const customer = await getCustomerFromRequest(req);
    const redeemCode = generateRedeemCode();

    const transaction = await Transaction.create({
      dealId: deal._id,
      merchantId: deal.merchantId,
      channel: 'direct',
      customerId: customer ? new mongoose.Types.ObjectId(customer.customerId) : undefined,
      amount: deal.discountedPrice,
      currency: 'USD',
      status: 'pending',
      qrCode: redeemCode,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    await AnalyticsEvent.create({
      type: 'conversion',
      dealId: deal._id,
      merchantId: deal.merchantId,
      metadata: { transactionId: transaction._id, channel: 'direct', redeemCode },
    });

    await Deal.findByIdAndUpdate(deal._id, { $inc: { currentUsage: 1 } });

    return NextResponse.json({
      message: 'Deal claimed. Show this code at the merchant to redeem.',
      transactionId: transaction._id,
      redeemCode,
      status: 'pending',
      expiresAt: transaction.expiresAt,
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
