import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import dbConnect from '../src/lib/mongodb';
import Transaction from '../src/models/Transaction';
import SandboxTransaction from '../src/models/SandboxTransaction';
import Commission from '../src/models/Commission';
import SandboxCommission from '../src/models/SandboxCommission';
import AnalyticsEvent from '../src/models/AnalyticsEvent';

dotenv.config({ path: '.env.local' });
console.log('URI loaded:', !!process.env.MONGODB_URI);

async function cleanup() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not found');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const tCount = await Transaction.deleteMany({});
  const stCount = await SandboxTransaction.deleteMany({});
  const cCount = await Commission.deleteMany({});
  const scCount = await SandboxCommission.deleteMany({});
  const eCount = await AnalyticsEvent.deleteMany({});

  console.log(`Cleared Transactions: ${tCount.deletedCount}`);
  console.log(`Cleared Sandbox Transactions: ${stCount.deletedCount}`);
  console.log(`Cleared Commissions: ${cCount.deletedCount}`);
  console.log(`Cleared Sandbox Commissions: ${scCount.deletedCount}`);
  console.log(`Cleared Analytics Events: ${eCount.deletedCount}`);

  process.exit(0);
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
