import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PartnerWebhook from '@/models/PartnerWebhook';
import crypto from 'crypto';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const webhooks = await PartnerWebhook.find({ partnerId: userId }).sort({ createdAt: -1 });
    return NextResponse.json(webhooks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { url, environment, events } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const webhook = await PartnerWebhook.create({
      partnerId: userId,
      url,
      environment: environment || 'production',
      enabledEvents: events || ['deal.redeemed', 'commission.earned'],
      secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
      isActive: true
    });

    return NextResponse.json(webhook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!userId || !id) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });

    const result = await PartnerWebhook.findOneAndDelete({ _id: id, partnerId: userId });
    
    if (!result) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
