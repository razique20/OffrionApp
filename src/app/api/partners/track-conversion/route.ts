import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import SandboxDeal from '@/models/SandboxDeal';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Transaction from '@/models/Transaction';
import SandboxTransaction from '@/models/SandboxTransaction';
import Commission from '@/models/Commission';
import { z } from 'zod';
import mongoose from 'mongoose';

const conversionSchema = z.object({
  dealId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  metadata: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // API Key Validation
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }

    const apiKey = await APIKey.findOne({ key: apiKeyHeader, isActive: true });
    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
    }

    const { dealId, amount, currency, metadata } = conversionSchema.parse(body);

    const isSandbox = apiKey.environment === 'sandbox';

    const deal = isSandbox 
      ? await SandboxDeal.findById(dealId)
      : await Deal.findById(dealId);

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Helper to generate 6-digit alphanumeric code
    const generateRedeemCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const redeemCode = generateRedeemCode();

    // 1. Create Transaction (as Pending)
    let transaction;
    if (isSandbox) {
      transaction = await SandboxTransaction.create({
        dealId: new mongoose.Types.ObjectId(dealId),
        merchantId: deal.merchantId,
        partnerId: new mongoose.Types.ObjectId(apiKey.partnerId.toString()),
        amount,
        currency,
        status: 'pending',
        qrCode: redeemCode,
      });
    } else {
      transaction = await Transaction.create({
        dealId: new mongoose.Types.ObjectId(dealId),
        merchantId: deal.merchantId,
        partnerId: new mongoose.Types.ObjectId(apiKey.partnerId.toString()),
        amount,
        currency,
        environment: 'production',
        status: 'pending',
        qrCode: redeemCode,
      });
    }

    // 2. Log Conversion Event
    await AnalyticsEvent.create({
      type: 'conversion',
      dealId,
      partnerId: apiKey.partnerId,
      merchantId: deal.merchantId,
      environment: apiKey.environment,
      metadata: {
        ...metadata,
        transactionId: transaction._id,
        amount,
        redeemCode,
      },
    });

    // 3. Update Deal Usage
    if (isSandbox) {
      await SandboxDeal.findByIdAndUpdate(dealId, { $inc: { currentUsage: 1 } });
    } else {
      await Deal.findByIdAndUpdate(dealId, { $inc: { currentUsage: 1 } });
    }

    return NextResponse.json({ 
      message: 'Conversion tracked. Redemption code generated.',
      transactionId: transaction._id,
      redeemCode: transaction.qrCode,
      status: 'pending',
      environment: apiKey.environment
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
