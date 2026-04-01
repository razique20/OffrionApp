import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommission extends Document {
  transactionId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  amount: number;
  partnerShare: number;
  platformShare: number;
  status: 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSchema: Schema = new Schema(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true, unique: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    partnerShare: { type: Number, required: true }, // Partner share in currency
    platformShare: { type: Number, required: true }, // Platform share in currency
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Commission: Model<ICommission> = mongoose.models.Commission || 
  mongoose.model<ICommission>('Commission', CommissionSchema);

export default Commission;
