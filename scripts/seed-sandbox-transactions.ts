import dbConnect from '../src/lib/mongodb';
import SandboxDeal from '../src/models/SandboxDeal';
import SandboxTransaction from '../src/models/SandboxTransaction';
import SandboxCommission from '../src/models/SandboxCommission';
import AnalyticsEvent from '../src/models/AnalyticsEvent';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedTransactions() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not found');
  await mongoose.connect(process.env.MONGODB_URI);

  const User = mongoose.connection.models.User || require('../src/models/User').default;
  const merchant = await User.findOne({ role: 'merchant' });
  const partner = await User.findOne({ role: 'partner' });
  
  if (!merchant || !partner) {
    console.error('Missing merchant or partner users');
    process.exit(1);
  }

  const deals = await SandboxDeal.find({ merchantId: merchant._id });
  if (deals.length === 0) {
    console.error('No sandbox deals found to bind transactions to.');
    process.exit(1);
  }

  console.log(`Found ${deals.length} deals. Generating dummy transactions...`);

  const tDocs = [];
  const cDocs = [];
  const statuses = ['completed', 'completed', 'completed', 'pending'];

  for (const deal of deals) {
    // Generate 2-5 transactions per deal
    const numTx = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numTx; i++) {
       const status = statuses[Math.floor(Math.random() * statuses.length)];
       const amount = deal.discountedPrice || deal.originalPrice || 100;
       
       const txId = new mongoose.Types.ObjectId();
       
       // Random date in the last 7 days
       const date = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));

       tDocs.push({
         _id: txId,
         dealId: deal._id,
         merchantId: merchant._id,
         partnerId: partner._id,
         amount: amount,
         currency: 'USD',
         status: status,
         environment: 'sandbox',
         createdAt: date,
         updatedAt: date
       });

       if (status === 'completed') {
           const commAmount = (amount * (deal.commissionPercentage || 10)) / 100;
           cDocs.push({
               transactionId: txId,
               dealId: deal._id,
               merchantId: merchant._id,
               partnerId: partner._id,
               amount: commAmount,
               partnerShare: commAmount * 0.8,
               platformShare: commAmount * 0.2,
               status: 'cleared',
               environment: 'sandbox',
               createdAt: date,
               updatedAt: date
           });
       }
    }
  }

  await SandboxTransaction.deleteMany({});
  await SandboxCommission.deleteMany({});
  
  await SandboxTransaction.insertMany(tDocs);
  await SandboxCommission.insertMany(cDocs);

  console.log(`Successfully generated ${tDocs.length} dummy sandbox transactions and ${cDocs.length} commissions!`);
  process.exit(0);
}

seedTransactions().catch(err => {
    console.error(err);
    process.exit(1);
});
