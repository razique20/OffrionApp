import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure roles array is always present for the frontend
    const roles = user.roles && user.roles.length > 0 ? user.roles : [user.role];

    return NextResponse.json(JSON.parse(JSON.stringify({
      ...user.toObject(),
      roles
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
