import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import MerchantProfile from '../src/models/MerchantProfile';
import Commission from '../src/models/Commission';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && fs.existsSync(envPath)) {
  const match = fs.readFileSync(envPath, 'utf8').match(/MONGODB_URI=(.+)/);
  if (match) MONGODB_URI = match[1].trim();
}

async function check() {
  await mongoose.connect(MONGODB_URI!);
  const profiles = await MerchantProfile.find();
  console.log('--- MERCHANT PROFILES ---');
  profiles.forEach(p => console.log(`${p.userId}: balance=$${p.balance}, accruedLiability=$${p.accruedLiability}, preference=${p.billingPreference}`));

  const commissions = await Commission.find();
  console.log('\n--- COMMISSIONS ---');
  commissions.forEach(c => console.log(`Commission ID: ${c._id}, status: ${c.status}, amount: ${c.amount}, merchant: ${c.merchantId}`));
  
  process.exit(0);
}
check();
