import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import APIKey from '@/models/APIKey';
import AnalyticsEvent from '@/models/AnalyticsEvent';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    // 1. API Key Validation
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }

    const apiKey = await APIKey.findOne({ key: apiKeyHeader, isActive: true });
    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
    }

    // Update last used at
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    // 2. Build Query
    const query: any = { isActive: true };

    const categoryId = searchParams.get('categoryId');
    if (categoryId) query.categoryId = categoryId;

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.discountedPrice = {};
      if (minPrice) query.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
    }

    const search = searchParams.get('search');
    if (search) {
      query.$text = { $search: search };
    }

    // Geo-spatial Search
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || 10000; // Default 10km

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius),
        },
      };
    }

    // 3. Fetch Deals
    const deals = await Deal.find(query)
      .populate('categoryId', 'name slug')
      .sort(search ? { score: { $meta: 'textScore' } } : { priorityScore: -1, createdAt: -1 })
      .limit(50);

    // 4. Log Impressions (Async/Fire-and-forget for performance)
    // In a real production app, we might use a message queue (BullMQ) or Redis
    // For now, we'll just create the analytics events for each deal shown
    const impressionEvents = deals.map(deal => ({
      type: 'impression',
      dealId: deal._id,
      partnerId: apiKey.partnerId,
      merchantId: deal.merchantId,
    }));
    
    // Using insertMany to batch the impression logs
    if (impressionEvents.length > 0) {
      AnalyticsEvent.insertMany(impressionEvents).catch(err => console.error('Failed to log impressions:', err));
    }

    return NextResponse.json({ 
      count: deals.length,
      deals 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
