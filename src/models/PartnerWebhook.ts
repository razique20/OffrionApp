import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPartnerWebhook extends Document {
  partnerId: mongoose.Types.ObjectId;
  url: string;
  secret: string;
  isActive: boolean;
  enabledEvents: string[];
  environment: 'production' | 'sandbox';
  createdAt: Date;
  updatedAt: Date;
}

const PartnerWebhookSchema: Schema = new Schema(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true },
    secret: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    enabledEvents: { 
      type: [String], 
      default: ['deal.redeemed', 'commission.earned'],
      enum: ['deal.redeemed', 'commission.earned', 'payout.processed']
    },
    environment: { 
      type: String, 
      enum: ['production', 'sandbox'], 
      default: 'production',
      index: true
    },
  },
  { timestamps: true }
);

const PartnerWebhook: Model<IPartnerWebhook> = mongoose.models.PartnerWebhook || mongoose.model<IPartnerWebhook>('PartnerWebhook', PartnerWebhookSchema);

export default PartnerWebhook;
