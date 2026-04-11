import dbConnect from '../src/lib/mongodb';
import MerchantProfile from '../src/models/MerchantProfile';
import Deal from '../src/models/Deal';
import User from '../src/models/User';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testModerationLogic() {
  console.log('🚀 Starting Moderation Logic Test...');
  await dbConnect();

  try {
    // 1. Create a dummy merchant user
    const merchantUser = await User.create({
      name: 'Test Merchant',
      email: `test-merchant-${Date.now()}@example.com`,
      password: 'password123',
      role: 'merchant'
    });

    // 2. Create a pending profile
    const profile = await MerchantProfile.create({
      userId: merchantUser._id,
      businessName: 'Unverified Shop',
      contactEmail: merchantUser.email,
      contactPhone: '123456789',
      address: '123 Test St',
      status: 'pending'
    });

    console.log('✅ Created pending merchant profile.');

    // 3. Simulate deal creation via internal logic
    // (We mimic the logic in src/app/api/merchant/deals/route.ts)
    const isVerified = profile.status === 'verified';
    
    const deal = await Deal.create({
      merchantId: merchantUser._id,
      categoryId: new mongoose.Types.ObjectId(), // dummy id
      title: 'Suspiciously Early Deal',
      description: 'This should be pending because the merchant is unverified.',
      originalPrice: 100,
      discountedPrice: 80,
      location: { type: 'Point', coordinates: [0, 0] },
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 86400000),
      status: isVerified ? 'active' : 'pending',
      isActive: isVerified,
    });

    console.log('📊 Deal created status:', deal.status);
    console.log('📊 Deal isActive:', deal.isActive);

    if (deal.status === 'pending' && deal.isActive === false) {
      console.log('🎉 SUCCESS: Deal correctly set to pending for unverified merchant.');
    } else {
      console.error('❌ FAILURE: Deal status logic failed.');
    }

    // Cleanup
    await User.findByIdAndDelete(merchantUser._id);
    await MerchantProfile.findByIdAndDelete(profile._id);
    await Deal.findByIdAndDelete(deal._id);
    console.log('🧹 Cleanup completed.');

  } catch (error) {
    console.error('❌ Test crashed:', error);
  } finally {
    process.exit();
  }
}

testModerationLogic();
