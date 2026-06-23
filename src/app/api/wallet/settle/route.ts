import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import Commission from '@/models/Commission';
import LedgerEntry from '@/models/LedgerEntry';
import mongoose from 'mongoose';

/**
 * POST: Merchant settles accrued liability by deducting from their wallet balance.
 *
 * Money flow (all recorded in the ledger for full auditability):
 *  - Merchant balance is debited by the settled amount.
 *  - Partner commissions flip pending -> cleared (their share becomes withdrawable).
 *  - The platform share of each cleared commission is recorded as platform revenue.
 *  - A settlement ledger entry is written for the merchant (their receipt).
 *
 * Settles in full when the balance covers the liability, otherwise applies a
 * partial settlement (clears oldest commissions first up to the available balance).
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

    const profile = await MerchantProfile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ error: 'Merchant profile not found' }, { status: 404 });
    }

    const liability = profile.accruedLiability || 0;
    const balance = profile.balance || 0;

    if (liability <= 0) {
      return NextResponse.json({ error: 'No accrued liability to settle' }, { status: 400 });
    }
    if (balance <= 0) {
      return NextResponse.json({ error: 'Insufficient wallet balance. Top up to settle.' }, { status: 400 });
    }

    const merchantObjectId = new mongoose.Types.ObjectId(userId);

    // Settle as much as the balance can cover (full or partial).
    const settleBudget = Math.min(balance, liability);

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

    if (clearedIds.length > 0) {
      await Commission.updateMany({ _id: { $in: clearedIds } }, { $set: { status: 'cleared' } });
    }

    // Update merchant balances
    profile.balance = balance - settled;
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
        description: `Liability settlement from wallet balance (${clearedIds.length} commission${clearedIds.length === 1 ? '' : 's'})`,
        relatedMerchantId: merchantObjectId,
        metadata: { commissionsCleared: clearedIds.length, remainingLiability: profile.accruedLiability },
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
        : 'Partial settlement applied. Top up to settle the remaining liability.',
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
