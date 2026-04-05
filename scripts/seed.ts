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
      { name: 'Retail', slug: 'retail', description: 'Fashion, Electronics, and more', isActive: true },
      { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants and Cafes', isActive: true },
      { name: 'Travel', slug: 'travel', description: 'Flights, Hotels, and Tours', isActive: true },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Spas, Wellness, and Events', isActive: true },
      { name: 'Automotive', slug: 'automotive', description: 'Cars, Parts, and Service', isActive: true },
      { name: 'Electronics', slug: 'electronics', description: 'Gadgets and Appliances', isActive: true },
    ]);
    console.log('Created Categories');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 5 Merchants
    const merchants = await User.insertMany([
      { name: 'Global Retailers', email: 'merchant@example.com', password: hashedPassword, role: UserRole.MERCHANT, isActive: true },
      { name: 'Urban Eats Corp', email: 'eats@example.com', password: hashedPassword, role: UserRole.MERCHANT, isActive: true },
      { name: 'Tech Haven', email: 'tech@example.com', password: hashedPassword, role: UserRole.MERCHANT, isActive: true },
      { name: 'Slow Sips Coffee', email: 'coffee@example.com', password: hashedPassword, role: UserRole.MERCHANT, isActive: false },
      { name: 'Auto Pros', email: 'auto@example.com', password: hashedPassword, role: UserRole.MERCHANT, isActive: true },
    ]);

    // 5 Partners
    const partners = await User.insertMany([
      { name: 'Mobile App Partner', email: 'partner@example.com', password: hashedPassword, role: UserRole.PARTNER, isActive: true },
      { name: 'Travelo Network', email: 'travelo@example.com', password: hashedPassword, role: UserRole.PARTNER, isActive: true },
      { name: 'Deal Hunter App', email: 'hunter@example.com', password: hashedPassword, role: UserRole.PARTNER, isActive: true },
      { name: 'Local Guide', email: 'guide@example.com', password: hashedPassword, role: UserRole.PARTNER, isActive: false },
      { name: 'Social Influencer X', email: 'influencer@example.com', password: hashedPassword, role: UserRole.PARTNER, isActive: true },
    ]);

    const adminUser = await User.create({
      name: 'Offrion Admin',
      email: 'admin@offrion.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      permissions: ['MANAGE_DEALS', 'MANAGE_CATEGORIES']
    });

    const superAdminUser = await User.create({
      name: 'Super Director',
      email: 'superadmin@offrion.com',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      permissions: ['ALL']
    });

    console.log('Created Diverse Users (Super Admin, Admin, Merchant, Partner)');

    // Create Merchant Profiles
    for (const merchant of merchants) {
      await MerchantProfile.create({
        userId: merchant._id,
        businessName: merchant.name,
        description: `Premium services from ${merchant.name}.`,
        logoUrl: '/images/merchant-owner.png',
        website: `https://${merchant.email.split('@')[0]}.com`,
        contactEmail: merchant.email,
        contactPhone: '+1-555-010-999',
        address: '123 Business Way, Suite 100, Innovation District',
      });
    }
    console.log('Created Merchant Profiles');

    // Create 12 Sample Deals
    const sampleDeals = [
      {
        merchantId: merchants[0]._id, categoryId: categories[0]._id,
        title: '50% Off Premium Footwear', description: 'Half price on all premium leather boots.',
        images: ['/images/dashboard.png'], originalPrice: 200, discountedPrice: 100, discountPercentage: 50,
        commissionPercentage: 15, eventType: 'flash', dealType: 'percentage', targetAudience: ['all'],
        tags: ['flash-sale', 'footwear'], location: { type: 'Point', coordinates: [73.85, 18.52] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 30 * 24 * 3600000), isActive: true,
      },
      {
        merchantId: merchants[1]._id, categoryId: categories[1]._id,
        title: 'BOGO - Artisan Pizzas', description: 'Wood-fired perfection.',
        images: ['/images/qr-scan.png'], originalPrice: 40, discountedPrice: 20, discountPercentage: 50,
        commissionPercentage: 10, eventType: 'general', dealType: 'bogo', targetAudience: ['all'],
        tags: ['bogo', 'pizza'], location: { type: 'Point', coordinates: [72.87, 19.07] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 7 * 24 * 3600000), isActive: true,
      },
      {
        merchantId: merchants[2]._id, categoryId: categories[5]._id,
        title: 'Last-Gen Laptop Clearout', description: 'Powerful machines at unbeatable prices.',
        images: ['/images/api-network.png'], originalPrice: 1200, discountedPrice: 800, discountPercentage: 33,
        commissionPercentage: 8, eventType: 'seasonal', dealType: 'flat', targetAudience: ['all'],
        tags: ['laptop', 'electronics'], location: { type: 'Point', coordinates: [77.20, 28.61] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 14 * 24 * 3600000), isActive: false, // Pending moderation
      },
      {
        merchantId: merchants[4]._id, categoryId: categories[4]._id,
        title: 'Free Oil Change w/ Service', description: 'Keep your car running smooth.',
        images: ['/images/merchant-owner.png'], originalPrice: 80, discountedPrice: 0, discountPercentage: 100,
        commissionPercentage: 5, eventType: 'holiday', dealType: 'flat', targetAudience: ['all'],
        tags: ['auto', 'maintenance'], location: { type: 'Point', coordinates: [80.27, 13.08] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 10 * 24 * 3600000), isActive: true,
      }
    ];

    // Add 8 more random-ish deals
    for (let i = 0; i < 8; i++) {
        sampleDeals.push({
            merchantId: merchants[Math.floor(Math.random() * merchants.length)]._id,
            categoryId: categories[Math.floor(Math.random() * categories.length)]._id,
            title: `Dynamic Deal #${i + 1}`,
            description: 'A great value deal for our platform members.',
            images: ['/images/dashboard.png'],
            originalPrice: 100 + (i * 10),
            discountedPrice: 50 + (i * 5),
            discountPercentage: 50,
            commissionPercentage: 10,
            eventType: 'general',
            dealType: 'percentage',
            targetAudience: ['all'],
            tags: ['deal', 'promo'],
            location: { type: 'Point', coordinates: [72.87, 19.07] },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 3600000),
            isActive: i % 3 !== 0,
        });
    }

    await Deal.insertMany(sampleDeals);
    console.log('Created Extensive Sample Deals');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
