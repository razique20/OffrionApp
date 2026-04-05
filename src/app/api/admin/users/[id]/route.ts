import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import MerchantProfile from '@/models/MerchantProfile';
import APIKey from '@/models/APIKey';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log('Retrieving registry for ID:', id);

    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If merchant, fetch additional profile info
    let profile = null;
    if (user.role === 'merchant') {
      profile = await MerchantProfile.findOne({ userId: id }).lean();
    }

    return NextResponse.json({ user, profile });

  } catch (error: any) {
    console.error('Admin User GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Delete associated Profile (if any)
    await MerchantProfile.deleteMany({ userId: id });

    // 2. Delete associated API Keys (if any)
    await APIKey.deleteMany({ partnerId: id });

    // 3. Delete the User record
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'User and associated data permanently removed' });

  } catch (error: any) {
    console.error('Admin User DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
