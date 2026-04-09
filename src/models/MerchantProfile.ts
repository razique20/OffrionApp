import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMerchantProfile extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const MerchantProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String },
    website: { type: String },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

const MerchantProfile: Model<IMerchantProfile> = mongoose.models.MerchantProfile || 
  mongoose.model<IMerchantProfile>('MerchantProfile', MerchantProfileSchema);

export default MerchantProfile;
