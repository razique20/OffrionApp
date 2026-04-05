import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

import { checkAdminPermission } from '@/lib/auth-admin';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce MANAGE_USERS permission
    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_USERS');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage users' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isActive } = body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User status updated successfully',
      user
    });

  } catch (error: any) {
    console.error('Admin User Verify API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
