import mongoose, { Schema, Document, Model } from 'mongoose';

export enum SubscriptionPlan {
  MERCHANT_FREE = 'merchant_free',
  MERCHANT_PRO = 'merchant_pro',
  MERCHANT_ENTERPRISE = 'merchant_enterprise',
  PARTNER_FREE = 'partner_free',
  PARTNER_PRO = 'partner_pro',
  PARTNER_ENTERPRISE = 'partner_enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
  paymentMethodLast4?: string;
  paymentMethodBrand?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.MERCHANT_FREE,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    paymentMethodId: { type: String, required: false },
    paymentMethodLast4: { type: String, required: false },
    paymentMethodBrand: { type: String, required: false },
    stripeCustomerId: { type: String, required: false },
    stripeSubscriptionId: { type: String, required: false },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
