import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || !user.stripeConnectId) {
      return NextResponse.json({ 
        isConnected: false, 
        message: 'No bank account linked' 
      });
    }

    // Fetch account status from Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectId);

    return NextResponse.json({
      isConnected: true,
      status: account.details_submitted ? 'active' : 'pending_onboarding',
      detailsSubmitted: account.details_submitted,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
      requirements: account.requirements?.currently_due || [],
      bankInfo: account.external_accounts?.data[0] ? {
        bankName: (account.external_accounts.data[0] as any).bank_name,
        last4: (account.external_accounts.data[0] as any).last4,
      } : null,
    });

  } catch (error: any) {
    console.error('Stripe Account Retrieval Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
