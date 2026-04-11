import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SandboxTransaction from '@/models/SandboxTransaction';
import SandboxDeal from '@/models/SandboxDeal';
import SandboxCommission from '@/models/SandboxCommission';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import mongoose from 'mongoose';
import { z } from 'zod';
import { dispatchWebhook } from '@/lib/webhooks';

const redeemSchema = z.object({
  redeemCode: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { redeemCode } = redeemSchema.parse(body);

    const transaction = await SandboxTransaction.findOne({ 
      qrCode: redeemCode.toUpperCase(), 
      status: 'pending' 
    }).populate('dealId');

    if (!transaction) {
      return NextResponse.json({ error: 'Sandbox transaction not found or already redeemed' }, { status: 404 });
    }

    const deal = transaction.dealId as any;
    
    // Security check: Only the merchant who owns the deal can redeem it
    if (deal.merchantId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this sandbox deal' }, { status: 403 });
    }

    // Mark transaction as completed
    transaction.status = 'completed';
    transaction.redeemedAt = new Date();
    await transaction.save();

    // --- Log Conversion Analytics Event ---
    await AnalyticsEvent.create({
      type: 'conversion',
      dealId: deal._id,
      partnerId: new mongoose.Types.ObjectId(transaction.partnerId.toString()),
      merchantId: deal.merchantId,
      environment: 'sandbox',
      metadata: { transactionId: transaction._id },
    });

    // --- Automated Sandbox Commission ---
    const commissionRate = deal.commissionPercentage / 100;
    const totalCommission = deal.discountedPrice * commissionRate;
    const partnerShare = Math.round(totalCommission * 0.70 * 100) / 100;
    const platformShare = Math.round(totalCommission * 0.30 * 100) / 100;

    const commission = await SandboxCommission.create({
      transactionId: transaction._id,
      partnerId: new mongoose.Types.ObjectId(transaction.partnerId.toString()),
      merchantId: deal.merchantId,
      amount: Math.round(totalCommission * 100) / 100,
      partnerShare,
      platformShare,
      status: 'pending',
    });

    // --- Dispatch Sandbox Webhook ---
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
      },
      'sandbox'
    ).catch(err => console.error('[Sandbox Webhook Trigger Error]:', err));

    return NextResponse.json({ 
      message: 'Sandbox deal redeemed successfully',
      environment: 'sandbox',
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
