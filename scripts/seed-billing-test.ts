import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import MerchantProfile from '../src/models/MerchantProfile';
import { MerchantBillingPreference } from '../src/lib/constants';

dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Find a merchant and update it to postpaid
  const merchant = await MerchantProfile.findOne({});
  if (merchant) {
    merchant.billingPreference = MerchantBillingPreference.CARD_ON_FILE;
    merchant.accruedLiability = 250.75;
    await merchant.save();
    console.log('Updated merchant for billing test:', merchant.businessName);
  } else {
    console.log('No merchants found');
  }
  
  process.exit(0);
}
run();
