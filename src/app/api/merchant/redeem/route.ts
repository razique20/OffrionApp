import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Deal from '@/models/Deal';
import Commission from '@/models/Commission';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import MerchantProfile from '@/models/MerchantProfile';
import { z } from 'zod';
import { dispatchWebhook } from '@/lib/webhooks';
import { normalizeRedeemCode } from '@/lib/redeemCode';

const redeemSchema = z.object({
  transactionId: z.string().optional(),
  // Accept the code with or without the OFFRION- prefix / spaces; normalized below.
  redeemCode: z.string().min(4).max(40).optional(),
}).refine(
  (data) => data.transactionId || data.redeemCode,
  { message: 'Either transactionId or redeemCode is required' }
);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, redeemCode } = redeemSchema.parse(body);

    // Look up transaction by ID or redeem code (prefix/spacing tolerant)
    let transaction;
    if (transactionId) {
      transaction = await Transaction.findById(transactionId).populate('dealId');
    } else {
      transaction = await Transaction.findOne({
        qrCode: normalizeRedeemCode(redeemCode!),
        status: 'pending'
      }).populate('dealId');
    }

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }


    const deal = transaction.dealId as any;
    
    // Security check: Only the merchant who owns the deal can redeem it
    if (deal.merchantId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this deal' }, { status: 403 });
    }

    if (transaction.status === 'completed' && transaction.redeemedAt) {
      return NextResponse.json({ error: 'Transaction already redeemed' }, { status: 400 });
    }

    // --- Automated Commission Engine ---
    // Split depends on the claim channel, not on whether a customer account exists:
    //  - 'partner' claims keep the standard 70/30 partner/platform split.
    //  - 'direct' (first-party storefront) claims have no partner, so the
    //    platform takes the full commission.
    const isDirect = transaction.channel === 'direct' || !transaction.partnerId;
    const commissionRate = deal.commissionPercentage / 100;
    const totalCommission = deal.discountedPrice * commissionRate;
    const partnerShare = isDirect ? 0 : Math.round(totalCommission * 0.70 * 100) / 100;
    const platformShare = isDirect
      ? Math.round(totalCommission * 100) / 100
      : Math.round(totalCommission * 0.30 * 100) / 100;

    // --- Wallet Deduction Logic ---
    // Perform balance check BEFORE modifying the transaction status.
    const profile = await MerchantProfile.findOne({ userId: deal.merchantId });
    if (!profile) {
      return NextResponse.json({ error: 'Merchant profile not found' }, { status: 404 });
    }

    let commissionStatus: 'pending' | 'cleared' = 'pending';

    if (profile.billingPreference === 'prepaid') {
      if (profile.balance < totalCommission) {
        return NextResponse.json({ 
          error: 'Insufficient wallet balance', 
          required: totalCommission,
          current: profile.balance
        }, { status: 402 });
      }
      
      // Deduct balance
      profile.balance = Math.max(0, profile.balance - totalCommission);
      commissionStatus = 'cleared';
    } else if (profile.billingPreference === 'card_on_file') {
      // Dynamic Credit Risk Gateway
      const currentLiability = profile.accruedLiability || 0;
      const limit = profile.creditLimit || 0;
      if (currentLiability + totalCommission > limit) {
        return NextResponse.json({ 
          error: 'Credit limit exceeded for post-paid billing. Please settle your invoice or switch to a prepaid wallet.', 
          required: totalCommission,
          currentLiability,
          creditLimit: limit
        }, { status: 402 });
      }

      // Increment accrued liability
      profile.accruedLiability = currentLiability + totalCommission;
      commissionStatus = 'pending'; // Stays pending until admin settles it
    }

    // --- All checks passed! Execute state mutations ---

    // Mark transaction as completed and disable TTL removal
    transaction.status = 'completed';
    transaction.redeemedAt = new Date();
    transaction.expiresAt = undefined; 
    await transaction.save();

    await profile.save();

    // --- Log Conversion Analytics Event ---
    await AnalyticsEvent.create({
      type: 'conversion',
      dealId: deal._id,
      partnerId: transaction.partnerId,
      merchantId: deal.merchantId,
      metadata: { transactionId: transaction._id, channel: transaction.channel },
    });

    const commission = await Commission.create({
      transactionId: transaction._id,
      partnerId: transaction.partnerId,
      merchantId: deal.merchantId,
      amount: Math.round(totalCommission * 100) / 100,
      partnerShare,
      platformShare,
      status: commissionStatus,
    });

    // --- Dispatch Real-Time Webhook (Fire-and-forget) ---
    // Only partner-channel claims notify a partner — direct claims have none.
    if (!isDirect && transaction.partnerId) {
      dispatchWebhook(
        transaction.partnerId.toString(),
        'deal.redeemed',
        {
          transactionId: transaction._id,
          dealId: deal._id,
          dealTitle: deal.title,
          amount: deal.discountedPrice,
          partnerShare: commission.partnerShare,
          redeemedAt: transaction.redeemedAt,
        }
      ).catch(err => console.error('[Webhook Trigger Error]:', err));
    }

    return NextResponse.json({ 
      message: 'Deal redeemed successfully',
      transaction: {
        id: transaction._id,
        redeemedAt: transaction.redeemedAt,
        dealTitle: deal.title,
        originalPrice: deal.originalPrice,
        discountedPrice: deal.discountedPrice,
      },
      commission: {
        id: commission._id,
        total: commission.amount,
        partnerShare: commission.partnerShare,
        platformShare: commission.platformShare,
      },
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
