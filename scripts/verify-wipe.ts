import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoMatch) {
    MONGODB_URI = mongoMatch[1].trim();
  }
}

import Transaction from '../src/models/Transaction';
import Commission from '../src/models/Commission';
import Payout from '../src/models/Payout';
import AnalyticsEvent from '../src/models/AnalyticsEvent';
import WebhookLog from '../src/models/WebhookLog';
import Deal from '../src/models/Deal';
import MerchantProfile from '../src/models/MerchantProfile';

async function verify() {
  await mongoose.connect(MONGODB_URI!);
  
  const tCount = await Transaction.countDocuments({});
  const cCount = await Commission.countDocuments({});
  const pCount = await Payout.countDocuments({});
  const eCount = await AnalyticsEvent.countDocuments({});
  const wCount = await WebhookLog.countDocuments({});
  
  const dealsWithUsage = await Deal.countDocuments({ currentUsage: { $gt: 0 } });
  const profilesWithBalance = await MerchantProfile.countDocuments({ 
    $or: [{ balance: { $ne: 0 } }, { accruedLiability: { $ne: 0 } }] 
  });

  console.log('--- Verification Results ---');
  console.log(`Transactions: ${tCount}`);
  console.log(`Commissions: ${cCount}`);
  console.log(`Payouts: ${pCount}`);
  console.log(`AnalyticsEvents: ${eCount}`);
  console.log(`WebhookLogs: ${wCount}`);
  console.log(`Deals with usage > 0: ${dealsWithUsage}`);
  console.log(`Merchant profiles with non-zero balance/liability: ${profilesWithBalance}`);
  
  await mongoose.disconnect();
}

verify();
