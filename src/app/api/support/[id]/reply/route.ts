import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportTicket, { TicketStatus } from '@/models/SupportTicket';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role') as 'merchant' | 'partner';
    const { id } = await params;

    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticket = await SupportTicket.findOne({ _id: id, userId: userId });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (ticket.status === TicketStatus.CLOSED) {
      return NextResponse.json({ error: 'Ticket is closed' }, { status: 400 });
    }

    const response = {
      senderId: userId as any,
      senderRole: userRole,
      message,
      createdAt: new Date(),
    };

    ticket.responses.push(response);
    
    // Re-open if it was resolved but user replied
    if (ticket.status === TicketStatus.RESOLVED) {
      ticket.status = TicketStatus.OPEN;
    }

    await ticket.save();

    return NextResponse.json({ response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
