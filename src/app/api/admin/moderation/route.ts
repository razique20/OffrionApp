import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import MerchantProfile from '@/models/MerchantProfile';
import Commission from '@/models/Commission';
import User from '@/models/User';

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

    // 4. Fetch Pending Regional Access Requests from Partners
    const regionalRequests = await User.find({
      pendingAccessCountries: { $exists: true, $not: { $size: 0 } }
    }).select('name email pendingAccessCountries accessCountries role createdAt');

    // 5. Deals a merchant requested to list on the customer storefront but an
    //    admin hasn't approved yet.
    const storefrontRequests = await Deal.find({
      storefrontRequested: true,
      storefrontVisible: { $ne: true },
    })
      .populate('merchantId', 'name email')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      deals: pendingDeals,
      merchants: pendingMerchants,
      commissions: pendingCommissions,
      regionalRequests,
      storefrontRequests,
      totalCount: pendingDeals.length + pendingMerchants.length + pendingCommissions.length + regionalRequests.length + storefrontRequests.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
