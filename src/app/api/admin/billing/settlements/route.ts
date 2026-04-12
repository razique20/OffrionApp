import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import Commission from '@/models/Commission';
import User from '@/models/User';
import mongoose from 'mongoose';

/**
 * GET: Fetch all merchants with pending balances or liabilities
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Fetch all profiles and populate user info
    const merchants = await MerchantProfile.find({})
      .populate({
        path: 'userId',
        select: 'name email',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    const data = await Promise.all(merchants.map(async (profile) => {
      const user = profile.userId as any;
      if (!user) return null; // Filter out orphaned profiles

      // Aggregate real-time pending commissions for this merchant
      // CRITICAL: Ensure we use new mongoose.Types.ObjectId() for the aggregate $match
      const pendingCommissions = await Commission.aggregate([
        { 
          $match: { 
            merchantId: new mongoose.Types.ObjectId(user._id.toString()), 
            status: 'pending' 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$amount' } 
          } 
        }
      ]);

      const realTimeLiability = pendingCommissions[0]?.total || 0;

      return {
        id: profile._id,
        merchantId: user._id,
        name: user.name,
        email: user.email,
        billingPreference: profile.billingPreference,
        balance: profile.balance,
        // Show liability for ANY pending commission found
        // This ensures visibility even if there's a status mismatch (e.g. prepaid record stuck in 'pending')
        accruedLiability: realTimeLiability,
        lastBillingDate: profile.lastBillingDate,
        status: profile.status,
      };
    }));

    const filteredData = data.filter(Boolean);

    return NextResponse.json({ merchants: filteredData });
  } catch (error: any) {
    console.error('[Billing API GET Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: Settle liability for a merchant (Opt 2 or manual clearing)
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { merchantId, amount } = await req.json();

    if (!merchantId) {
      return NextResponse.json({ error: 'Merchant ID is required' }, { status: 400 });
    }

    const profile = await MerchantProfile.findOne({ userId: merchantId });
    if (!profile) {
      return NextResponse.json({ error: 'Merchant profile not found' }, { status: 404 });
    }

    // Process settlement
    const result = await Commission.updateMany(
      { merchantId: new mongoose.Types.ObjectId(merchantId.toString()), status: 'pending' },
      { $set: { status: 'cleared' } }
    );

    profile.accruedLiability = 0; 
    profile.lastBillingDate = new Date();
    await profile.save();

    return NextResponse.json({ 
      message: 'Settlement processed successfully',
      settledAmount: amount || 'Full Pending Balance',
      commissionsUpdated: result.modifiedCount
    });
  } catch (error: any) {
    console.error('[Billing API POST Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
