import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayout extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'rejected';
  method: 'bank_transfer' | 'stripe';
  methodDetails?: {
    last4?: string;
    bankName?: string;
  };
  referenceId?: string;
  stripeTransferId?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'rejected'],
      default: 'pending',
      index: true,
    },
    method: {
      type: String,
      enum: ['bank_transfer', 'stripe'],
      default: 'bank_transfer',
    },
    methodDetails: {
      last4: String,
      bankName: String,
    },
    referenceId: { type: String },
    stripeTransferId: { type: String },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

const Payout: Model<IPayout> = mongoose.models.Payout || 
  mongoose.model<IPayout>('Payout', PayoutSchema);

export default Payout;
