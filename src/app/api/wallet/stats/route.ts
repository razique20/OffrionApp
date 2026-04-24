import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';
import Transaction from '@/models/Transaction';
import Payout from '@/models/Payout';
import MerchantProfile from '@/models/MerchantProfile';
import mongoose from 'mongoose';
import { MerchantBillingPreference } from '@/lib/constants';

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

      // Fetch actual withdrawals from Payout model
      const payoutStats = await Payout.aggregate([
        { $match: { userId: userObjectId, status: 'paid' } },
        { $group: { _id: null, totalWithdrawn: { $sum: '$amount' } } }
      ]);

      const result = {
        ...(stats[0] || {
          totalEarned: 0,
          pendingBalance: 0,
          withdrawableBalance: 0,
          totalPaid: 0,
        }),
        totalWithdrawn: payoutStats[0]?.totalWithdrawn || 0
      };

      // --- Time Series Aggregation (Last 7 Days) ---
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const timeSeries = await Commission.aggregate([
        { 
          $match: { 
            partnerId: userObjectId,
            createdAt: { $gte: sevenDaysAgo }
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            val: { $sum: '$partnerShare' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Fill in zeros for missing days
      const chartData: any[] = [];
      for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const match = timeSeries.find(t => t._id === dateStr);
          chartData.push({ name: dateStr, val: match ? match.val : 0 });
      }

      return NextResponse.json({ ...result, chartData });
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

      // --- Time Series Aggregation for Merchant ---
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const timeSeries = await Transaction.aggregate([
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
            status: 'completed',
            createdAt: { $gte: sevenDaysAgo }
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            val: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const chartData: any[] = [];
      for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const match = timeSeries.find(t => t._id === dateStr);
          chartData.push({ name: dateStr, val: match ? match.val : 0 });
      }

      const profile = await MerchantProfile.findOne({ userId: userObjectId });
      
      return NextResponse.json({
        totalSales: sales,
        netRevenue: sales - comm.totalCommission,
        totalCommission: comm.totalCommission,
        pendingCommission: comm.pendingCommission,
        paidCommission: comm.paidCommission,
        billingPreference: profile?.billingPreference || MerchantBillingPreference.PREPAID,
        balance: profile?.balance || 0,
        accruedLiability: profile?.accruedLiability || 0,
        creditLimit: profile?.creditLimit || 0,
        chartData
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
