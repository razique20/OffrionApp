import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import MerchantProfile from '@/models/MerchantProfile';
import Commission from '@/models/Commission';

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1. Fetch Pending Deals with Merchant Details
    const pendingDeals = await Deal.find({ status: 'pending' })
      .populate('merchantId', 'name email')
      .sort({ createdAt: -1 });

    // 2. Fetch Pending Merchants with User Details
    const pendingMerchants = await MerchantProfile.find({ status: 'pending' })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    // 3. Fetch Pending Commissions
    const pendingCommissions = await Commission.find({ status: 'pending' })
      .populate('partnerId', 'name email')
      .populate('merchantId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      deals: pendingDeals,
      merchants: pendingMerchants,
      commissions: pendingCommissions,
      totalCount: pendingDeals.length + pendingMerchants.length + pendingCommissions.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
