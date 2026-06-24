import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { hashPassword } from '@/lib/hash';
import { generateCustomerToken, CUSTOMER_COOKIE } from '@/lib/auth-customer';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  country: z.string().optional().default('United Arab Emirates'),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await Customer.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const customer = await Customer.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: await hashPassword(data.password),
      country: data.country,
    });

    const token = await generateCustomerToken({
      customerId: customer._id.toString(),
      email: customer.email,
    });

    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({
      message: 'Account created',
      customer: { id: customer._id.toString(), name: customer.name, email: customer.email },
    }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
