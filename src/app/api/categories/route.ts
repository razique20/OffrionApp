import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import APIKey from '@/models/APIKey';

export async function GET(req: Request) {
  try {
    await dbConnect();

    // API Key Validation
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }
    const validKey = await APIKey.findOne({ key: apiKeyHeader, isActive: true });
    if (!validKey) {
      return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
    }

    const categories = await Category.find({})
      .select('name slug description isActive')
      .sort({ name: 1 });

    return NextResponse.json({ count: categories.length, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
