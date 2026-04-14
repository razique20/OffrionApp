import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check database connectivity
    await dbConnect();
    
    return NextResponse.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0',
      environment: process.env.NODE_ENV
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Health Check Failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      message: error.message || 'Database connection failed'
    }, { status: 503 });
  }
}
