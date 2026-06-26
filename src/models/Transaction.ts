import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  dealId: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  apiKeyId?: mongoose.Types.ObjectId;
  partnerId?: mongoose.Types.ObjectId; // Absent for first-party 'direct' claims
  channel: 'partner' | 'direct'; // How the claim originated
  customerId?: mongoose.Types.ObjectId; // First-party customer account, if logged in
  userId?: mongoose.Types.ObjectId; // End user if tracked (legacy)
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  redeemedAt?: Date;
  expiresAt?: Date; // TTL field
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true, index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    apiKeyId: { type: Schema.Types.ObjectId, ref: 'APIKey', index: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    channel: {
      type: String,
      enum: ['partner', 'direct'],
      default: 'partner',
      index: true,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    redeemedAt: { type: Date },
    expiresAt: { type: Date },
    qrCode: { type: String },
  },
  { timestamps: true }
);

// TTL Index: Deletes documents at the time specified in expiresAt
TransactionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || 
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
