import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { amount } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Minimum top-up is $10' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a Stripe Checkout Session for a one-time payment (Top-up)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Offrion Wallet Top-up',
              description: `Adding $${amount} to your merchant wallet balance.`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/merchant/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/merchant/wallet?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        type: 'wallet_topup',
        amount: amount.toString(),
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Top-up Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
