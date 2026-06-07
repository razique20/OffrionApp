import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword } from '@/lib/hash';
import { generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const validatedData = loginSchema.parse(body);
    
    const user = await User.findOne({ email: validatedData.email });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await comparePassword(validatedData.password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      roles: JSON.parse(JSON.stringify(user.roles && user.roles.length > 0 ? user.roles : [user.role])),
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json(JSON.parse(JSON.stringify({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles && user.roles.length > 0 ? user.roles : [user.role],
      }
    })), { status: 200 });

  } catch (error: any) {
    console.error('LOGIN_API_ERROR:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
