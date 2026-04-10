import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Deal from '@/models/Deal';
import Commission from '@/models/Commission';
import mongoose from 'mongoose';
import { z } from 'zod';
import { dispatchWebhook } from '@/lib/webhooks';

const redeemSchema = z.object({
  transactionId: z.string().optional(),
  redeemCode: z.string().length(6).optional(),
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

    // Look up transaction by ID or 6-digit redeem code
    let transaction;
    if (transactionId) {
      transaction = await Transaction.findById(transactionId).populate('dealId');
    } else {
      transaction = await Transaction.findOne({ 
        qrCode: redeemCode!.toUpperCase(), 
        status: 'pending' 
      }).populate('dealId');
    }

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // --- Environment Segregation ---
    // Prevent sandbox transactions from being redeemed in the production terminal
    if (transaction.environment === 'sandbox') {
      return NextResponse.json({ 
        error: 'This is a sandbox transaction and cannot be redeemed in the production terminal.' 
      }, { status: 400 });
    }

    const deal = transaction.dealId as any;
    
    // Security check: Only the merchant who owns the deal can redeem it
    if (deal.merchantId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this deal' }, { status: 403 });
    }

    if (transaction.status === 'completed' && transaction.redeemedAt) {
      return NextResponse.json({ error: 'Transaction already redeemed' }, { status: 400 });
    }

    // Mark transaction as completed
    transaction.status = 'completed';
    transaction.redeemedAt = new Date();
    await transaction.save();

    // --- Automated Commission Engine ---
    const commissionRate = deal.commissionPercentage / 100;
    const totalCommission = deal.discountedPrice * commissionRate;
    const partnerShare = Math.round(totalCommission * 0.70 * 100) / 100;
    const platformShare = Math.round(totalCommission * 0.30 * 100) / 100;

    const commission = await Commission.create({
      transactionId: transaction._id,
      partnerId: new mongoose.Types.ObjectId(transaction.partnerId.toString()),
      merchantId: deal.merchantId,
      amount: Math.round(totalCommission * 100) / 100,
      partnerShare,
      platformShare,
      environment: transaction.environment || 'production',
      status: 'pending',
    });

    // --- Dispatch Real-Time Webhook (Fire-and-forget) ---
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
      transaction.environment || 'production'
    ).catch(err => console.error('[Webhook Trigger Error]:', err));

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
