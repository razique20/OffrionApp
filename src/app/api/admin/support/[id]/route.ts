import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportTicket, { TicketStatus } from '@/models/SupportTicket';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    const { id } = await params;

    if (userRole !== 'admin' && userRole !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, status = TicketStatus.IN_PROGRESS } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Add response
    ticket.responses.push({
      senderId: userId as any,
      senderRole: 'admin',
      message,
      createdAt: new Date(),
    });

    // Update status
    ticket.status = status;

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(id).populate('userId', 'name email');

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
