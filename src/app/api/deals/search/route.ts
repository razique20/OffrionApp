import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import SandboxDeal from '@/models/SandboxDeal';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '25.2048'); // Default to Dubai
    const lng = parseFloat(searchParams.get('lng') || '55.2708');
    const radiusInKm = parseFloat(searchParams.get('radius') || '10');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const environment = searchParams.get('environment') || 'production';

    // 1. Determine Model
    const Model = environment === 'sandbox' ? SandboxDeal : (Deal as any);

    // 2. Build Aggregation Pipeline for $geoNear
    const pipeline: any[] = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat]
          },
          distanceField: "distance",
          maxDistance: radiusInKm * 1000,
          query: {
            isActive: true,
            status: 'active',
            ...(categoryId ? { categoryId: new mongoose.Types.ObjectId(categoryId) } : {})
          },
          spherical: true
        }
      },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'merchantId',
          foreignField: '_id',
          as: 'merchant'
        }
      },
      { $unwind: '$merchant' },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          title: 1,
          description: 1,
          originalPrice: 1,
          discountedPrice: 1,
          discountPercentage: 1,
          eventType: 1,
          location: 1,
          distance: 1,
          'merchant.name': 1,
          'category.name': 1,
          validUntil: 1
        }
      }
    ];

    const deals = await Model.aggregate(pipeline);

    // Map to the format expected by the frontend
    const dealsFormatted = deals.map((d: any) => ({
      ...d,
      merchantId: { name: d.merchant.name },
      categoryId: { name: d.category.name }
    }));

    return NextResponse.json(dealsFormatted);

  } catch (error: any) {
    console.error('Geo Search API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
