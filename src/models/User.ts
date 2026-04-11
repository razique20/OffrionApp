import mongoose, { Schema, Document, Model } from 'mongoose';

import { UserRole } from '@/lib/constants';

export { UserRole };

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  roles: UserRole[];
  isActive: boolean;
  permissions: string[];
  stripeConnectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false }, // Optional for SSO/OAuth in future
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PARTNER,
    },
    roles: [{
      type: String,
      enum: Object.values(UserRole),
    }],
    isActive: { type: Boolean, default: true },
    permissions: [{ type: String }],
    stripeConnectId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
