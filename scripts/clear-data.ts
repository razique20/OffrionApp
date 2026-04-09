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
import Transaction from '../src/models/Transaction';
import AnalyticsEvent from '../src/models/AnalyticsEvent';

async function clearData() {
  await dbConnect();
  
  console.log('Clearing Commission data...');
  await Commission.deleteMany({});
  
  console.log('Clearing Payout data...');
  await Payout.deleteMany({});
  
  console.log('Clearing Transaction data...');
  await Transaction.deleteMany({});
  
  console.log('Clearing AnalyticsEvent data...');
  await AnalyticsEvent.deleteMany({ type: { $in: ['conversion', 'click', 'commission'] } });
  
  console.log('Data cleared successfully.');
  process.exit(0);
}

clearData();
