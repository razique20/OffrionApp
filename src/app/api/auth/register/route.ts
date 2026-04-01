import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import { hashPassword } from '@/lib/hash';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).default(UserRole.PARTNER),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const validatedData = registerSchema.parse(body);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(validatedData.password);
    
    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    return NextResponse.json({ 
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
