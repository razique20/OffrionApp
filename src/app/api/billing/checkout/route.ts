import { NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import { SubscriptionPlan } from '@/models/Subscription';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || !STRIPE_PRICES[plan]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Determine return URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/${userRole}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`;
    const cancelUrl = `${baseUrl}/${userRole}/settings?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // PayPal is often enabled automatically via Stripe dashboard settings
      line_items: [
        {
          price: STRIPE_PRICES[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
         userId: userId,
         plan: plan
      },
      customer_email: req.headers.get('x-user-email') || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
