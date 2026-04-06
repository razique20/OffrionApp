import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from '../src/models/User';
import Subscription, { SubscriptionPlan, SubscriptionStatus } from '../src/models/Subscription';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function seedSubscriptions() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users. Checking subscriptions...`);

    let newCount = 0;
    let upCount = 0;

    for (const user of users) {
      let sub = await Subscription.findOne({ userId: user._id });
      
      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);

      const isPartner = user.role === 'partner';

      // Determine what to seed based on role
      const plans = isPartner 
        ? [SubscriptionPlan.PARTNER_FREE, SubscriptionPlan.PARTNER_PRO, SubscriptionPlan.PARTNER_ENTERPRISE]
        : [SubscriptionPlan.MERCHANT_FREE, SubscriptionPlan.MERCHANT_PRO, SubscriptionPlan.MERCHANT_ENTERPRISE];
        
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      
      let features: string[] = [];
      if (isPartner) {
        features = randomPlan === SubscriptionPlan.PARTNER_ENTERPRISE 
          ? ['Unlimited API Requests', 'Custom Integrations', 'Dedicated Account Manager'] 
          : randomPlan === SubscriptionPlan.PARTNER_PRO 
          ? ['1,000,000 API Requests / mo', 'Premium Analytics', 'Priority Support']
          : ['10,000 API Requests / mo', 'Standard Analytics', 'Email Support'];
      } else {
        features = randomPlan === SubscriptionPlan.MERCHANT_ENTERPRISE 
          ? ['Everything in Pro', 'Custom Integrations', 'Dedicated Account Manager'] 
          : randomPlan === SubscriptionPlan.MERCHANT_PRO 
          ? ['Unlimited Deals Creation', 'Premium Placement', 'Analytics Dashboard', 'Priority Support']
          : ['Basic Deal Creation', 'Standard Support'];
      }

      const isPaid = randomPlan !== SubscriptionPlan.MERCHANT_FREE && randomPlan !== SubscriptionPlan.PARTNER_FREE;

      if (!sub) {
        await Subscription.create({
          userId: user._id,
          plan: randomPlan,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: now,
          currentPeriodEnd: nextMonth,
          cancelAtPeriodEnd: false,
          paymentMethodLast4: isPaid ? Math.floor(1000 + Math.random() * 9000).toString() : undefined,
          paymentMethodBrand: isPaid ? 'Visa' : undefined,
          features,
        });
        newCount++;
      } else {
        // Update existing subscription to seed full details
        sub.plan = randomPlan;
        sub.features = features;
        sub.paymentMethodLast4 = isPaid ? Math.floor(1000 + Math.random() * 9000).toString() : undefined;
        sub.paymentMethodBrand = isPaid ? 'Mastercard' : undefined;
        await sub.save();
        upCount++;
      }
    }

    console.log(`Successfully seeded subscriptions. Created: ${newCount}, Updated: ${upCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subscriptions:', error);
    process.exit(1);
  }
}

seedSubscriptions();
