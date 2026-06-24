import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payout from '@/models/Payout';
import Commission from '@/models/Commission';
import User from '@/models/User';
import { stripe } from '@/lib/stripe';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    // Server-only flag (not NEXT_PUBLIC_*, which is inlined at build time and
    // would let payouts skip the Stripe bank-link check). Defaults to off.
    const isDemoMode = process.env.DEMO_MODE === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only partners earn a withdrawable balance (their commission share).
    // Merchants pay commission, they don't accrue earnings, so they cannot
    // withdraw from this endpoint.
    if (role !== 'partner') {
        return NextResponse.json({ error: 'Only partners can request payouts' }, { status: 403 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check bank account requirement
    if (!user.stripeConnectId && !isDemoMode) {
      return NextResponse.json({ error: 'Please link your bank account via Stripe first' }, { status: 400 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Check withdrawable balance (sum of the partner's share on cleared commissions)
    const stats = await Commission.aggregate([
      { $match: { partnerId: userObjectId, status: 'cleared' } },
      {
        $group: {
          _id: null,
          withdrawableBalance: { $sum: '$partnerShare' },
        },
      },
    ]);

    const withdrawableBalance = stats[0]?.withdrawableBalance || 0;

    if (amount > withdrawableBalance) {
      return NextResponse.json({ error: 'Insufficient withdrawable balance' }, { status: 400 });
    }

    // 2. Perform Stripe Transfer
    let stripeTransferId = '';

    if (isDemoMode && !user.stripeConnectId) {
        console.warn('⚠️ DEMO MODE: Bypassing Stripe verification for mock payout.');
        stripeTransferId = `mock_tr_${Math.random().toString(36).slice(2, 9)}`;
    } else {
      try {
        const transfer = await stripe.transfers.create({
          amount: Math.round(amount * 100), // Stripe expects cents
          currency: 'usd',
          destination: user.stripeConnectId!,
          description: `Offrion Payout for ${user.email}`,
        });
        stripeTransferId = transfer.id;
      } catch (stripeErr: any) {
        console.error('Stripe Transfer Error:', stripeErr);

        // Only mock a payout when DEMO_MODE is explicitly enabled. Never fake a
        // successful transfer in production (e.g. on balance_insufficient) — that
        // would mark commissions paid without any money actually moving.
        if (isDemoMode) {
            console.warn('⚠️ DEMO MODE: Mocking successful payout despite Stripe error.');
            stripeTransferId = `mock_tr_${Math.random().toString(36).slice(2, 9)}`;
        } else {
            return NextResponse.json({
                error: `Stripe Payout Failed: ${stripeErr.message}`,
                code: stripeErr.code
            }, { status: 500 });
        }
      }
    }

    // 3. Create Payout record
    const payout = await Payout.create({
      userId: userObjectId,
      amount,
      method: 'stripe',
      status: 'paid',
      stripeTransferId,
      referenceId: stripeTransferId,
    });

    // 4. Mark matching commissions as 'paid' (partner share covers the payout)
    let remainingToPay = amount;
    const clearedCommissions = await Commission.find({
        partnerId: userObjectId,
        status: 'cleared'
    }).sort({ createdAt: 1 });

    for (const comm of clearedCommissions) {
        if (remainingToPay <= 0) break;
        comm.status = 'paid';
        await comm.save();
        remainingToPay -= comm.partnerShare;
    }

    return NextResponse.json({
      message: 'Payout processed successfully',
      payout,
    });

  } catch (error: any) {
    console.error('Internal Payout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
