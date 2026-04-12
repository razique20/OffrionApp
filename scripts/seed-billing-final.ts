import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import MerchantProfile from '../src/models/MerchantProfile';
import Commission from '../src/models/Commission';
import User from '../src/models/User';
import Transaction from '../src/models/Transaction';
import Deal from '../src/models/Deal';
import { MerchantBillingPreference } from '../src/lib/constants';

dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // 1. Find a merchant (e.g., Urban Eats Corp)
  const user = await User.findOne({ email: 'eats@example.com' });
  if (!user) {
    console.error('Merchant user not found');
    process.exit(1);
  }

  // 2. Set to card_on_file
  const profile = await MerchantProfile.findOneAndUpdate(
    { userId: user._id },
    { billingPreference: MerchantBillingPreference.CARD_ON_FILE, status: 'verified' },
    { new: true, upsert: true }
  );
  console.log('Merchant set to Postpaid:', profile.businessName);

  // 3. Find a deal for this merchant
  const deal = await Deal.findOne({ merchantId: user._id });
  if (!deal) {
    console.error('No deal found for merchant');
    process.exit(1);
  }

  // 4. Create a few pending commissions
  const dummyTransactions = await Promise.all([
    Transaction.create({ dealId: deal._id, partnerId: user._id, merchantId: user._id, amount: 100, status: 'completed' }),
    Transaction.create({ dealId: deal._id, partnerId: user._id, merchantId: user._id, amount: 50, status: 'completed' }),
  ]);

  for (const trans of dummyTransactions) {
    await Commission.create({
      transactionId: trans._id,
      partnerId: new mongoose.Types.ObjectId(), // dummy partner
      merchantId: user._id,
      amount: trans.amount * 0.1, // 10% commission
      partnerShare: trans.amount * 0.07,
      platformShare: trans.amount * 0.03,
      status: 'pending'
    });
  }

  console.log('Seeded 2 pending commissions ($15 total liability) for Urban Eats Corp');
  
  process.exit(0);
}
run();
