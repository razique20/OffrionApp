import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MerchantProfile from '@/models/MerchantProfile';
import Commission from '@/models/Commission';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function GET() {
  await dbConnect();
  const profiles = await MerchantProfile.find().populate('userId');
  return NextResponse.json({
    profiles: profiles.map(p => ({
      email: (p.userId as any)?.email, balance: p.balance, accruedLiability: p.accruedLiability, pref: p.billingPreference
    }))
  });
}
