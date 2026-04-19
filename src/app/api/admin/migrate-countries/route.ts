import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import { checkAdminPermission } from '@/lib/auth-admin';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    // Only Admins can run migration
    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_DEALS');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update all deals where country is missing/null to 'United Arab Emirates'
    const result = await Deal.updateMany(
      { $or: [{ country: { $exists: false } }, { country: null }, { country: '' }] },
      { $set: { country: 'United Arab Emirates' } }
    );

    return NextResponse.json({
      message: 'Migration completed successfully',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
