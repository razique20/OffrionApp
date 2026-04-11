import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Transaction from '../src/models/Transaction';
import SandboxTransaction from '../src/models/SandboxTransaction';
import SandboxCommission from '../src/models/SandboxCommission';
import AnalyticsEvent from '../src/models/AnalyticsEvent';
import SandboxDeal from '../src/models/SandboxDeal';

dotenv.config({ path: '.env.local' });

async function resetSandbox() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not found');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const stCount = await SandboxTransaction.deleteMany({});
  const scCount = await SandboxCommission.deleteMany({});
  const eCount = await AnalyticsEvent.deleteMany({ environment: 'sandbox' });
  const dCount = await SandboxDeal.deleteMany({});

  console.log(`Cleared Sandbox Transactions: ${stCount.deletedCount}`);
  console.log(`Cleared Sandbox Commissions: ${scCount.deletedCount}`);
  console.log(`Cleared Sandbox Analytics Events: ${eCount.deletedCount}`);
  console.log(`Cleared Sandbox Deals: ${dCount.deletedCount}`);

  console.log('Sandbox environment wiped. Now seeding deals...');
  
  // I will call the seed-sandbox script logic here or just require it.
  // For simplicity and to avoid path issues, I'll just run it via run_command after this.
  
  process.exit(0);
}

resetSandbox().catch(err => {
  console.error(err);
  process.exit(1);
});
