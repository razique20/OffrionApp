import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import APIKey from '@/models/APIKey';
import Transaction from '@/models/Transaction';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import crypto from 'crypto';
import { z } from 'zod';

const apiKeySchema = z.object({
  name: z.string().min(2),
  isSandbox: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await APIKey.find({ partnerId: userId }).sort({ createdAt: -1 }).lean();
    
    // Fetch stats for each key
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const keysWithStats = await Promise.all(keys.map(async (k: any) => {
      const displayId = k._id;
      
      const [claimsCount, usageRate] = await Promise.all([
        Transaction.countDocuments({ apiKeyId: displayId, status: 'completed' }), // completed claims
        AnalyticsEvent.countDocuments({ 
          apiKeyId: displayId, 
          createdAt: { $gte: last24h } 
        }) // total requests/impressions in last 24h
      ]);

      return {
        _id: k._id,
        name: k.name,
        key: k.key,
        isActive: k.isActive,
        isSandbox: k.isSandbox || false,
        usageCount: k.usageCount || 0,
        claimsCount,
        usageRate, // requests per last 24h
        createdAt: k.createdAt
      };
    }));

    return NextResponse.json(keysWithStats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, isSandbox } = apiKeySchema.parse(body);

    const prefix = isSandbox ? 'offrion_sb_' : 'offrion_';
    const key = `${prefix}${crypto.randomBytes(24).toString('hex')}`;

    const apiKey = await APIKey.create({
      partnerId: userId,
      key,
      name,
      isSandbox: !!isSandbox,
      usageCount: 0
    });

    return NextResponse.json({ 
      message: 'API Key generated successfully', 
      apiKey: {
        _id: apiKey._id,
        id: apiKey._id,
        key: apiKey.key,
        name: apiKey.name,
        isActive: apiKey.isActive,
        isSandbox: apiKey.isSandbox,
        createdAt: apiKey.createdAt,
        claimsCount: 0,
        usageRate: 0
      }
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
