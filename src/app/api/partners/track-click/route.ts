import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import Transaction from '@/models/Transaction';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { checkIpRateLimit } from '@/lib/ipRateLimit';
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
    
    // 1. IP Rate Limiting (Spam Protection)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipLimit = checkIpRateLimit(ip, 60); // 60 requests per minute per IP
    if (!ipLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests from this IP' }, { status: 429 });
    }

    // 2. API Key Validation & CORS Origin Check
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
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h expiry
    });

    const response = NextResponse.json({ 
      message: 'Click tracked successfully',
      redeemCode: qrCode,
      transactionId: transaction._id,
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
