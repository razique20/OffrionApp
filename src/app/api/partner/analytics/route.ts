import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Commission from '@/models/Commission';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30d';
    const environment = searchParams.get('environment') || 'production';

    const periodMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    const days = periodMap[period] || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const mongoose = (await import('mongoose')).default;
    const partnerId = new mongoose.Types.ObjectId(userId);

    // Aggregate event counts by type
    const eventCounts = await AnalyticsEvent.aggregate([
      { $match: { partnerId, environment, createdAt: { $gte: since } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const stats: Record<string, number> = { impression: 0, click: 0, conversion: 0 };
    for (const { _id, count } of eventCounts) {
      stats[_id as string] = count;
    }

    const ctr = stats.impression > 0 ? ((stats.click / stats.impression) * 100).toFixed(2) : '0.00';
    const conversionRate = stats.click > 0 ? ((stats.conversion / stats.click) * 100).toFixed(2) : '0.00';

    // Aggregate commissions
    const commissionStats = await Commission.aggregate([
      { $match: { partnerId, environment, createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$partnerShare' },
          count: { $sum: 1 },
        },
      },
    ]);

    const earnings: Record<string, number> = { pending: 0, paid: 0 };
    for (const { _id, total } of commissionStats) {
      earnings[_id as string] = parseFloat(total.toFixed(2));
    }

    // Time-series data (daily breakdown)
    const timeSeries = await AnalyticsEvent.aggregate([
      { $match: { partnerId, environment, createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    return NextResponse.json({
      period,
      environment,
      summary: {
        impressions: stats.impression,
        clicks: stats.click,
        conversions: stats.conversion,
        ctr: `${ctr}%`,
        conversionRate: `${conversionRate}%`,
        earnings,
        totalEarned: parseFloat((earnings.pending + earnings.paid).toFixed(2)),
      },
      timeSeries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
