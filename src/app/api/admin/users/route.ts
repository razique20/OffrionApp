import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { UserRole } from '@/lib/constants';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let query: any = {};
    if (role) {
      query.role = role;
    } else {
      // Exclude admins from the general user list by default
      query.role = { $ne: UserRole.ADMIN };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-password');

    return NextResponse.json(users);

  } catch (error: any) {
    console.error('Admin Users API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
