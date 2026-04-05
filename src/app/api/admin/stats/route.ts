import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Deal from '@/models/Deal';
import Commission from '@/models/Commission';
import { UserRole } from '@/lib/constants';

import { checkAdminPermission } from '@/lib/auth-admin';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce VIEW_REVENUE permission
    const isAuthorized = await checkAdminPermission(userId, 'VIEW_REVENUE');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to view revenue stats' }, { status: 403 });
    }

    // 1. Merchant Count
    const merchantCount = await User.countDocuments({ role: UserRole.MERCHANT });

    // 2. Partner Count
    const partnerCount = await User.countDocuments({ role: UserRole.PARTNER });

    // 3. Active Deals Count
    const dealCount = await Deal.countDocuments({ isActive: true });

    // 4. Platform Revenue (Sum of all platformShare)
    const revenueStats = await Commission.aggregate([
      { $group: { _id: null, total: { $sum: '$platformShare' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    return NextResponse.json({
      merchants: merchantCount,
      partners: partnerCount,
      deals: dealCount,
      revenue: totalRevenue
    });

  } catch (error: any) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
