import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Commission from '@/models/Commission';

import { checkAdminPermission } from '@/lib/auth-admin';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce MANAGE_REVENUE permission
    const isAuthorized = await checkAdminPermission(userId, 'VIEW_REVENUE'); // Reusing VIEW_REVENUE for simplicity or add MANAGE_REVENUE
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to moderate funds' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['pending', 'paid', 'failed', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const commission = await Commission.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!commission) {
      return NextResponse.json({ error: 'Commission not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Commission status updated to ${status} successfully`,
      commission
    });

  } catch (error: any) {
    console.error('Admin Commission Moderate API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
