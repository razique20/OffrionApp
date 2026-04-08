import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';
import Transaction from '@/models/Transaction';
import Payout from '@/models/Payout';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role'); // Assuming role is passed or can be fetched

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (role === 'partner') {
      const stats = await Commission.aggregate([
        { $match: { partnerId: userObjectId } },
        {
          $group: {
            _id: null,
            totalEarned: { $sum: '$partnerShare' },
            pendingBalance: { 
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$partnerShare', 0] } 
            },
            withdrawableBalance: { 
              $sum: { $cond: [{ $eq: ['$status', 'cleared'] }, '$partnerShare', 0] } 
            },
            totalPaid: { 
              $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$partnerShare', 0] } 
            },
          },
        },
      ]);

      const result = stats[0] || {
        totalEarned: 0,
        pendingBalance: 0,
        withdrawableBalance: 0,
        totalPaid: 0,
      };

      return NextResponse.json(result);
    } 
    
    if (role === 'merchant') {
      // For merchants, they've already collected the money. 
      // This wallet shows "Offrion-generated context"
      
      const salesAggregation = await Transaction.aggregate([
        {
          $lookup: {
            from: 'deals',
            localField: 'dealId',
            foreignField: '_id',
            as: 'deal'
          }
        },
        { $unwind: '$deal' },
        { 
          $match: { 
            'deal.merchantId': userObjectId,
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$amount' },
          }
        }
      ]);

      const commissionAggregation = await Commission.aggregate([
        { $match: { merchantId: userObjectId } },
        {
          $group: {
            _id: null,
            totalCommission: { $sum: '$amount' },
            pendingCommission: { 
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } 
            },
            paidCommission: { 
              $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } 
            },
          }
        }
      ]);

      const sales = salesAggregation[0]?.totalSales || 0;
      const comm = commissionAggregation[0] || { totalCommission: 0, pendingCommission: 0, paidCommission: 0 };

      return NextResponse.json({
        totalSales: sales,
        netRevenue: sales - comm.totalCommission,
        totalCommission: comm.totalCommission,
        pendingCommission: comm.pendingCommission,
        paidCommission: comm.paidCommission,
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
