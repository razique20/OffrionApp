import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SandboxDeal from '@/models/SandboxDeal';

// Public route - no auth required. Returns sandbox dummy deals for public playground.
export async function GET() {
  try {
    await dbConnect();
    const deals = await SandboxDeal.find({ isActive: true })
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(50);

    const response = NextResponse.json({
      environment: 'sandbox',
      count: deals.length,
      deals,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
