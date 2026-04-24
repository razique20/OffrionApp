import mongoose from 'mongoose';
import dbConnect from '../src/lib/mongodb';
import MerchantProfile from '../src/models/MerchantProfile';
import Commission from '../src/models/Commission';

async function run() {
  await dbConnect();
  const profiles = await MerchantProfile.find({});
  console.log("Profiles:", JSON.stringify(profiles, null, 2));
  
  const comms = await Commission.find({});
  console.log("Commissions:", JSON.stringify(comms, null, 2));

  mongoose.disconnect();
}
run();
