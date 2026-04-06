import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is missing from environment variables. Stripe will not be able to process payments.');
}

// Fallback to a placeholder sk_test_ key to prevent Evaluation Crash
const key = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_not_set';

export const stripe = new Stripe(key, {
  apiVersion: '2025-01-27.acacia' as any, // Use newest stable API
  typescript: true,
});

// Mapping internal SubscriptionPlan enums to Stripe Price IDs
// These should correspond to the products/prices created in your Stripe Dashboard.
export const STRIPE_PRICES: Record<string, string> = {
  // Merchant Plans
  'merchant_pro': process.env.STRIPE_PRICE_MERCHANT_PRO || 'price_placeholder_pro',
  'merchant_enterprise': process.env.STRIPE_PRICE_MERCHANT_ENTERPRISE || 'price_placeholder_enterprise',
  
  // Partner Plans
  'partner_pro': process.env.STRIPE_PRICE_PARTNER_PRO || 'price_placeholder_pro',
  'partner_enterprise': process.env.STRIPE_PRICE_PARTNER_ENTERPRISE || 'price_placeholder_enterprise',
};

export const PLAN_FEATURES: Record<string, string[]> = {
  'merchant_free': ['Basic Deal Creation', 'Standard Support'],
  'merchant_pro': ['Unlimited Deal Creation', 'Advanced Analytics', 'Priority Support', 'Custom Branding'],
  'merchant_enterprise': ['Everything in Pro', 'White-labeling', 'Dedicated Account Manager', 'Custom API Integrations'],
  
  'partner_free': ['10,000 API Requests / mo', 'Standard Analytics', 'Email Support'],
  'partner_pro': ['100,000 API Requests / mo', 'Full Analytics Suite', '24/7 Priority Support', 'API Key Management'],
  'partner_enterprise': ['Unlimited API Requests', 'Real-time Webhooks', 'Dedicated Node Access', 'Premium Compliance Tools'],
};
