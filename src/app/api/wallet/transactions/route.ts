import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';
import Payout from '@/models/Payout';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (role === 'partner') {
      const [commissions, payouts] = await Promise.all([
        Commission.find({ partnerId: userObjectId })
          .populate('transactionId', 'status redeemedAt qrCode')
          .sort({ createdAt: -1 })
          .limit(limit),
        Payout.find({ userId: userObjectId })
          .sort({ createdAt: -1 })
          .limit(limit),
      ]);

      // Merge and sort
      const ledger = [
        ...commissions.map((c: any) => ({
          id: c._id,
          type: 'commission',
          amount: c.partnerShare,
          status: c.status,
          date: c.createdAt,
          description: `Referral Commission (Deal: ${c.transactionId?.qrCode || 'N/A'})`,
          transactionId: c.transactionId?._id,
        })),
        ...payouts.map((p: any) => ({
          id: p._id,
          type: 'payout',
          amount: -p.amount,
          status: p.status,
          date: p.createdAt,
          description: `Withdrawal (${p.method.replace('_', ' ')})`,
          referenceId: p.referenceId,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
       .slice(0, limit);

      return NextResponse.json({ ledger });
    }

    if (role === 'merchant') {
        const commissions = await Commission.find({ merchantId: userObjectId })
          .populate('partnerId', 'name email')
          .sort({ createdAt: -1 })
          .limit(limit);

        const ledger = commissions.map((c: any) => ({
            id: c._id,
            type: 'commission_paid',
            amount: -c.amount,
            status: c.status,
            date: c.createdAt,
            description: `Partner Commission (${c.partnerId?.name || 'Partner'})`,
            partnerId: c.partnerId?._id,
        }));

        return NextResponse.json({ ledger });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
