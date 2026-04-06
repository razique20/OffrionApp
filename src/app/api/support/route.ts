import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportTicket, { TicketStatus, TicketPriority } from '@/models/SupportTicket';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await SupportTicket.find({ userId: userId }).sort({ updatedAt: -1 });
    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role') as 'merchant' | 'partner';

    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message, priority = TicketPriority.MEDIUM } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const ticket = await SupportTicket.create({
      userId,
      userRole,
      subject,
      message,
      priority,
      status: TicketStatus.OPEN,
      responses: [],
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
