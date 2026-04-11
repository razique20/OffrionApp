import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISandboxCommission extends Document {
  transactionId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  amount: number;
  partnerShare: number;
  platformShare: number;
  status: 'pending' | 'cleared';
  createdAt: Date;
  updatedAt: Date;
}

const SandboxCommissionSchema: Schema = new Schema(
  {
    transactionId: { type: Schema.Types.ObjectId, ref: 'SandboxTransaction', required: true, unique: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    partnerShare: { type: Number, required: true },
    platformShare: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'cleared'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const SandboxCommission: Model<ISandboxCommission> = mongoose.models.SandboxCommission || 
  mongoose.model<ISandboxCommission>('SandboxCommission', SandboxCommissionSchema);

export default SandboxCommission;
