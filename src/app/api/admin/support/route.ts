import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await SupportTicket.find().populate('userId', 'name email').sort({ updatedAt: -1 });
    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
