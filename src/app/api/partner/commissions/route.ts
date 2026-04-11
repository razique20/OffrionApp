import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';
import SandboxCommission from '@/models/SandboxCommission';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // pending | paid
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const environment = searchParams.get('environment') || 'production';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const skip = (page - 1) * limit;

    const partnerId = new mongoose.Types.ObjectId(userId);

    // Build filter — sandbox collections are already environment-scoped, no environment field
    const query: any = { partnerId };
    if (environment === 'production') query.environment = 'production';
    if (status) query.status = status;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const commissionModel = environment === 'sandbox' ? SandboxCommission : Commission;
    const txRef = environment === 'sandbox' ? 'SandboxTransaction' : 'Transaction';

    // Summary totals
    const summaryMatch: any = { partnerId };
    if (environment === 'production') summaryMatch.environment = 'production';
    const summary = await commissionModel.aggregate([
      { $match: summaryMatch },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$partnerShare' },
          count: { $sum: 1 },
        },
      },
    ]);

    const ledger: Record<string, { total: number; count: number }> = {
      pending: { total: 0, count: 0 },
      paid: { total: 0, count: 0 },
    };
    for (const { _id, total, count } of summary) {
      ledger[_id as string] = { total: parseFloat(total.toFixed(2)), count };
    }

    // Paginated records
    const [commissions, total] = await Promise.all([
      commissionModel.find(query)
        .populate({
          path: 'transactionId',
          populate: { path: 'dealId', select: 'title' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      commissionModel.countDocuments(query),
    ]);

    return NextResponse.json({
      summary: {
        pending: ledger.pending,
        paid: ledger.paid,
        totalEarned: parseFloat((ledger.pending.total + ledger.paid.total).toFixed(2)),
      },
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      commissions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
