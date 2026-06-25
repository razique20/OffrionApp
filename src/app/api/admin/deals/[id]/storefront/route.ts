import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import { checkAdminPermission } from '@/lib/auth-admin';

/**
 * Admin approve/revoke a deal's visibility on the first-party customer
 * storefront. Deals are private by default; only an admin sets storefrontVisible.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');

    const isAuthorized = await checkAdminPermission(userId, 'MANAGE_DEALS');
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to manage deals' }, { status: 403 });
    }

    const { id } = await params;
    const { visible } = await req.json();
    if (typeof visible !== 'boolean') {
      return NextResponse.json({ error: 'visible (boolean) is required' }, { status: 400 });
    }

    const deal = await Deal.findByIdAndUpdate(
      id,
      { storefrontVisible: visible },
      { returnDocument: 'after' }
    );
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: visible ? 'Deal is now visible on the customer storefront.' : 'Deal removed from the customer storefront.',
      deal,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
