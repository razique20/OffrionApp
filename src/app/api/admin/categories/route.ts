import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({})
      .sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Admin Categories GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { checkAdminPermission } from '@/lib/auth-admin';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce MANAGE_CATEGORIES
    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_CATEGORIES');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage categories' }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      isActive: true
    });

    return NextResponse.json({
      message: 'Category created successfully',
      category
    });

  } catch (error: any) {
    console.error('Admin Categories POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
