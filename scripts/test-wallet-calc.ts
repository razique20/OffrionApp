import dbConnect from '../src/lib/mongodb';
import Commission from '../src/models/Commission';
import Transaction from '../src/models/Transaction';
import Payout from '../src/models/Payout';
import User from '../src/models/User';
import mongoose from 'mongoose';

async function testWalletLogic() {
  try {
    await dbConnect();
    console.log('Connected to DB');

    // 1. Find or create dummy users
    let partner = await User.findOne({ role: 'partner' });
    let merchant = await User.findOne({ role: 'merchant' });

    if (!partner || !merchant) {
      console.log('No dummy users found, cannot run full test');
      process.exit(0);
    }

    const partnerId = partner._id;
    const merchantId = merchant._id;

    console.log(`Testing with Partner: ${partner.email}, Merchant: ${merchant.email}`);

    // 2. Clear previous commissions for clean test (optional but safer for local)
    // await Commission.deleteMany({ partnerId });

    // 3. Create mock commissions with different statuses
    const mockCommissions = [
      { partnerId, merchantId, transactionId: new mongoose.Types.ObjectId(), amount: 10, partnerShare: 7, status: 'pending' },
      { partnerId, merchantId, transactionId: new mongoose.Types.ObjectId(), amount: 10, partnerShare: 7, status: 'cleared' },
      { partnerId, merchantId, transactionId: new mongoose.Types.ObjectId(), amount: 10, partnerShare: 7, status: 'cleared' },
      { partnerId, merchantId, transactionId: new mongoose.Types.ObjectId(), amount: 10, partnerShare: 7, status: 'paid' },
    ];

    console.log('Seeding mock commissions...');
    for (const c of mockCommissions) {
      // Find a valid deal for transactionId if it were a real model join
      await Commission.create(c);
    }

    // 4. Test Aggregation Logic (Manual check of what API would do)
    const stats = await Commission.aggregate([
      { $match: { partnerId } },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: '$partnerShare' },
          pendingBalance: { 
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$partnerShare', 0] } 
          },
          withdrawableBalance: { 
            $sum: { $cond: [{ $eq: ['$status', 'cleared'] }, '$partnerShare', 0] } 
          },
        },
      },
    ]);

    console.log('Aggregation Results:', stats[0]);

    if (stats[0].pendingBalance === 7 && stats[0].withdrawableBalance === 14) {
      console.log('✅ Balance logic verified!');
    } else {
      console.log('❌ Balance logic mismatch');
    }

    // Cleanup mock data from this specific test
    // (In a real test environment we'd use a test DB)
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testWalletLogic();
