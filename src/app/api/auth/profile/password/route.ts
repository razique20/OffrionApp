import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, hashPassword } from '@/lib/hash';
import { z } from 'zod';

const passwordSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword } = passwordSchema.parse(body);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
