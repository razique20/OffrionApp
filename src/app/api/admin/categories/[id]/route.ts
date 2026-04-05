import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

import { checkAdminPermission } from '@/lib/auth-admin';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce MANAGE_CATEGORIES
    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_CATEGORIES');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage categories' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const category = await Category.findByIdAndUpdate(id, { $set: body }, { returnDocument: 'after' });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated successfully', category });

  } catch (error: any) {
    console.error('Admin Category PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Enforce MANAGE_CATEGORIES
    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_CATEGORIES');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage categories' }, { status: 403 });
    }

    const { id } = await params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category permanently removed' });

  } catch (error: any) {
    console.error('Admin Category DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
