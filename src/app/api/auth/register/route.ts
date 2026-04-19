import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import { hashPassword } from '@/lib/hash';
import { generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole).default(UserRole.PARTNER),
  country: z.string().optional().default('United Arab Emirates'),
  accessCountries: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const validatedData = registerSchema.parse(body);
    
    const { mergeExisting } = body;
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      const userRoles = existingUser.roles || [existingUser.role];
      if (userRoles.includes(validatedData.role)) {
        return NextResponse.json({ error: 'User already exists with this role' }, { status: 400 });
      }

      if (mergeExisting) {
        existingUser.roles = [...new Set([...userRoles, validatedData.role])];
        await existingUser.save();

        // Issue new token with updated roles
        const token = await generateToken({
          userId: existingUser._id.toString(),
          email: existingUser.email,
          role: existingUser.role,
          roles: Array.from(existingUser.roles),
        });

        return NextResponse.json(JSON.parse(JSON.stringify({ 
          message: 'Account updated with new role',
          user: {
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            roles: Array.from(existingUser.roles),
            role: existingUser.role,
          }
        })), { 
          status: 200,
          headers: {
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
          }
        });
      }

      return NextResponse.json({ 
        error: 'Account already exists with a different role', 
        code: 'ROLE_CONFLICT',
        existingRoles: userRoles,
        requestedRole: validatedData.role
      }, { status: 409 });
    }

    const hashedPassword = await hashPassword(validatedData.password);
    
    const user = await User.create({
      ...validatedData,
      roles: [validatedData.role],
      password: hashedPassword,
    });

    return NextResponse.json({ 
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        accessCountries: user.accessCountries,
      }
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
