import mongoose, { Schema, Document, Model } from 'mongoose';
import './SandboxDeal'; // Ensure SandboxDeal is registered for populate

export interface ISandboxTransaction extends Document {
  dealId: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  redeemedAt?: Date;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SandboxTransactionSchema: Schema = new Schema(
  {
    dealId: { type: Schema.Types.ObjectId, ref: 'SandboxDeal', required: true, index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    redeemedAt: { type: Date },
    qrCode: { type: String, index: true },
  },
  { timestamps: true }
);

const SandboxTransaction: Model<ISandboxTransaction> = mongoose.models.SandboxTransaction || 
  mongoose.model<ISandboxTransaction>('SandboxTransaction', SandboxTransactionSchema);

export default SandboxTransaction;
