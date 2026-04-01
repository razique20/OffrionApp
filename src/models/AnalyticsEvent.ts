import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  type: 'impression' | 'click' | 'conversion';
  dealId: mongoose.Types.ObjectId;
  partnerId?: mongoose.Types.ObjectId;
  merchantId: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
}

const AnalyticsEventSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['impression', 'click', 'conversion'],
      required: true,
      index: true,
    },
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true, index: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AnalyticsEvent: Model<IAnalyticsEvent> = mongoose.models.AnalyticsEvent || 
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

export default AnalyticsEvent;
