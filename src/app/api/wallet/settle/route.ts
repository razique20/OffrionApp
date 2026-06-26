import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import Commission from '@/models/Commission';
import LedgerEntry from '@/models/LedgerEntry';
import mongoose from 'mongoose';

/**
 * POST: Merchant settles accrued liability, funded either from their wallet
 * balance (method: 'balance', default) or by charging their saved card on file
 * (method: 'card').
 *
 * Money flow (all recorded in the ledger for full auditability):
 *  - Funding source is debited/charged by the settled amount.
 *  - Partner commissions flip pending -> cleared (their share becomes withdrawable).
 *  - The platform share of each cleared commission is recorded as platform revenue.
 *  - A settlement ledger entry is written for the merchant (their receipt).
 *
 * Settles whole commissions oldest-first, up to the available budget (a partial
 * settlement if the budget can't cover the full liability). For card settlement
 * the card is charged FIRST; if the charge fails, nothing is cleared.
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (role !== 'merchant') {
      return NextResponse.json({ error: 'Only merchants can settle liability' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const method: 'balance' | 'card' = body?.method === 'card' ? 'card' : 'balance';

    const profile = await MerchantProfile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ error: 'Merchant profile not found' }, { status: 404 });
    }

    const liability = profile.accruedLiability || 0;
    const balance = profile.balance || 0;

    if (liability <= 0) {
      return NextResponse.json({ error: 'No accrued liability to settle' }, { status: 400 });
    }

    const merchantObjectId = new mongoose.Types.ObjectId(userId);

    // The budget that can be settled depends on the funding source.
    //  - balance: limited by wallet balance.
    //  - card:    the full liability (we charge the card for it).
    let settleBudget: number;
    if (method === 'card') {
      if (!profile.paymentMethodId || !profile.stripeCustomerId) {
        return NextResponse.json({ error: 'No saved card on file. Add a card first.' }, { status: 400 });
      }
      settleBudget = liability;
    } else {
      if (balance <= 0) {
        return NextResponse.json({ error: 'Insufficient wallet balance. Top up to settle.' }, { status: 400 });
      }
      settleBudget = Math.min(balance, liability);
    }

    // Clear pending commissions oldest-first, up to the available budget, so a
    // partial settlement clears whole commissions rather than fractions.
    const pending = await Commission.find({ merchantId: merchantObjectId, status: 'pending' }).sort({ createdAt: 1 });

    let settled = 0;
    let platformRevenue = 0;
    const clearedIds: mongoose.Types.ObjectId[] = [];

    for (const c of pending) {
      if (settled + c.amount > settleBudget) break;
      settled += c.amount;
      platformRevenue += c.platformShare || 0;
      clearedIds.push(c._id as mongoose.Types.ObjectId);
    }

    if (settled <= 0) {
      return NextResponse.json({ error: 'Settlement amount is below the smallest unbilled commission.' }, { status: 400 });
    }

    // For card settlement, charge the saved card FIRST. If it fails we abort
    // before clearing anything, so the liability is preserved and retryable.
    let chargeId: string | null = null;
    if (method === 'card') {
      try {
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(settled * 100),
          currency: 'usd',
          customer: profile.stripeCustomerId!,
          payment_method: profile.paymentMethodId!,
          off_session: true,
          confirm: true,
          description: `Offrion commission settlement (${clearedIds.length} commission${clearedIds.length === 1 ? '' : 's'})`,
          metadata: { userId, type: 'liability_settlement' },
        });
        if (intent.status !== 'succeeded') {
          return NextResponse.json({
            error: 'Card charge did not complete. Please try another method or update your card.',
            code: 'charge_not_succeeded',
          }, { status: 402 });
        }
        chargeId = intent.id;
      } catch (err: any) {
        console.error('[Settle Card Charge Error]:', err.message);
        return NextResponse.json({
          error: 'Your card was declined. Update your payment method or settle from wallet balance.',
          code: err.code || 'card_declined',
        }, { status: 402 });
      }
    }

    if (clearedIds.length > 0) {
      await Commission.updateMany({ _id: { $in: clearedIds } }, { $set: { status: 'cleared' } });
    }

    // Update merchant balances. Card settlement does not touch the wallet balance.
    if (method === 'balance') {
      profile.balance = balance - settled;
    }
    profile.accruedLiability = liability - settled;
    profile.lastBillingDate = new Date();
    await profile.save();

    // Record the money movement: merchant debit (settlement) + platform credit.
    const entries: any[] = [];
    if (settled > 0) {
      entries.push({
        ownerId: merchantObjectId,
        scope: 'merchant',
        type: 'settlement',
        amount: -settled,
        balanceAfter: profile.balance,
        description: `Liability settlement via ${method === 'card' ? 'card on file' : 'wallet balance'} (${clearedIds.length} commission${clearedIds.length === 1 ? '' : 's'})`,
        relatedMerchantId: merchantObjectId,
        metadata: { commissionsCleared: clearedIds.length, remainingLiability: liability - settled, method, chargeId },
      });
    }
    if (platformRevenue > 0) {
      entries.push({
        scope: 'platform',
        type: 'platform_share',
        amount: platformRevenue,
        description: 'Platform share from merchant liability settlement',
        relatedMerchantId: merchantObjectId,
        metadata: { commissionsCleared: clearedIds.length },
      });
    }
    if (entries.length > 0) {
      await LedgerEntry.insertMany(entries);
    }

    return NextResponse.json({
      message: profile.accruedLiability === 0
        ? 'Liability settled in full.'
        : method === 'card'
          ? 'Partial settlement applied.'
          : 'Partial settlement applied. Top up to settle the remaining liability.',
      method,
      settledAmount: settled,
      platformShare: platformRevenue,
      remainingLiability: profile.accruedLiability,
      remainingBalance: profile.balance,
      commissionsCleared: clearedIds.length,
    });
  } catch (error: any) {
    console.error('[Wallet Settle Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
