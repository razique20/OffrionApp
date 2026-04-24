import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import Deal from '@/models/Deal';
import { z } from 'zod';

const updateStatusSchema = z.object({
  merchantId: z.string(),
  status: z.enum(['verified', 'rejected', 'suspended']),
  creditLimit: z.number().optional().default(0),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const role = req.headers.get('x-user-role');
    
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    const pendingMerchants = await MerchantProfile.find({ status: 'pending' }).sort({ createdAt: -1 });
    return NextResponse.json(pendingMerchants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const role = req.headers.get('x-user-role');

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    const body = await req.json();
    const { merchantId, status, creditLimit } = updateStatusSchema.parse(body);

    const profile = await MerchantProfile.findByIdAndUpdate(
      merchantId,
      { status, creditLimit },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Auto-activate deals if verified
    if (status === 'verified') {
      await Deal.updateMany(
        { merchantId: profile.userId, status: 'pending' },
        { status: 'active', isActive: true }
      );
      console.log(`[Moderation] Auto-activated pending deals for merchant ${profile.businessName}`);
    }

    return NextResponse.json({ 
      message: `Merchant status updated to ${status}${status === 'verified' ? ' and deals activated.' : '.'}`, 
      profile 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
