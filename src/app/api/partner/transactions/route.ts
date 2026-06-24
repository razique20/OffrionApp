import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Commission from '@/models/Commission';
import '@/models/Deal';
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
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const skip = (page - 1) * limit;

    const query: any = { partnerId: new mongoose.Types.ObjectId(userId) };
    // Production doesn't have an environment field typically, or if it does, it's fine.
    // The main difference is the model collection.
    
    if (status) query.status = status;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    
    const tModel = Transaction;

    const [transactions, total] = await Promise.all([
      tModel.find(query)
        .populate('dealId', 'title discountedPrice originalPrice commissionPercentage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      tModel.countDocuments(query),
    ]);

    // Attach the actual stored partner commission (partnerShare) from the
    // Commission record, so the UI shows real earnings rather than recomputing
    // with a guessed rate. Pending (un-redeemed) claims have no commission yet.
    const txIds = transactions.map((t: any) => t._id);
    const commissions = await Commission.find({ transactionId: { $in: txIds } })
      .select('transactionId partnerShare amount')
      .lean();
    const commissionByTx = new Map(
      commissions.map((c: any) => [c.transactionId.toString(), c])
    );

    const enriched = transactions.map((t: any) => {
      const c = commissionByTx.get(t._id.toString());
      return { ...t, partnerCommission: c ? c.partnerShare : null };
    });

    return NextResponse.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      transactions: enriched,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
