import mongoose, { Schema, Document, Model } from 'mongoose';
import './Category';

export interface ISandboxDeal extends Document {
  merchantId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  commissionPercentage: number;
  tags: string[];
  eventType: string;
  dealType: string;
  targetAudience: string[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  validFrom: Date;
  validUntil: Date;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SandboxDealSchema: Schema = new Schema(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    commissionPercentage: { type: Number, default: 10 },
    tags: { type: [String], default: [] },
    eventType: { type: String, default: 'general' },
    dealType: { type: String, default: 'percentage' },
    targetAudience: { type: [String], default: ['all'] },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    status: { type: String, default: 'active' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SandboxDealSchema.index({ location: '2dsphere' });

const SandboxDeal: Model<ISandboxDeal> = mongoose.models.SandboxDeal || mongoose.model<ISandboxDeal>('SandboxDeal', SandboxDealSchema);

export default SandboxDeal;
