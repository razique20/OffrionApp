import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import SandboxTransaction from '@/models/SandboxTransaction';
import '@/models/Deal';
import '@/models/SandboxDeal';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const environment = searchParams.get('environment') || 'production';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const skip = (page - 1) * limit;

    const query: any = { merchantId: new mongoose.Types.ObjectId(userId) };

    if (status) query.status = status;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const tModel = environment === 'sandbox' ? SandboxTransaction : Transaction;

    const [transactions, total] = await Promise.all([
      tModel.find(query)
        .populate('dealId', 'title discountedPrice originalPrice')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      tModel.countDocuments(query),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
