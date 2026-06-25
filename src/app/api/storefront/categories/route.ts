import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

/**
 * First-party storefront categories (no API key) for the customer-facing
 * /deals filter. Returns active categories only.
 */
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({ isActive: true })
      .select('name slug')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      count: categories.length,
      categories: categories.map((c: any) => ({ id: c._id, name: c.name, slug: c.slug })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
