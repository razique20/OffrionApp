import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Transaction from '@/models/Transaction';
import Commission from '@/models/Commission';
import Deal from '@/models/Deal';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchantId = new mongoose.Types.ObjectId(userId);

    // 1. Aggregate Analytics Events (Impressions, Clicks, Conversions)
    const eventsAggregation = await AnalyticsEvent.aggregate([
      { $match: { merchantId } },
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
    const commissionAggregation = await Commission.aggregate([
      { $match: { merchantId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }, // This is total commission amount actually
          // But merchant revenue is transaction amount - commission?
          // Let's get transaction amount sum
        },
      },
    ]);

    const transactionAggregation = await Transaction.aggregate([
        // We need to join with Deals to filter by merchantId
        {
            $lookup: {
                from: 'deals',
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
      { $match: { merchantId, type: 'conversion' } },
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
          from: 'deals',
          localField: '_id',
          foreignField: '_id',
          as: 'dealInfo',
        },
      },
      { $unwind: '$dealInfo' },
    ]);

    return NextResponse.json({
      stats,
      topDeals,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
