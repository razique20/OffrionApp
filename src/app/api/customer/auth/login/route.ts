import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { comparePassword } from '@/lib/hash';
import { generateCustomerToken, CUSTOMER_COOKIE } from '@/lib/auth-customer';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const data = loginSchema.parse(body);

    const customer = await Customer.findOne({ email: data.email.toLowerCase() });
    if (!customer || !customer.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (!customer.isActive) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
    }

    const isMatch = await comparePassword(data.password, customer.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

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
      message: 'Login successful',
      customer: { id: customer._id.toString(), name: customer.name, email: customer.email },
    }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
