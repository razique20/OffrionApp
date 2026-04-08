import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
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

    let stripeConnectId = user.stripeConnectId;

    // 1. Create a Stripe Express account if it doesn't exist
    if (!stripeConnectId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          transfers: { requested: true },
        },
        metadata: {
          userId: user._id.toString(),
        },
      });
      stripeConnectId = account.id;
      user.stripeConnectId = stripeConnectId;
      await user.save();
    }

    // 2. Create an Account Link for onboarding
    // In a real app, these URLs should be dynamic based on the environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const rolePrefix = user.role === 'merchant' ? '/merchant' : '/partner';
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeConnectId,
      refresh_url: `${baseUrl}${rolePrefix}/wallet?refresh=true`,
      return_url: `${baseUrl}${rolePrefix}/wallet?success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });

  } catch (error: any) {
    console.error('Stripe Onboarding Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
