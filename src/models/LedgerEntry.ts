import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * A unified, immutable record of every money movement so balances are
 * always auditable and reportable. Each settlement, platform-share split,
 * top-up, or deduction writes one or more entries here.
 */
export interface ILedgerEntry extends Document {
  // The account this entry belongs to. For platform revenue, ownerId is null
  // and scope is 'platform'.
  ownerId?: mongoose.Types.ObjectId;
  scope: 'merchant' | 'partner' | 'platform';
  type: 'settlement' | 'platform_share' | 'topup' | 'payout' | 'commission' | 'adjustment';
  // Signed amount: negative = money left the account, positive = money in.
  amount: number;
  currency: string;
  balanceAfter?: number; // owner balance after this entry (when applicable)
  description: string;
  relatedMerchantId?: mongoose.Types.ObjectId;
  relatedPartnerId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerEntrySchema: Schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    scope: {
      type: String,
      enum: ['merchant', 'partner', 'platform'],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['settlement', 'platform_share', 'topup', 'payout', 'commission', 'adjustment'],
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    balanceAfter: { type: Number },
    description: { type: String, required: true },
    relatedMerchantId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    relatedPartnerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Idempotency guard for Stripe-driven entries (e.g. top-ups): at most one ledger
// entry per Stripe Checkout Session, so redelivered webhooks can't double-credit.
LedgerEntrySchema.index(
  { 'metadata.stripeSessionId': 1 },
  { unique: true, partialFilterExpression: { 'metadata.stripeSessionId': { $exists: true } } }
);

const LedgerEntry: Model<ILedgerEntry> =
  mongoose.models.LedgerEntry || mongoose.model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);

export default LedgerEntry;
