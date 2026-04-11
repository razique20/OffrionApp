import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // In this project, user ID might be passed in headers manually for now as seen in other routes
    // or handled via session. Let's stick to the pattern used in src/app/api/merchant/deals/route.ts
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { industry, taxId, registrationNumber, documents } = body;

    const profile = await MerchantProfile.findOneAndUpdate(
      { userId },
      {
        kycDetails: {
          industry,
          taxId,
          registrationNumber,
        },
        documents,
        status: 'pending', // Re-set to pending on update
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'KYC documents submitted successfully',
      profile,
    });
  } catch (error: any) {
    console.error('KYC Submission Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await MerchantProfile.findOne({ userId });
    return NextResponse.json(profile || { status: 'none' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
