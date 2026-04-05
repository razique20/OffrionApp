import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import APIKey from '@/models/APIKey';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    // API Key Validation
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }
    const apiKey = await APIKey.findOne({ key: apiKeyHeader, isActive: true });
    if (!apiKey) {
      return NextResponse.json({ error: 'Invalid or inactive API Key' }, { status: 401 });
    }

    // Find the source deal
    const sourceDeal = await Deal.findOne({ _id: id, isActive: true });
    if (!sourceDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') || 10), 20);

    // Find deals in same category, excluding the current one
    const similar = await Deal.find({
      _id: { $ne: new mongoose.Types.ObjectId(id) },
      categoryId: sourceDeal.categoryId,
      isActive: true,
      validUntil: { $gte: new Date() },
    })
      .populate('categoryId', 'name slug')
      .sort({ priorityScore: -1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ count: similar.length, deals: similar });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
