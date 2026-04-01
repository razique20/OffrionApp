import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAPIKey extends Document {
  partnerId: mongoose.Types.ObjectId;
  key: string;
  name: string;
  isActive: boolean;
  rateLimit: number; // requests per hour
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const APIKeySchema: Schema = new Schema(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    rateLimit: { type: Number, default: 1000 },
    lastUsedAt: { type: Date },
  },
  { timestamps: true }
);

const APIKey: Model<IAPIKey> = mongoose.models.APIKey || 
  mongoose.model<IAPIKey>('APIKey', APIKeySchema);

export default APIKey;
