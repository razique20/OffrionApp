import mongoose, { Schema, Document, Model } from 'mongoose';
import './Category'; // Ensure Category is registered

export type EventType = 'general' | 'holiday' | 'flash' | 'seasonal' | 'clearance';
export type DealType = 'percentage' | 'flat' | 'bogo' | 'free-item';
export type TargetAudience = 'student' | 'senior' | 'member' | 'all';

export interface IDeal extends Document {
  merchantId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number; // Computed and stored for fast filtering
  commissionPercentage: number;
  tags: string[];
  eventType: EventType;
  dealType: DealType;
  targetAudience: TargetAudience[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  currentUsage: number;
  status: 'pending' | 'active' | 'rejected' | 'suspended';
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
    discountPercentage: { type: Number, default: 0, index: true },
    commissionPercentage: { type: Number, default: 10 },
    tags: { type: [String], default: [], index: true },
    eventType: {
      type: String,
      enum: ['general', 'holiday', 'flash', 'seasonal', 'clearance'],
      default: 'general',
      index: true,
    },
    dealType: {
      type: String,
      enum: ['percentage', 'flat', 'bogo', 'free-item'],
      default: 'percentage',
      index: true,
    },
    targetAudience: {
      type: [String],
      enum: ['student', 'senior', 'member', 'all'],
      default: ['all'],
      index: true,
    },
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
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'suspended'],
      default: 'pending',
      index: true,
    },
    isActive: { type: Boolean, default: false },
    priorityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-compute discountPercentage before save
DealSchema.pre('save', async function (this: any) {
  if (this.originalPrice > 0) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
    );
  }
});

// Indexes
DealSchema.index({ location: '2dsphere' });
DealSchema.index({ title: 'text', description: 'text', tags: 'text' });
DealSchema.index({ validFrom: 1, validUntil: 1 });

const Deal: Model<IDeal> = mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);

export default Deal;
