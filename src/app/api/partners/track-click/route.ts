import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import SandboxDeal from '@/models/SandboxDeal';
import Transaction from '@/models/Transaction';
import SandboxTransaction from '@/models/SandboxTransaction';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { z } from 'zod';
import mongoose from 'mongoose';

const trackSchema = z.object({
  dealId: z.string(),
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

    const { dealId, metadata } = trackSchema.parse(body);
    const isSandbox = apiKey.environment === 'sandbox';

    // 1. Fetch Deal (from correct collection)
    const deal = isSandbox 
      ? await SandboxDeal.findById(dealId)
      : await Deal.findById(dealId);

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // 2. Log Click Event
    await AnalyticsEvent.create({
      type: 'click',
      dealId: new mongoose.Types.ObjectId(dealId),
      partnerId: apiKey.partnerId,
      merchantId: deal.merchantId,
      environment: apiKey.environment,
      metadata,
    });

    // 3. Generate a Transaction (from correct collection)
    const qrCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let transaction;
    if (isSandbox) {
      transaction = await SandboxTransaction.create({
        partnerId: apiKey.partnerId,
        merchantId: deal.merchantId,
        dealId: deal._id,
        amount: deal.discountedPrice,
        status: 'pending',
        qrCode,
      });
    } else {
      transaction = await Transaction.create({
        partnerId: apiKey.partnerId,
        merchantId: deal.merchantId,
        dealId: deal._id,
        amount: deal.discountedPrice,
        status: 'pending',
        qrCode,
        environment: 'production',
      });
    }

    return NextResponse.json({ 
      message: 'Click tracked successfully',
      redeemCode: qrCode,
      transactionId: transaction._id,
      environment: apiKey.environment
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
