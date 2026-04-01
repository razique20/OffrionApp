import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  dealId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // End user if tracked
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  redeemedAt?: Date;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true, index: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    redeemedAt: { type: Date },
    qrCode: { type: String },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> = mongoose.models.Transaction || 
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
