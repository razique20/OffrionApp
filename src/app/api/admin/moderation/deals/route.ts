import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import { z } from 'zod';

const updateStatusSchema = z.object({
  dealId: z.string(),
  status: z.enum(['active', 'rejected', 'suspended']),
});

export async function GET(req: Request) {
  try {
    await dbConnect();
    const role = req.headers.get('x-user-role');

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 });
    }

    const pendingDeals = await Deal.find({ status: 'pending' }).populate('merchantId', 'name email').sort({ createdAt: -1 });
    return NextResponse.json(pendingDeals);
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
    const { dealId, status } = updateStatusSchema.parse(body);

    const deal = await Deal.findByIdAndUpdate(
      dealId,
      { 
        status,
        isActive: status === 'active' 
      },
      { new: true }
    );

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `Deal status updated to ${status}`, deal });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
