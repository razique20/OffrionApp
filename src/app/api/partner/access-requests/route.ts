import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

const requestSchema = z.object({
  countries: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { countries } = requestSchema.parse(body);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add unique countries to pending list that aren't already approved or pending
    const currentApproved = user.accessCountries || [];
    const currentPending = user.pendingAccessCountries || [];
    
    const newRequested = countries.filter(c => 
      !currentApproved.includes(c) && !currentPending.includes(c)
    );

    if (newRequested.length === 0) {
      return NextResponse.json({ 
        message: 'Regions already assigned or requested',
        pending: currentPending 
      });
    }

    user.pendingAccessCountries = [...currentPending, ...newRequested];
    await user.save();

    return NextResponse.json({ 
      message: 'Access request submitted successfully. Wait for admin approval.',
      pending: user.pendingAccessCountries 
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
