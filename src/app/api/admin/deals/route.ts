import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query: any = {};
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const deals = await Deal.find(query)
      .populate('merchantId', 'name email')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(deals);

  } catch (error: any) {
    console.error('Admin Deals API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
