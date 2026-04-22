import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import { z } from 'zod';

const dealSchema = z.object({
  categoryId: z.string().optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  images: z.array(z.string()).optional(),
  originalPrice: z.number().positive().optional(),
  discountedPrice: z.number().positive().optional(),
  commissionPercentage: z.number().min(10, "Minimum commission is 10%").max(100).optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }).optional(),
  eventType: z.enum(['general', 'holiday', 'flash', 'seasonal', 'clearance']).optional(),
  dealType: z.enum(['percentage', 'flat', 'bogo', 'free-item']).optional(),
  targetAudience: z.array(z.enum(['student', 'senior', 'member', 'all'])).optional(),
  validFrom: z.string().transform((str) => new Date(str)).optional(),
  validUntil: z.string().transform((str) => new Date(str)).optional(),
  usageLimit: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  emirate: z.string().optional(),
  landmark: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deal = await Deal.findOne({ _id: id, merchantId: userId });
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const { id } = await params;
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validatedData = dealSchema.parse(body);

    const deal = await Deal.findOneAndUpdate(
      { _id: id, merchantId: userId },
      { ...validatedData },
      { new: true }
    );

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deal updated successfully', deal });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deal = await Deal.findOneAndDelete({ _id: id, merchantId: userId });
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
