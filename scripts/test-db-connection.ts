import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkConnection() {
  console.log('--- Database Connection Check ---');
  console.log('URI:', MONGODB_URI ? MONGODB_URI.replace(/:([^@]+)@/, ':****@') : 'MISSING');
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Check if we can access a collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Database access verified.');
    console.log('Collections found:', collections.map(c => c.name).join(', ') || 'None (New DB)');
    
    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (error: any) {
    console.error('❌ Connection Failed!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\nTIP: Your username or password in .env.local might be incorrect.');
      console.error('Current URI format: mongodb+srv://<username>:<password>@<cluster>/<dbname>');
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNREFUSED')) {
      console.error('\nTIP: This might be an IP whitelist issue in MongoDB Atlas or a firewall block.');
    }
    
    process.exit(1);
  }
}

checkConnection();
