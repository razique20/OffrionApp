import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const apiKeyHeader = req.headers.get('x-api-key');

    if (!apiKeyHeader) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }

    const apiKey = await APIKey.findOne({ key: apiKeyHeader, isActive: true });
    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
    }

    const deal = await Deal.findById(id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Log Click Event
    await AnalyticsEvent.create({
      type: 'click',
      dealId: deal._id,
      partnerId: apiKey.partnerId,
      merchantId: deal.merchantId,
    });

    return NextResponse.json({ message: 'Click logged successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
