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

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (role !== 'partner' && role !== 'merchant') {
        return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    const user = await User.findById(userId);
    if (!user || !user.stripeConnectId) {
      return NextResponse.json({ error: 'Please link your bank account via Stripe first' }, { status: 400 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Check withrawable balance
    // (Re-using the partner logic for now, but extending to merchant if they have withdrawable shares)
    const stats = await Commission.aggregate([
      { $match: { [role === 'partner' ? 'partnerId' : 'merchantId']: userObjectId, status: 'cleared' } },
      {
        $group: {
          _id: null,
          withdrawableBalance: { $sum: role === 'partner' ? '$partnerShare' : '$amount' },
        },
      },
    ]);

    const withdrawableBalance = stats[0]?.withdrawableBalance || 0;

    if (amount > withdrawableBalance) {
      return NextResponse.json({ error: 'Insufficient withdrawable balance' }, { status: 400 });
    }

    // 2. Perform Stripe Transfer
    // NOTE: In a real app, you need funds in your Stripe platform account to perform transfers.
    // For this prototype, we'll attempt it and catch the specific error if the platform is empty.
    let stripeTransferId = '';
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100), // Stripe expects cents
        currency: 'usd',
        destination: user.stripeConnectId,
        description: `Offrion Payout for ${user.email}`,
      });
      stripeTransferId = transfer.id;
    } catch (stripeErr: any) {
      console.error('Stripe Transfer Error:', stripeErr);
      // If it's a balance error, we might still want to "mock" succeed for the demo if requested,
      // but let's be realistic for now.
      return NextResponse.json({ error: `Stripe Payout Failed: ${stripeErr.message}` }, { status: 500 });
    }

    // 3. Create Payout record
    const payout = await Payout.create({
      userId: userObjectId,
      amount,
      method: 'stripe',
      status: 'paid',
      stripeTransferId,
      referenceId: stripeTransferId, // Use Stripe ID as reference
    });

    // 4. Mark matching commissions as 'paid'
    let remainingToPay = amount;
    const clearedCommissions = await Commission.find({ 
        [role === 'partner' ? 'partnerId' : 'merchantId']: userObjectId, 
        status: 'cleared' 
    }).sort({ createdAt: 1 });

    for (const comm of clearedCommissions) {
        if (remainingToPay <= 0) break;
        comm.status = 'paid'; 
        await comm.save();
        remainingToPay -= (role === 'partner' ? comm.partnerShare : comm.amount);
    }

    return NextResponse.json({
      message: 'Payout processed successfully via Stripe',
      payout,
    });

  } catch (error: any) {
    console.error('Internal Payout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
