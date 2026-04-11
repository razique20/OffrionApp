import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Transaction from '@/models/Transaction';
import Commission from '@/models/Commission';
import Deal from '@/models/Deal';
import MerchantProfile from '@/models/MerchantProfile';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchantId = new mongoose.Types.ObjectId(userId);
    const { searchParams } = new URL(req.url);
    const environment = searchParams.get('environment') || 'production';
    const isSandbox = environment === 'sandbox';

    // Import sandbox models dynamically if needed, or use them if already imported
    // For now, let's assume they are imported. I'll add imports at the top.
    const TransactionModel = isSandbox ? (await import('@/models/SandboxTransaction')).default : Transaction;
    const CommissionModel = isSandbox ? (await import('@/models/SandboxCommission')).default : Commission;
    const DealModel = isSandbox ? (await import('@/models/SandboxDeal')).default : Deal;

    // 1. Aggregate Analytics Events (Impressions, Clicks, Conversions)
    // Note: AnalyticsEvent could be env-agnostic or we could add an env field. 
    // For now, we'll keep it as is, but filter by merchantId.
    const eventsAggregation = await AnalyticsEvent.aggregate([
      { $match: { merchantId, environment } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats: any = {
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };

    eventsAggregation.forEach((item) => {
      if (item._id === 'impression') stats.impressions = item.count;
      if (item._id === 'click') stats.clicks = item.count;
      if (item._id === 'conversion') stats.conversions = item.count;
    });

    // 2. Aggregate Revenue and Commission
    const commissionAggregation = await CommissionModel.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const transactionAggregation = await TransactionModel.aggregate([
        {
            $lookup: {
                from: isSandbox ? 'sandboxdeals' : 'deals',
                localField: 'dealId',
                foreignField: '_id',
                as: 'deal'
            }
        },
        { $unwind: '$deal' },
        { $match: { 'deal.merchantId': merchantId } },
        {
            $group: {
                _id: null,
                totalSales: { $sum: '$amount' },
            }
        }
    ]);

    stats.totalSales = transactionAggregation[0]?.totalSales || 0;
    stats.totalCommission = commissionAggregation[0]?.totalRevenue || 0;
    stats.netRevenue = stats.totalSales - stats.totalCommission;

    // 3. Top Deals
    const topDeals = await AnalyticsEvent.aggregate([
      { $match: { merchantId, type: 'conversion', environment } },
      {
        $group: {
          _id: '$dealId',
          conversions: { $sum: 1 },
        },
      },
      { $sort: { conversions: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: isSandbox ? 'sandboxdeals' : 'deals',
          localField: '_id',
          foreignField: '_id',
          as: 'dealInfo',
        },
      },
      { $unwind: '$dealInfo' },
    ]);

    // 4. Daily Revenue for Chart (Last 7 Days)
    const dailyRevenue: any[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyRevenue.push({ name: dateStr, revenue: 0 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenueAggregation = await TransactionModel.aggregate([
      {
        $lookup: {
          from: isSandbox ? 'sandboxdeals' : 'deals',
          localField: 'dealId',
          foreignField: '_id',
          as: 'deal'
        }
      },
      { $unwind: '$deal' },
      { 
        $match: { 
          'deal.merchantId': merchantId,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Merge aggregation into dailyRevenue
    dailyRevenueAggregation.forEach(item => {
        const index = dailyRevenue.findIndex(d => d.name === item._id);
        if (index !== -1) {
            dailyRevenue[index].revenue = item.revenue;
        }
    });

    // 5. Merchant Verification Status
    const profile = await MerchantProfile.findOne({ userId });
    const verificationStatus = profile?.status || 'pending';

    return NextResponse.json({
      stats,
      topDeals,
      dailyRevenue,
      verificationStatus,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
