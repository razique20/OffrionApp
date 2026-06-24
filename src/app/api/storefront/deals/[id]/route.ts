import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import mongoose from 'mongoose';

/**
 * First-party storefront deal detail (no API key). Returns a single live deal.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    await dbConnect();
    const deal = await Deal.findOne({
      _id: id,
      isActive: true,
      status: 'active',
      validUntil: { $gte: new Date() },
    })
      .populate('merchantId', 'name')
      .populate('categoryId', 'name')
      .lean();

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
