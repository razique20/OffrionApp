import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import APIKey from '@/models/APIKey';
import User from '@/models/User';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import mongoose from 'mongoose';

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
      return NextResponse.json({ 
        error: 'Invalid or inactive API Key',
        documentationUrl: '/docs/errors/403'
      }, { status: 403 });
    }

    // Determine environment
    const DealModel = Deal;

    // Update last used
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    // 2. Build Query
    const query: any = { isActive: true };

    // Regional Access Enforcement for Partners (Strict Zero-Access Default)
    const partner = await User.findById(apiKey.partnerId).select('accessCountries');
    const accessCountries = partner?.accessCountries || [];

    if (accessCountries.length > 0) {
      // If partner has UAE access, include deals with no country field as well (fallback for legacy data)
      if (accessCountries.includes('United Arab Emirates')) {
        query.$or = [
          { country: { $in: accessCountries } },
          { country: { $exists: false } },
          { country: null },
          { country: '' }
        ];
      } else {
        query.country = { $in: accessCountries };
      }
    } else {
      // If no regions are assigned, they see zero deals
      query._id = { $in: [] }; 
    }

    // ... (rest of the query building logic remains same)
    // --- Category Filter (supports multiple comma-separated IDs) ---
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      const ids = categoryId.split(',').map((id) => new mongoose.Types.ObjectId(id.trim()));
      query.categoryId = ids.length === 1 ? ids[0] : { $in: ids };
    }

    // --- Event Type Filter ---
    const eventType = searchParams.get('eventType');
    if (eventType) query.eventType = eventType;

    // --- Deal Type Filter ---
    const dealType = searchParams.get('dealType');
    if (dealType) query.dealType = dealType;

    // --- Hot & Featured Flags ---
    const isHot = searchParams.get('isHot');
    if (isHot === 'true') query.isHot = true;

    const isFeatured = searchParams.get('isFeatured');
    if (isFeatured === 'true') query.isFeatured = true;

    // --- Tags Filter (comma-separated, match any) ---
    const tags = searchParams.get('tags');
    if (tags) {
      query.tags = { $in: tags.split(',').map((t) => t.trim()) };
    }

    // --- Target Audience Filter ---
    const audience = searchParams.get('audience');
    if (audience) {
      query.targetAudience = { $in: [audience, 'all'] };
    }

    // --- Discount Percentage Range ---
    const minDiscount = searchParams.get('minDiscount');
    const maxDiscount = searchParams.get('maxDiscount');
    if (minDiscount || maxDiscount) {
      query.discountPercentage = {};
      if (minDiscount) query.discountPercentage.$gte = Number(minDiscount);
      if (maxDiscount) query.discountPercentage.$lte = Number(maxDiscount);
    }

    // --- Price Range ---
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.discountedPrice = {};
      if (minPrice) query.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
    }

    // --- Date Period (validity window) ---
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (from) query.validFrom = { ...query.validFrom, $gte: new Date(from) };
    if (to) query.validUntil = { ...query.validUntil, $lte: new Date(to) };

    // --- Active Now (deals valid at this exact moment) ---
    const activeNow = searchParams.get('activeNow');
    if (activeNow === 'true') {
      const now = new Date();
      query.validFrom = { ...query.validFrom, $lte: now };
      query.validUntil = { ...query.validUntil, $gte: now };
    }

    // --- Text Search ---
    const search = searchParams.get('search');
    if (search) query.$text = { $search: search };

    // --- Geo-spatial Search ---
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '10000';
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius),
        },
      };
    }

    // --- Pagination ---
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
    const skip = (page - 1) * limit;

    // 3. Fetch Deals
    const isGeoSearch = !!(lat && lng);
    const sortParams = search 
      ? { score: { $meta: 'textScore' } } 
      : isGeoSearch 
        ? {} // MongoDB automatically sorts by proximity for $near queries
        : { priorityScore: -1, createdAt: -1 };

    // countDocuments does NOT support $near. We must use a separate count query.
    const countQuery = { ...query };
    if (isGeoSearch) {
      delete countQuery.location;
    }

    const [deals, total] = await Promise.all([
      DealModel.find(query)
        .populate('categoryId', 'name slug')
        .sort(sortParams as any)
        .skip(skip)
        .limit(limit),
      DealModel.countDocuments(countQuery),
    ]);

    // 4. Log Impressions (fire-and-forget)
    if (deals.length > 0) {
      const impressionEvents = deals.map((deal: any) => ({
        type: 'impression',
        dealId: deal._id,
        partnerId: apiKey.partnerId,
        merchantId: deal.merchantId,
      }));
      AnalyticsEvent.insertMany(impressionEvents).catch((err) =>
        console.error('Failed to log impressions:', err)
      );
    }

    const response = NextResponse.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count: deals.length,
      deals,
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}
