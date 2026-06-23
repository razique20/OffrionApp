import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LedgerEntry from '@/models/LedgerEntry';
import Commission from '@/models/Commission';
import Payout from '@/models/Payout';
import mongoose from 'mongoose';

/**
 * GET: Downloadable financial report for the current user.
 * Combines ledger entries, commissions, and payouts into one chronological
 * statement. ?format=csv streams a CSV download; default returns JSON.
 * Optional ?from=ISO&to=ISO date range.
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const ownerObjectId = new mongoose.Types.ObjectId(userId);

    const dateFilter: any = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    const hasDate = from || to;

    const idField = role === 'partner' ? 'partnerId' : 'merchantId';

    const [ledger, commissions, payouts] = await Promise.all([
      LedgerEntry.find({ ownerId: ownerObjectId, ...(hasDate ? { createdAt: dateFilter } : {}) }).sort({ createdAt: -1 }),
      Commission.find({ [idField]: ownerObjectId, ...(hasDate ? { createdAt: dateFilter } : {}) }).sort({ createdAt: -1 }),
      Payout.find({ userId: ownerObjectId, ...(hasDate ? { createdAt: dateFilter } : {}) }).sort({ createdAt: -1 }),
    ]);

    // Normalize everything into one statement row shape.
    const rows = [
      ...ledger.map((e: any) => ({
        date: e.createdAt,
        type: e.type,
        description: e.description,
        amount: e.amount,
        status: 'recorded',
        reference: e._id.toString(),
      })),
      ...commissions.map((c: any) => ({
        date: c.createdAt,
        type: 'commission',
        description: role === 'partner' ? 'Commission earned' : 'Commission owed',
        amount: role === 'partner' ? c.partnerShare : -(c.amount),
        status: c.status,
        reference: c._id.toString(),
      })),
      ...payouts.map((p: any) => ({
        date: p.createdAt,
        type: 'payout',
        description: 'Withdrawal to bank',
        amount: -(p.amount),
        status: p.status,
        reference: p._id.toString(),
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (format === 'csv') {
      const header = ['Date', 'Type', 'Description', 'Amount', 'Status', 'Reference'];
      const escape = (v: any) => {
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const lines = [
        header.join(','),
        ...rows.map((r) =>
          [new Date(r.date).toISOString(), r.type, r.description, r.amount.toFixed(2), r.status, r.reference]
            .map(escape)
            .join(',')
        ),
      ];
      const csv = lines.join('\n');
      const filename = `offrion-statement-${new Date().toISOString().split('T')[0]}.csv`;
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({ count: rows.length, rows });
  } catch (error: any) {
    console.error('[Wallet Report Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
