import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parent: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    // Middleware verifies admin role for /api/admin/categories
    // But since this is /api/categories (public GET), I'll split it or check role here if merged.
    // Let's assume POST to /api/categories is also admin-only or redirected.
    // For now, I'll put admin actions in /api/admin/categories.
    
    // Actually, I'll use /api/categories for GET and /api/admin/categories for POST/PUT/DELETE.
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
