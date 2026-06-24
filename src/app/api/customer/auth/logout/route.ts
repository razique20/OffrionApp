import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CUSTOMER_COOKIE } from '@/lib/auth-customer';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
  return NextResponse.json({ message: 'Logged out' });
}
