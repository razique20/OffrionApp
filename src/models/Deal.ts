import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDeal extends Document {
  merchantId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  commissionPercentage: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  currentUsage: number;
  isActive: boolean;
  priorityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    commissionPercentage: { type: Number, default: 10 },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, // 0 means unlimited
    currentUsage: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    priorityScore: { type: Number, default: 0 }, // For deal boosting
  },
  { timestamps: true }
);

// Create a 2dsphere index for location-based search
DealSchema.index({ location: '2dsphere' });
DealSchema.index({ title: 'text', description: 'text' }); // Full-text search

const Deal: Model<IDeal> = mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);

export default Deal;
