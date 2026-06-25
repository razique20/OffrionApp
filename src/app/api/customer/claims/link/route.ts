import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getCustomerFromRequest } from '@/lib/auth-customer';
import { checkIpRateLimit } from '@/lib/ipRateLimit';
import { z } from 'zod';

const linkSchema = z.object({
  code: z.string().min(4).max(12),
});

/**
 * Link a redeem code (e.g. a coupon a customer got from a partner app) to the
 * logged-in customer's account, so it appears in their claim history.
 *
 * This is TRACKING ONLY — it attaches customerId and never touches channel,
 * partnerId, amount, or the commission split. A partner-channel claim stays
 * 70/30 partner/platform regardless of who links it.
 *
 * Guardrails: only an as-yet-unredeemed (pending) claim with no existing owner
 * can be linked, and never one already linked to a different customer.
 */
export async function POST(req: Request) {
  try {
    const customer = await getCustomerFromRequest(req);
    if (!customer) {
      return NextResponse.json({ error: 'Please log in to link a coupon.' }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkIpRateLimit(`link_${ip}`, 20).allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 });
    }

    await dbConnect();
    const { code } = linkSchema.parse(await req.json());
    const normalized = code.trim().toUpperCase();

    const transaction = await Transaction.findOne({ qrCode: normalized }).populate('dealId', 'title');
    if (!transaction) {
      return NextResponse.json({ error: 'No coupon found for that code.' }, { status: 404 });
    }

    // Already linked?
    if (transaction.customerId) {
      if (transaction.customerId.toString() === customer.customerId) {
        return NextResponse.json({ message: 'This coupon is already in your account.', alreadyLinked: true });
      }
      return NextResponse.json({ error: 'This code is already linked to another account.' }, { status: 409 });
    }

    // Only unredeemed (pending) coupons can be claimed as yours.
    if (transaction.status !== 'pending') {
      return NextResponse.json({ error: 'This coupon has already been redeemed and can no longer be linked.' }, { status: 409 });
    }

    transaction.customerId = customer.customerId as any;
    await transaction.save();

    const deal = transaction.dealId as any;
    return NextResponse.json({
      message: 'Coupon linked to your account.',
      claim: {
        id: transaction._id,
        redeemCode: transaction.qrCode,
        status: transaction.status,
        dealTitle: deal?.title || 'Deal',
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Enter a valid coupon code.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
