import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';
import { checkAdminPermission } from '@/lib/auth-admin';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce VIEW_REVENUE permission
    const isAuthorized = await checkAdminPermission(userId, 'VIEW_REVENUE');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const skip = (page - 1) * limit;

    const [commissions, total] = await Promise.all([
      Commission.find({})
        .populate('partnerId', 'name email')
        .populate('merchantId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Commission.countDocuments({}),
    ]);

    // Aggregate totals for the ledger header
    const totals = await Commission.aggregate([
      {
        $group: {
          _id: null,
          grossVolume: { $sum: '$amount' },
          partnerPayouts: { $sum: '$partnerShare' },
          platformProfit: { $sum: '$platformShare' }
        }
      }
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      commissions,
      summary: totals[0] || { grossVolume: 0, partnerPayouts: 0, platformProfit: 0 }
    });

  } catch (error: any) {
    console.error('Admin Commissions API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
