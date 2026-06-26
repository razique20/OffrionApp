import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import MerchantProfile from '@/models/MerchantProfile';

/**
 * GET: returns the merchant's saved card-on-file status for the wallet UI.
 */
export async function GET(req: Request) {
  await dbConnect();
  const userId = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (role !== 'merchant') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const profile = await MerchantProfile.findOne({ userId });
  const hasCard = !!(profile?.paymentMethodId);
  return NextResponse.json({
    hasCard,
    card: hasCard ? { brand: profile!.cardBrand, last4: profile!.cardLast4 } : null,
  });
}

/**
 * POST: start saving a card. Creates a Stripe Customer for the merchant (if
 * needed) and a hosted Checkout Session in 'setup' mode. No raw card data ever
 * touches our servers; the card is attached on checkout.session.completed.
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (role !== 'merchant') {
      return NextResponse.json({ error: 'Only merchants can save a billing card' }, { status: 403 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const profile = await MerchantProfile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ error: 'Merchant profile not found. Complete onboarding first.' }, { status: 404 });
    }

    // Reuse the merchant's Stripe Customer or create one.
    let customerId = profile.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.businessName,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      profile.stripeCustomerId = customerId;
      await profile.save();
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      payment_method_types: ['card'],
      customer: customerId,
      success_url: `${baseUrl}/merchant/wallet?card_saved=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/merchant/wallet?card_canceled=true`,
      metadata: {
        userId: user._id.toString(),
        type: 'merchant_card_setup',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Save Card Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
