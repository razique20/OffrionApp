import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../src/models/User';
import Category from '../src/models/Category';
import Deal from '../src/models/Deal';
import MerchantProfile from '../src/models/MerchantProfile';
import AnalyticsEvent from '../src/models/AnalyticsEvent';
import Transaction from '../src/models/Transaction';
import Commission from '../src/models/Commission';
import { PREDEFINED_CATEGORIES } from '../src/constants/categories';

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
    await Transaction.deleteMany({});
    await Commission.deleteMany({});
    await AnalyticsEvent.deleteMany({});
    console.log('Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany(
      PREDEFINED_CATEGORIES.map(cat => ({ ...cat, isActive: true }))
    );
    console.log(`Created ${categories.length} Predefined Categories`);

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
        logoUrl: 'https://images.unsplash.com/photo-1556740734-7f9a2b7a0f42?auto=format&fit=crop&w=200&h=200&q=80',
        website: `https://${merchant.email.split('@')[0]}.com`,
        contactEmail: merchant.email,
        contactPhone: '+1-555-010-999',
        address: '123 Business Way, Suite 100, Innovation District',
        status: merchant.isActive ? 'verified' : 'pending',
      });
    }
    console.log('Created Merchant Profiles');

    // Create Sample Deals
    const sampleDeals = [
      {
        merchantId: merchants[0]._id, categoryId: categories.find(c => c.slug === 'beauty-wellness')?._id || categories[0]._id,
        title: '70% Off Luxury SPA Weekend', description: 'Full body massage, sauna, and lunch included at the Palm Jumeirah.',
        images: ['https://images.unsplash.com/photo-1544161515-4ae6ce6fe858?auto=format&fit=crop&w=800&q=80'], 
        originalPrice: 500, discountedPrice: 150, discountPercentage: 70,
        commissionPercentage: 20, eventType: 'flash', dealType: 'percentage', targetAudience: ['all'],
        tags: ['spa', 'luxury', 'hot-deal'], location: { type: 'Point', coordinates: [55.13, 25.11] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 2 * 24 * 3600000), isActive: true, status: 'active',
        isHot: true, isFeatured: true, country: 'United Arab Emirates'
      },
      {
        merchantId: merchants[1]._id, categoryId: categories.find(c => c.slug === 'food-dining')?._id || categories[0]._id,
        title: 'BOGO - Artisan Pizzas', description: 'Wood-fired perfection at Urban Eats Corp. Buy one get one free all weekend.',
        images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'], 
        originalPrice: 40, discountedPrice: 20, discountPercentage: 50,
        commissionPercentage: 10, eventType: 'general', dealType: 'bogo', targetAudience: ['all'],
        tags: ['bogo', 'pizza'], location: { type: 'Point', coordinates: [55.27, 25.20] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 7 * 24 * 3600000), isActive: true, status: 'active',
        isFeatured: true, country: 'United Arab Emirates'
      },
      {
        merchantId: merchants[2]._id, categoryId: categories.find(c => c.slug === 'electronics-tech')?._id || categories[0]._id,
        title: 'Last-Gen Laptop Clearout', description: 'Powerful machines at unbeatable prices. While stocks last.',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'], 
        originalPrice: 1200, discountedPrice: 800, discountPercentage: 33,
        commissionPercentage: 8, eventType: 'seasonal', dealType: 'flat', targetAudience: ['all'],
        tags: ['laptop', 'electronics'], location: { type: 'Point', coordinates: [55.30, 25.25] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 14 * 24 * 3600000), status: 'pending', isActive: false,
        country: 'United Arab Emirates'
      },
      {
        merchantId: merchants[4]._id, categoryId: categories.find(c => c.slug === 'auto-transport')?._id || categories[0]._id,
        title: 'Free Oil Change w/ Service', description: 'Keep your car running smooth with our premium oil change service.',
        images: ['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80'], 
        originalPrice: 80, discountedPrice: 0, discountPercentage: 100,
        commissionPercentage: 5, eventType: 'holiday', dealType: 'flat', targetAudience: ['all'],
        tags: ['auto', 'maintenance'], location: { type: 'Point', coordinates: [55.40, 25.30] },
        validFrom: new Date(), validUntil: new Date(Date.now() + 10 * 24 * 3600000), isActive: true, status: 'active',
        isHot: true, country: 'United Arab Emirates'
      }
    ];

    // Add 8 more random-ish deals
    for (let i = 0; i < 8; i++) {
        const catIdx = Math.floor(Math.random() * categories.length);
        sampleDeals.push({
            merchantId: merchants[Math.floor(Math.random() * merchants.length)]._id,
            categoryId: categories[catIdx]._id,
            title: `Exclusive ${categories[catIdx].name} Offer #${i + 1}`,
            description: 'A great value deal for our platform members. Limited time only.',
            images: [`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`],
            originalPrice: 100 + (i * 10),
            discountedPrice: 50 + (i * 5),
            discountPercentage: 50,
            commissionPercentage: 10,
            eventType: 'general',
            dealType: 'percentage',
            targetAudience: ['all'],
            tags: ['deal', 'promo', categories[catIdx].slug],
            location: { type: 'Point', coordinates: [55.27, 25.20] },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 3600000),
            isActive: i % 3 !== 0,
            status: i % 3 !== 0 ? 'active' : 'pending',
            country: 'United Arab Emirates'
        });
    }

    await Deal.insertMany(sampleDeals);
    console.log('Created Extensive Sample Deals');

    // 6. Create some dummy Transactions & Commissions for Analytics (Production)
    const partner = partners[0];
    const merchant = merchants[0];
    const deal = await Deal.findOne({ merchantId: merchant._id });

    if (deal) {
      const dummyTransactions = [];
      const dummyCommissions = [];
      const dummyEvents = [];

      // Create 20 transactions over the last 10 days
      for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(i / 2));
        
        const trans = await Transaction.create({
          dealId: deal._id,
          merchantId: merchant._id,
          partnerId: partner._id,
          amount: deal.discountedPrice || 100,
          status: 'completed',
          createdAt: date
        });

        await Commission.create({
          transactionId: trans._id,
          partnerId: partner._id,
          merchantId: merchant._id,
          amount: (deal.discountedPrice || 100) * (deal.commissionPercentage || 10) / 100,
          partnerShare: ((deal.discountedPrice || 100) * (deal.commissionPercentage || 10) / 100) * 0.75,
          platformShare: ((deal.discountedPrice || 100) * (deal.commissionPercentage || 10) / 100) * 0.25,
          status: i % 5 === 0 ? 'paid' : 'pending',
          createdAt: date
        });

        // Add some events
        dummyEvents.push(
          { type: 'impression', dealId: deal._id, merchantId: merchant._id, partnerId: partner._id, createdAt: date },
          { type: 'click', dealId: deal._id, merchantId: merchant._id, partnerId: partner._id, createdAt: date },
          { type: 'conversion', dealId: deal._id, merchantId: merchant._id, partnerId: partner._id, createdAt: date }
        );
      }
      await AnalyticsEvent.insertMany(dummyEvents);
      console.log('Created Production Demo Analytics Data');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
