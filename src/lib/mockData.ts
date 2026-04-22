import mongoose from 'mongoose';

export const MOCK_DEALS = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    merchantId: new mongoose.Types.ObjectId().toString(),
    title: "Sandbox: 50% Off Gourmet Coffee",
    description: "Enjoy high-quality artisan coffee at half the price. This is a sandbox testing deal.",
    images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"],
    originalPrice: 30,
    discountedPrice: 15,
    discountPercentage: 50,
    commissionPercentage: 10,
    country: "United Arab Emirates",
    emirate: "Dubai",
    landmark: "Burj Khalifa District",
    location: {
      type: "Point",
      coordinates: [55.2708, 25.2048] // Longitude, Latitude
    },
    eventType: "flash",
    dealType: "percentage",
    targetAudience: ["all"],
    tags: ["coffee", "gourmet", "dubai"],
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 7).toISOString(),
    usageLimit: 100,
    currentUsage: 25,
    status: "active",
    isActive: true,
    isHot: true,
    isFeatured: false,
    priorityScore: 85,
    categoryId: { 
      _id: new mongoose.Types.ObjectId().toString(), 
      name: "Food & Beverage", 
      slug: "food-beverage" 
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    merchantId: new mongoose.Types.ObjectId().toString(),
    title: "Sandbox: Luxury Spa Treatment",
    description: "Relax with a premium spa package. Perfect for mobile app UI testing.",
    images: ["https://images.unsplash.com/photo-1544161515-4ae6ce6fe858?w=800&q=80"],
    originalPrice: 500,
    discountedPrice: 350,
    discountPercentage: 30,
    commissionPercentage: 15,
    country: "United Arab Emirates",
    emirate: "Abu Dhabi",
    landmark: "Yas Island",
    location: {
      type: "Point",
      coordinates: [54.6032, 24.4667]
    },
    eventType: "holiday",
    dealType: "flat",
    targetAudience: ["member"],
    tags: ["spa", "luxury", "wellness"],
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
    usageLimit: 0,
    currentUsage: 12,
    status: "active",
    isActive: true,
    isHot: false,
    isFeatured: true,
    priorityScore: 70,
    categoryId: { 
      _id: new mongoose.Types.ObjectId().toString(), 
      name: "Health & Wellness", 
      slug: "wellness" 
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    merchantId: new mongoose.Types.ObjectId().toString(),
    title: "Sandbox: Tech Gear Bundle",
    description: "Get the latest tech accessories in one bundle. Exclusive for senior developers.",
    images: ["https://images.unsplash.com/photo-1526738549149-8e07eca2939d?w=800&q=80"],
    originalPrice: 120,
    discountedPrice: 60,
    discountPercentage: 50,
    commissionPercentage: 8,
    country: "United Arab Emirates",
    emirate: "Sharjah",
    landmark: "University City",
    location: {
      type: "Point",
      coordinates: [55.4851, 25.2911]
    },
    eventType: "flash",
    dealType: "percentage",
    targetAudience: ["senior"],
    tags: ["tech", "bundle", "developer"],
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 86400000).toISOString(),
    usageLimit: 50,
    currentUsage: 48,
    status: "active",
    isActive: true,
    isHot: true,
    isFeatured: false,
    priorityScore: 95,
    categoryId: { 
      _id: new mongoose.Types.ObjectId().toString(), 
      name: "Electronics", 
      slug: "electronics" 
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];
