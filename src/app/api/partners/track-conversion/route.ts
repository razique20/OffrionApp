import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Transaction from '@/models/Transaction';
import Commission from '@/models/Commission';
import { checkIpRateLimit } from '@/lib/ipRateLimit';
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
    
    // 1. IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipLimit = checkIpRateLimit(ip, 60);
    if (!ipLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests from this IP' }, { status: 429 });
    }

    // 2. API Key & CORS Check
    const apiKeyHeader = req.headers.get('x-api-key');
    const origin = req.headers.get('origin') || undefined;

    if (!apiKeyHeader) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }

    let apiKey;
    try {
      const { validateApiKey } = await import('@/lib/apiKey');
      apiKey = await validateApiKey(apiKeyHeader, origin);
    } catch (err: any) {
      const status = err.message.includes('Rate limit') || err.message.includes('authorized') ? 403 : 401;
      return NextResponse.json({ error: err.message }, { status });
    }

    const { dealId, amount, currency, metadata } = conversionSchema.parse(body);


    const deal = await Deal.findById(dealId);

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
    const transaction = await Transaction.create({
      dealId: new mongoose.Types.ObjectId(dealId),
      merchantId: deal.merchantId,
      apiKeyId: apiKey._id,
      partnerId: new mongoose.Types.ObjectId(apiKey.partnerId.toString()),
      amount,
      currency,
      status: 'pending',
      qrCode: redeemCode,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h expiry
    });

    // 2. Log Conversion Event
    await AnalyticsEvent.create({
      type: 'conversion',
      dealId,
      partnerId: apiKey.partnerId,
      apiKeyId: apiKey._id,
      merchantId: deal.merchantId,
      metadata: {
        ...metadata,
        transactionId: transaction._id,
        amount,
        redeemCode,
      },
    });

    // 3. Update Deal Usage
    await Deal.findByIdAndUpdate(dealId, { $inc: { currentUsage: 1 } });

    const response = NextResponse.json({ 
      message: 'Conversion tracked. Redemption code generated.',
      transactionId: transaction._id,
      redeemCode: transaction.qrCode,
      status: 'pending'
    });

    const allowedOrigin = origin || '*';
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    response.headers.set('Vary', 'Origin');

    return response;

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}
