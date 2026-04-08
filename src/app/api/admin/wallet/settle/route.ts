import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';

/**
 * Administrative endpoint to settle pending commissions.
 * In a real production environment, this would be a scheduled cron job.
 * For the prototype, it can be triggered manually by an admin to simulate time passing.
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { forceAll, ids } = body; 

    let query: any = { status: 'pending' };

    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Settle specific IDs (Manual Override)
      query._id = { $in: ids };
    } else if (!forceAll) {
      // Settle commissions older than 7 days (Standard Protocol)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query.createdAt = { $lte: sevenDaysAgo };
    }

    const result = await Commission.updateMany(
      query,
      { $set: { status: 'cleared' } }
    );

    return NextResponse.json({
      message: `Successfully settled ${result.modifiedCount} commissions.`,
      settledCount: result.modifiedCount,
    });

  } catch (error: any) {
    console.error('Settlement Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
