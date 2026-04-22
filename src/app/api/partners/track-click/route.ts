import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import Transaction from '@/models/Transaction';
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

    // 1. Fetch Deal
    const deal = await Deal.findById(dealId);

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // 2. Log Click Event
    await AnalyticsEvent.create({
      type: 'click',
      dealId: new mongoose.Types.ObjectId(dealId),
      partnerId: apiKey.partnerId,
      apiKeyId: apiKey._id,
      merchantId: deal.merchantId,
      metadata,
    });

    // 3. Generate a Transaction
    const qrCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const transaction = await Transaction.create({
      partnerId: apiKey.partnerId,
      apiKeyId: apiKey._id,
      merchantId: deal.merchantId,
      dealId: deal._id,
      amount: deal.discountedPrice,
      status: 'pending',
      qrCode,
    });

    return NextResponse.json({ 
      message: 'Click tracked successfully',
      redeemCode: qrCode,
      transactionId: transaction._id,
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
