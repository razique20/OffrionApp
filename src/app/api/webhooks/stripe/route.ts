import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  await dbConnect();

  if (event.type === 'checkout.session.completed') {
    const session: any = event.data.object;
    const { userId, plan } = session.metadata;

    if (!userId || !plan) {
      console.error('Missing userId or plan in session metadata');
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    let currentPeriodStart = new Date();
    let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 day fallback

    // If it's a subscription, fetch the actual dates from Stripe
    if (session.subscription) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;
        currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
        currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
      } catch (err) {
        console.error('Error fetching Stripe subscription:', err);
      }
    }

    const { PLAN_FEATURES } = await import('@/lib/stripe');
    const features = PLAN_FEATURES[plan] || [];

    // Update or create subscription record
    await Subscription.findOneAndUpdate(
      { userId },
      {
        plan: plan,
        status: 'active',
        currentPeriodStart,
        currentPeriodEnd,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        paymentMethodLast4: 'Stored', // We'll update this properly if needed
        features,
      },
      { upsert: true, new: true }
    );
    
    console.log(`Successfully upgraded user ${userId} to ${plan}`);
  }

  return NextResponse.json({ received: true });
}
