import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validatedData = profileSchema.parse(body);
    
    // Check if email already exists
    if (validatedData.email) {
      const existingUser = await User.findOne({ email: validatedData.email, _id: { $ne: userId } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: validatedData },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
