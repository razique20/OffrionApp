import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoMatch) {
    MONGODB_URI = mongoMatch[1].trim();
  }
}

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment or .env.local');
  process.exit(1);
}

// We need to import models. Since we are in an ESM context and using ts-node,
// we should be careful with imports.
import Commission from '../src/models/Commission';
import Payout from '../src/models/Payout';
import Transaction from '../src/models/Transaction';
import AnalyticsEvent from '../src/models/AnalyticsEvent';
import WebhookLog from '../src/models/WebhookLog';
import Deal from '../src/models/Deal';
import MerchantProfile from '../src/models/MerchantProfile';

async function wipeData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected.');

    console.log('Clearing Transactions...');
    const tResult = await Transaction.deleteMany({});
    console.log(`Deleted ${tResult.deletedCount} transactions.`);

    console.log('Clearing Commissions...');
    const cResult = await Commission.deleteMany({});
    console.log(`Deleted ${cResult.deletedCount} commissions.`);

    console.log('Clearing Payouts...');
    const pResult = await Payout.deleteMany({});
    console.log(`Deleted ${pResult.deletedCount} payouts.`);

    console.log('Clearing Analytics Events...');
    const eResult = await AnalyticsEvent.deleteMany({});
    console.log(`Deleted ${eResult.deletedCount} analytics events.`);

    console.log('Clearing Webhook Logs...');
    const wResult = await WebhookLog.deleteMany({});
    console.log(`Deleted ${wResult.deletedCount} webhook logs.`);

    console.log('Resetting Deal usage counters...');
    const dResult = await Deal.updateMany({}, { $set: { currentUsage: 0 } });
    console.log(`Updated ${dResult.modifiedCount} deals.`);

    console.log('Resetting Merchant Profile balances...');
    const mResult = await MerchantProfile.updateMany({}, { $set: { balance: 0, accruedLiability: 0 } });
    console.log(`Updated ${mResult.modifiedCount} merchant profiles.`);

    console.log('Database cleanup complete.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

wipeData();
