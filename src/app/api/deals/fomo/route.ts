import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (72 * 60 * 60 * 1000));

    // Find deals that are:
    // 1. Expiring within 72 hours
    // 2. OR have usageLimit > 0 and usage left < 20
    // 3. OR are explicitly 'flash' deals
    const highUrgencyDeals = await Deal.find({
      isActive: true,
      status: 'active',
      $or: [
        { validUntil: { $gt: now, $lt: threeDaysFromNow } },
        { 
          $and: [
            { usageLimit: { $gt: 0 } },
            { $expr: { $lt: [{ $subtract: ["$usageLimit", "$currentUsage"] }, 15] } }
          ]
        },
        { eventType: 'flash' }
      ]
    })
    .sort({ validUntil: 1 })
    .limit(10)
    .populate('merchantId', 'name');

    const fomoData = highUrgencyDeals.map(deal => {
      const remainingUsage = deal.usageLimit > 0 ? deal.usageLimit - deal.currentUsage : null;
      const hoursLeft = Math.ceil((new Date(deal.validUntil).getTime() - now.getTime()) / (1000 * 60 * 60));
      
      let urgencyReason = '';
      let urgencyLevel = 5;

      if (hoursLeft > 0 && hoursLeft < 24) {
        urgencyReason = `Ends in ${hoursLeft} hours!`;
        urgencyLevel = 9;
      } else if (remainingUsage !== null && remainingUsage < 5) {
        urgencyReason = `Only ${remainingUsage} left!`;
        urgencyLevel = 10;
      } else if (deal.eventType === 'flash') {
        urgencyReason = 'Limited Time Flash Sale';
        urgencyLevel = 8;
      } else {
        urgencyReason = 'Expiring Soon';
        urgencyLevel = 7;
      }

      return {
        id: deal._id,
        title: deal.title,
        merchantName: (deal.merchantId as any)?.name || 'Local Merchant',
        urgencyReason,
        urgencyLevel,
        hoursLeft,
        remainingUsage,
        images: deal.images
      };
    });

    return NextResponse.json(fomoData);

  } catch (error: any) {
    console.error('FOMO API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
