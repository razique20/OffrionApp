import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../src/models/User';
import Category from '../src/models/Category';
import Deal from '../src/models/Deal';
import MerchantProfile from '../src/models/MerchantProfile';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Deal.deleteMany({});
    await MerchantProfile.deleteMany({});
    console.log('Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Retail', slug: 'retail', description: 'Fashion, Electronics, and more' },
      { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants and Cafes' },
      { name: 'Travel', slug: 'travel', description: 'Flights, Hotels, and Tours' },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Spas, Wellness, and Events' },
    ]);
    console.log('Created Categories');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const merchantUser = await User.create({
      name: 'Global Merchant',
      email: 'merchant@example.com',
      password: hashedPassword,
      role: UserRole.MERCHANT,
    });

    const partnerUser = await User.create({
      name: 'Mobile App Partner',
      email: 'partner@example.com',
      password: hashedPassword,
      role: UserRole.PARTNER,
    });

    console.log('Created Users');

    // Create Merchant Profile
    await MerchantProfile.create({
      userId: merchantUser._id,
      businessName: 'Global Retail Solutions',
      description: 'A leading provider of retail deals across the globe.',
      logoUrl: '/images/merchant-owner.png',
      website: 'https://example.com',
      contactEmail: 'merchant@example.com',
      contactPhone: '+1234567890',
      address: '123 Business Ave, Tech City, TC 10101',
    });
    console.log('Created Merchant Profile');

    // Create Sample Deals
    const sampleDeals = [
      {
        merchantId: merchantUser._id,
        categoryId: categories[0]._id, // Retail
        title: '50% Off Premium Footwear',
        description: 'Get half price on all premium leather boots and sneakers.',
        images: ['/images/dashboard.png'],
        originalPrice: 200,
        discountedPrice: 100,
        commissionPercentage: 15,
        location: { type: 'Point', coordinates: [73.8567, 18.5204] }, // Pune
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        priorityScore: 85,
      },
      {
        merchantId: merchantUser._id,
        categoryId: categories[1]._id, // Food
        title: 'Buy 1 Get 1 Free - Gourmet Pizzas',
        description: 'Enjoy our signature wood-fired pizzas with a BOGO offer.',
        images: ['/images/qr-scan.png'],
        originalPrice: 40,
        discountedPrice: 20,
        commissionPercentage: 10,
        location: { type: 'Point', coordinates: [72.8777, 19.0760] }, // Mumbai
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        priorityScore: 90,
      },
      {
        merchantId: merchantUser._id,
        categoryId: categories[2]._id, // Travel
        title: 'Luxury Staycation - 30% Off',
        description: 'Experience a 5-star retreat in the heart of the city.',
        images: ['/images/api-network.png'],
        originalPrice: 500,
        discountedPrice: 350,
        commissionPercentage: 20,
        location: { type: 'Point', coordinates: [77.2090, 28.6139] }, // Delhi
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
        priorityScore: 75,
      },
      {
         merchantId: merchantUser._id,
         categoryId: categories[3]._id, // Lifestyle
         title: 'Full Day Spa Package',
         description: 'Complete relaxation with our signature massage and facial.',
         images: ['/images/merchant-owner.png'],
         originalPrice: 150,
         discountedPrice: 99,
         commissionPercentage: 12,
         location: { type: 'Point', coordinates: [80.2707, 13.0827] }, // Chennai
         validFrom: new Date(),
         validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
         isActive: true,
         priorityScore: 80,
       }
    ];

    await Deal.insertMany(sampleDeals);
    console.log('Created Sample Deals');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
