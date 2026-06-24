import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getCustomerFromRequest } from '@/lib/auth-customer';

export async function GET(req: Request) {
  const payload = await getCustomerFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const customer = await Customer.findById(payload.customerId).select('name email country');
  if (!customer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    customer: {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      country: customer.country,
    },
  });
}
