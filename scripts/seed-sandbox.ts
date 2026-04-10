import dbConnect from '../src/lib/mongodb';
import SandboxDeal from '../src/models/SandboxDeal';
import Category from '../src/models/Category';
import mongoose from 'mongoose';

async function seedSandbox() {
  await dbConnect();
  
  // Find a category
  const category = await Category.findOne({ slug: 'food-dining' }) || await Category.findOne();
  if (!category) {
    console.error('No categories found. Seed categories first.');
    process.exit(1);
  }

  const dummyMerchantId = new mongoose.Types.ObjectId(); // Virtual merchant for sandbox

  const dummyDeals = [
    {
      merchantId: dummyMerchantId,
      categoryId: category._id,
      title: 'Sandbox: 50% Off Gourmet Burger',
      description: 'Test deal for sandbox environment. Enjoy a premium burger at half price.',
      images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 60,
      discountedPrice: 30,
      discountPercentage: 50,
      commissionPercentage: 15,
      tags: ['burger', 'lunch', 'test'],
      location: { type: 'Point', coordinates: [55.2744, 25.1972] }, // Downtown Dubai
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: category._id,
      title: 'Sandbox: Buy 1 Get 1 Coffee',
      description: 'BOGO test deal for sandbox simulation.',
      images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 25,
      discountedPrice: 25,
      discountPercentage: 0,
      commissionPercentage: 10,
      tags: ['coffee', 'breakfast'],
      location: { type: 'Point', coordinates: [55.1367, 25.0819] }, // Dubai Marina
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      isActive: true,
    }
  ];

  try {
    await SandboxDeal.deleteMany({});
    await SandboxDeal.insertMany(dummyDeals);
    console.log('Sandbox deals seeded successfully!');
  } catch (err) {
    console.error('Error seeding sandbox deals:', err);
  } finally {
    process.exit(0);
  }
}

seedSandbox();
