import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import dbConnect from '../src/lib/mongodb';
import SandboxDeal from '../src/models/SandboxDeal';
import Category from '../src/models/Category';
import mongoose from 'mongoose';

async function seedSandbox() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not found');
  await mongoose.connect(process.env.MONGODB_URI);
  
  const categories = await Category.find();
  const getCatId = (slug: string) => categories.find(c => c.slug === slug)?._id || categories[0]?._id;

  // Use a real merchant from the database
  const User = mongoose.connection.models.User || require('../src/models/User').default;
  const merchant = await User.findOne({ role: 'merchant' });
  if (!merchant) {
    console.error('No merchant found. Please run main seed script first.');
    process.exit(1);
  }
  const dummyMerchantId = merchant._id;
  const dubaiDeals = [
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('food-dining'),
      title: 'Marina Sunset Dinner Cruise',
      description: 'Luxury 5-star buffet dinner cruise with Burj Al Arab views.',
      images: ['https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 500,
      discountedPrice: 250,
      discountPercentage: 50,
      commissionPercentage: 15,
      tags: ['luxury', 'marina', 'romantic'],
      location: { type: 'Point', coordinates: [55.1367, 25.0819] },
      validFrom: new Date(),
      validUntil: new Date('2024-12-31'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('travel'),
      title: 'Desert Safari Royal Adventure',
      description: 'Extreme dune bashing followed by traditional BBQ at a private camp.',
      images: ['https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 300,
      discountedPrice: 165,
      discountPercentage: 45,
      commissionPercentage: 20,
      tags: ['adventure', 'desert', 'safari'],
      location: { type: 'Point', coordinates: [55.45, 24.95] },
      validFrom: new Date(),
      validUntil: new Date('2024-11-30'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('lifestyle'),
      title: 'Palm Jumeirah Spa Retreat',
      description: 'Full body Balinese massage and pool access at a 5-star resort.',
      images: ['https://images.unsplash.com/photo-1544161515-4ae6b91827d1?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 850,
      discountedPrice: 399,
      discountPercentage: 53,
      commissionPercentage: 12,
      tags: ['wellness', 'spa', 'palm-jumeirah'],
      location: { type: 'Point', coordinates: [55.1390, 25.1124] },
      validFrom: new Date(),
      validUntil: new Date('2024-09-30'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('lifestyle'),
      title: 'Burj View Coffee & Pastry',
      description: 'Enjoy specialty coffee with unobstructed views of the Burj Khalifa.',
      images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 65,
      discountedPrice: 30,
      discountPercentage: 54,
      commissionPercentage: 10,
      tags: ['downtown', 'coffee', 'view'],
      location: { type: 'Point', coordinates: [55.2744, 25.1972] },
      validFrom: new Date(),
      validUntil: new Date('2024-06-30'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('lifestyle'),
      title: 'Ski Dubai Full Day Pass',
      description: 'Experience the snow in the desert with unlimited rides on the chairlift.',
      images: ['https://images.unsplash.com/photo-1517176102644-b467b26c367d?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 250,
      discountedPrice: 175,
      discountPercentage: 30,
      commissionPercentage: 10,
      tags: ['snow', 'mall-of-emirates', 'family'],
      location: { type: 'Point', coordinates: [55.195, 25.118] },
      validFrom: new Date(),
      validUntil: new Date('2025-01-01'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('food-dining'),
      title: 'JBR Beachfront Brunch',
      description: 'The ultimate weekend beach club brunch with live DJ.',
      images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 450,
      discountedPrice: 299,
      discountPercentage: 34,
      commissionPercentage: 15,
      tags: ['jbr', 'brunch', 'party'],
      location: { type: 'Point', coordinates: [55.1311, 25.0763] },
      validFrom: new Date(),
      validUntil: new Date('2024-12-31'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('travel'),
      title: 'Ain Dubai Observation Cabin',
      description: 'Experience 360-degree views of Dubai from the world\'s largest observation wheel.',
      images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 200,
      discountedPrice: 150,
      discountPercentage: 25,
      commissionPercentage: 12,
      tags: ['bluewaters', 'views', 'wheel'],
      location: { type: 'Point', coordinates: [55.122, 25.08] },
      validFrom: new Date(),
      validUntil: new Date('2024-12-31'),
      status: 'active',
      isActive: true,
    },
    {
      merchantId: dummyMerchantId,
      categoryId: getCatId('lifestyle'),
      title: 'Museum of the Future Access',
      description: 'Journey through possible futures in this architectural marvel.',
      images: ['https://images.unsplash.com/photo-1626014303757-65646199341c?auto=format&fit=crop&q=80&w=800'],
      originalPrice: 145,
      discountedPrice: 120,
      discountPercentage: 17,
      commissionPercentage: 10,
      tags: ['future', 'museum', 'sheikh-zayed-rd'],
      location: { type: 'Point', coordinates: [55.281, 25.219] },
      validFrom: new Date(),
      validUntil: new Date('2025-06-30'),
      status: 'active',
      isActive: true,
    }
  ];

  try {
    await SandboxDeal.deleteMany({});
    await SandboxDeal.insertMany(dubaiDeals);
    console.log('Dubai Sandbox deals seeded successfully!');
  } catch (err) {
    console.error('Error seeding sandbox deals:', err);
  } finally {
    process.exit(0);
  }
}

seedSandbox();
