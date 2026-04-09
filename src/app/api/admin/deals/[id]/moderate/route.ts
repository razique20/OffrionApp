import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';

import { checkAdminPermission } from '@/lib/auth-admin';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce MANAGE_DEALS permission
    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_DEALS');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to moderate deals' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['pending', 'active', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const isActive = status === 'active';

    const deal = await Deal.findByIdAndUpdate(
      id,
      { status, isActive },
      { returnDocument: 'after' }
    );

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Deal status updated to ${status} successfully`,
      deal
    });

  } catch (error: any) {
    console.error('Admin Deal Moderate API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
