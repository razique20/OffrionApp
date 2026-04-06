import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscription, { SubscriptionPlan, SubscriptionStatus } from '@/models/Subscription';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let subscription = await Subscription.findOne({ userId });

    const isPartner = user.role === 'partner';
    const defaultPlan = isPartner ? SubscriptionPlan.PARTNER_FREE : SubscriptionPlan.MERCHANT_FREE;
    const defaultFeatures = isPartner 
        ? ['10,000 API Requests / mo', 'Standard Analytics', 'Email Support']
        : ['Basic Deal Creation', 'Standard Support'];

    if (!subscription) {
      // Initialize a default free subscription for the user to assure robustness
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);

      subscription = await Subscription.create({
        userId,
        plan: defaultPlan,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        cancelAtPeriodEnd: false,
        features: defaultFeatures,
      });
    } else {
       // Self-healing migration for existing data
       let needsSave = false;
       const currentPlanStr = subscription.plan as string;
       if (currentPlanStr === 'free' || currentPlanStr === 'pro' || currentPlanStr === 'enterprise') {
          subscription.plan = isPartner 
             ? `partner_${currentPlanStr}` as SubscriptionPlan 
             : `merchant_${currentPlanStr}` as SubscriptionPlan;
          needsSave = true;
       }
       
       // Fix features if they were assigned the wrong ones previously
       if (isPartner && subscription.features.includes('Basic Deal Creation')) {
          subscription.features = defaultFeatures;
          needsSave = true;
       }

       if (needsSave) {
          await subscription.save();
       }
    }

    // Friendly formatting for UI
    const uiPlan = subscription.plan.replace('merchant_', '').replace('partner_', '');
    const cleanSubscription = {
      ...subscription.toObject(),
      plan: uiPlan,
    };

    return NextResponse.json({ subscription: cleanSubscription });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
