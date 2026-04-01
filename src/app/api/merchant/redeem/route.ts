import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Deal from '@/models/Deal';
import { z } from 'zod';

const redeemSchema = z.object({
  transactionId: z.string(),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId } = redeemSchema.parse(body);

    const transaction = await Transaction.findById(transactionId).populate('dealId');
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const deal = transaction.dealId as any;
    
    // Security check: Only the merchant who owns the deal can redeem it
    if (deal.merchantId.toString() !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this deal' }, { status: 403 });
    }

    if (transaction.status === 'completed' && transaction.redeemedAt) {
      return NextResponse.json({ error: 'Transaction already redeemed' }, { status: 400 });
    }

    transaction.status = 'completed';
    transaction.redeemedAt = new Date();
    await transaction.save();

    return NextResponse.json({ 
      message: 'Deal redeemed successfully',
      transaction: {
        id: transaction._id,
        redeemedAt: transaction.redeemedAt,
        dealTitle: deal.title,
      }
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
