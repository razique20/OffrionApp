import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { normalizeRedeemCode, displayRedeemCode } from '@/lib/redeemCode';

/**
 * Public lookup for the branded redemption landing page (/c/[code]).
 * Resolves a coupon by its (prefix/space-tolerant) code and returns the deal
 * summary + status. No auth — anyone with the code can view it.
 */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const normalized = normalizeRedeemCode(code);
    if (!normalized) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    await dbConnect();
    const tx = await Transaction.findOne({ qrCode: normalized })
      .populate('dealId', 'title images discountedPrice originalPrice discountPercentage')
      .lean();

    if (!tx) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const t = tx as any;
    const deal = t.dealId;
    return NextResponse.json({
      code: normalized,
      displayCode: displayRedeemCode(normalized),
      status: t.status,
      expiresAt: t.expiresAt || null,
      alreadyOwned: !!t.customerId,
      deal: deal
        ? {
            title: deal.title,
            image: deal.images?.[0] || null,
            originalPrice: deal.originalPrice,
            discountedPrice: deal.discountedPrice,
            discountPercentage: deal.discountPercentage,
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
