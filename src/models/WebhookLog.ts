import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWebhookLog extends Document {
  partnerId: mongoose.Types.ObjectId;
  webhookId: mongoose.Types.ObjectId; // Reference to the configuration
  event: string;
  url: string;
  payload: any;
  status: 'pending' | 'success' | 'failed';
  responseCode?: number;
  errorMessage?: string;
  retryCount: number;
  lastAttemptAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookLogSchema: Schema = new Schema(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    webhookId: { type: Schema.Types.ObjectId, ref: 'PartnerWebhook', required: true },
    event: { type: String, required: true, index: true },
    url: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'success', 'failed'], 
      default: 'pending',
      index: true 
    },
    responseCode: { type: Number },
    errorMessage: { type: String },
    retryCount: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for the retry worker to find logs that need retrying
WebhookLogSchema.index({ status: 1, retryCount: 1, lastAttemptAt: 1 });

const WebhookLog: Model<IWebhookLog> = mongoose.models.WebhookLog || 
  mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);

export default WebhookLog;
