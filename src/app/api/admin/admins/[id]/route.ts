import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { UserRole } from '@/lib/constants';

type RouteContext = { params: Promise<{ id: string }> };

// GET single admin
export async function GET(_req: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const admin = await User.findById(id).select('-password');
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json({ user: admin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update admin role, permissions, isActive
export async function PATCH(req: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();
    const { role, permissions, isActive } = body;

    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Validate role is admin or super_admin
    if (role && ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role)) {
      return NextResponse.json({ error: 'Invalid role for admin' }, { status: 400 });
    }

    // Build update object with only provided fields
    const update: Record<string, any> = {};
    if (role !== undefined) update.role = role;
    if (permissions !== undefined) update.permissions = permissions;
    if (isActive !== undefined) update.isActive = isActive;

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    return NextResponse.json({ message: 'Admin updated successfully', user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove admin account
export async function DELETE(_req: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Prevent deleting the last super_admin
    if (admin.role === UserRole.SUPER_ADMIN) {
      const superAdminCount = await User.countDocuments({ role: UserRole.SUPER_ADMIN });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last Super Admin' }, { status: 400 });
      }
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Admin removed permanently' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
