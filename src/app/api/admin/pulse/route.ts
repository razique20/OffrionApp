import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Deal from '@/models/Deal';
import { UserRole } from '@/lib/constants';
import { checkAdminPermission } from '@/lib/auth-admin';

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    const isAuthorized = await checkAdminPermission(userId, 'VIEW_REVENUE');
    
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    await dbConnect();

    // Fetch the 15 most recent completed redemptions
    const transactions = await Transaction.find({ 
      status: 'completed',
      redeemedAt: { $exists: true }
    })
    .sort({ redeemedAt: -1 })
    .limit(15)
    .populate({
      path: 'dealId',
      select: 'title location discountedPrice merchantId',
      populate: { path: 'merchantId', select: 'name' }
    });

    const pulseData = transactions.map(t => {
      const deal = t.dealId as any;
      return {
        id: t._id,
        title: deal?.title || 'Unknown Deal',
        merchantName: deal?.merchantId?.name || 'Local Merchant',
        amount: deal?.discountedPrice || 0,
        location: deal?.location?.coordinates || [0, 0],
        timestamp: t.redeemedAt
      };
    });

    return NextResponse.json(pulseData);

  } catch (error: any) {
    console.error('Pulse API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
