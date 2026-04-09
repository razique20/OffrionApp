import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
const MONGODB_URI = mongoMatch ? mongoMatch[1].trim() : null;

if (!MONGODB_URI) {
  process.exit(1);
}

process.env.MONGODB_URI = MONGODB_URI;

import dbConnect from '../src/lib/mongodb';
import Commission from '../src/models/Commission';
import Payout from '../src/models/Payout';
import User from '../src/models/User';

async function diagnose() {
  await dbConnect();
  
  const partnerEmail = 'partner@example.com'; // Common seed email
  const user = await User.findOne({ email: partnerEmail });
  if (!user) {
    console.log('User not found');
    process.exit(0);
  }
  
  console.log(`Diagnosing for User: ${user.name} (${user._id})`);
  
  const commissions = await Commission.find({ partnerId: user._id });
  const payouts = await Payout.find({ userId: user._id });
  
  console.log('\n--- COMMISSIONS ---');
  let totalCommissions = 0;
  commissions.forEach(c => {
    console.log(`- ID: ${c._id}, Share: ${c.partnerShare}, Status: ${c.status}, CreatedAt: ${c.createdAt}`);
    totalCommissions += c.partnerShare;
  });
  console.log(`Total Commission Sum: ${totalCommissions}`);
  
  console.log('\n--- PAYOUTS ---');
  let totalPayouts = 0;
  payouts.forEach(p => {
    console.log(`- ID: ${p._id}, Amount: ${p.amount}, Status: ${p.status}, CreatedAt: ${p.createdAt}`);
    if (p.status === 'paid') totalPayouts += p.amount;
  });
  console.log(`Total Paid Payouts Sum: ${totalPayouts}`);
  
  const diff = totalCommissions - totalPayouts;
  console.log(`\nDiscrepancy: ${diff}`);
  
  process.exit(0);
}

diagnose();
