import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import mongoose from 'mongoose';

/**
 * First-party storefront deal browse. Unlike /api/deals, this is NOT gated by a
 * partner API key — it serves our own customer-facing /deals pages. Only live,
 * active, approved deals are returned.
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(Number(searchParams.get('limit') || 24), 60);
    const skip = (page - 1) * limit;

    const query: any = {
      isActive: true,
      status: 'active',
      storefrontVisible: true, // admin-approved for the public customer storefront
      validUntil: { $gte: new Date() },
    };

    const categoryId = searchParams.get('categoryId');
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    const search = searchParams.get('search');
    if (search && search.trim()) {
      const rx = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: rx }, { description: rx }, { tags: rx }];
    }

    const [deals, total] = await Promise.all([
      Deal.find(query)
        .sort({ priorityScore: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('merchantId', 'name')
        .populate('categoryId', 'name')
        .lean(),
      Deal.countDocuments(query),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      count: deals.length,
      deals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
