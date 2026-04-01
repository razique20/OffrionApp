import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { z } from 'zod';
import mongoose from 'mongoose';

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parent: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    const categoryData: any = {
      ...validatedData,
      parent: validatedData.parent ? new mongoose.Types.ObjectId(validatedData.parent) : undefined,
    };

    const category = await Category.create(categoryData);
    return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
