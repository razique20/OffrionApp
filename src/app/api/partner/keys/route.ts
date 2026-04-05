import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import APIKey from '@/models/APIKey';
import crypto from 'crypto';
import { z } from 'zod';

const apiKeySchema = z.object({
  name: z.string().min(2),
  environment: z.enum(['production', 'sandbox']).default('sandbox'),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await APIKey.find({ partnerId: userId }).sort({ createdAt: -1 }).lean();
    
    // Explicitly map keys to ensure all fields like environment are returned correctly
    const formattedKeys = keys.map((k: any) => ({
      _id: k._id,
      name: k.name,
      key: k.key,
      environment: k.environment || 'production',
      isActive: k.isActive,
      rateLimit: k.rateLimit,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt
    }));

    return NextResponse.json(formattedKeys);
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

    const { name, environment } = apiKeySchema.parse(body);
    const key = `offrion_${crypto.randomBytes(24).toString('hex')}`;

    const apiKey = await APIKey.create({
      partnerId: userId,
      key,
      name,
      environment,
    });

    return NextResponse.json({ 
      message: 'API Key generated successfully', 
      apiKey: {
        _id: apiKey._id, // Keep _id for consistency with GET
        id: apiKey._id,
        key: apiKey.key,
        name: name,
        environment: environment,
        isActive: apiKey.isActive,
        createdAt: apiKey.createdAt,
      }
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
