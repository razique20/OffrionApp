import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Transaction from '@/models/Transaction';
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

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // 1. Create Transaction
    const transaction = await Transaction.create({
      dealId: new mongoose.Types.ObjectId(dealId),
      partnerId: apiKey.partnerId,
      amount,
      currency,
      status: 'completed',
    });

    // 2. Calculate Commission
    // Total commission is deal.commissionPercentage % of amount
    // Split: 70% to Partner, 30% to Platform (Example logic)
    const totalCommission = (amount * deal.commissionPercentage) / 100;
    const partnerShare = totalCommission * 0.7;
    const platformShare = totalCommission * 0.3;

    await Commission.create({
      transactionId: transaction._id,
      partnerId: apiKey.partnerId,
      merchantId: deal.merchantId,
      amount: totalCommission,
      partnerShare,
      platformShare,
      status: 'pending',
    });

    // 3. Log Conversion Event
    await AnalyticsEvent.create({
      type: 'conversion',
      dealId,
      partnerId: apiKey.partnerId,
      merchantId: deal.merchantId,
      metadata: {
        ...metadata,
        transactionId: transaction._id,
        amount,
        commission: totalCommission,
      },
    });

    // 4. Update Deal Usage
    await Deal.findByIdAndUpdate(dealId, { $inc: { currentUsage: 1 } });

    return NextResponse.json({ 
      message: 'Conversion tracked and commission calculated',
      transactionId: transaction._id,
      commission: {
        total: totalCommission,
        partner: partnerShare,
        platform: platformShare,
      }
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
