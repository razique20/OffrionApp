import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * End-user (consumer) account, kept separate from the staff `User` model
 * (admin / merchant / partner). Customers self-register to claim deals on
 * the first-party storefront; guests can still claim anonymously without one.
 */
export interface ICustomer extends Document {
  name: string;
  email: string;
  password?: string;
  country?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    country: { type: String, default: 'United Arab Emirates' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
