import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
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
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to verify merchants' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['pending', 'verified', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const profile = await MerchantProfile.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Merchant profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Merchant status updated to ${status} successfully`,
      profile
    });

  } catch (error: any) {
    console.error('Admin Merchant Verify API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
