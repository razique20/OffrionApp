import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import MerchantProfile from '@/models/MerchantProfile';
import User from '@/models/User';
import { z } from 'zod';
import mongoose from 'mongoose';

const dealSchema = z.object({
  categoryId: z.string(),
  title: z.string().min(3),
  description: z.string().min(10),
  images: z.array(z.string()).optional().default([]),
  originalPrice: z.number().positive(),
  discountedPrice: z.number().positive(),
  commissionPercentage: z.number().min(10, "Minimum commission is 10%").max(100).default(10),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }),
  validFrom: z.string().transform((str) => new Date(str)),
  validUntil: z.string().transform((str) => new Date(str)),
  usageLimit: z.number().int().nonnegative().default(0),
  emirate: z.string().optional(),
  landmark: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deals = await Deal.find({ merchantId: userId }).sort({ createdAt: -1 });
    return NextResponse.json(deals);
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

    // Check Merchant Verification Status & Country
    const [profile, merchant] = await Promise.all([
      MerchantProfile.findOne({ userId }),
      User.findById(userId).select('country'),
    ]);
    const isVerified = profile?.status === 'verified';
    const merchantCountry = merchant?.country || 'United Arab Emirates';

    const validatedData = dealSchema.parse(body);

    const deal = await Deal.create({
      ...validatedData,
      merchantId: new mongoose.Types.ObjectId(userId),
      categoryId: new mongoose.Types.ObjectId(validatedData.categoryId),
      country: merchantCountry,
      emirate: validatedData.emirate,
      landmark: validatedData.landmark,
      status: isVerified ? 'active' : 'pending',
      isActive: isVerified, // Only activate automatically if verified
    });

    return NextResponse.json({ 
      message: isVerified 
        ? 'Deal created successfully' 
        : 'Deal submitted for moderation. It will be live once your account is verified.', 
      deal 
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
