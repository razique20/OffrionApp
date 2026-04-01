import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import { z } from 'zod';

const profileSchema = z.object({
  businessName: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  address: z.string(),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await MerchantProfile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
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

    const validatedData = profileSchema.parse(body);

    const profile = await MerchantProfile.findOneAndUpdate(
      { userId },
      { ...validatedData, userId },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'Profile updated successfully', profile });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
