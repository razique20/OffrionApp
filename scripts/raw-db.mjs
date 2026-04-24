import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Extract URI
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const match = envContent.match(/MONGODB_URI=(.+)/);
const uri = match ? match[1].trim() : '';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('test'); // Or whatever the db name is, MongoClient handles it from URI usually
  
  const users = await client.db().collection('users').find({}).toArray();
  const profiles = await client.db().collection('merchantprofiles').find({}).toArray();
  
  const merged = profiles.map(p => {
    const u = users.find(user => user._id.toString() === p.userId.toString());
    return {
      email: u?.email,
      liab: p.accruedLiability,
      bal: p.balance
    };
  });
  console.log(JSON.stringify(merged, null, 2));

  await client.close();
}
run();
