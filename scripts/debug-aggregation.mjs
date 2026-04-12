import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Define models
const MerchantProfileSchema = new mongoose.Schema({}, { strict: false, collection: 'merchantprofiles' });
const MerchantProfile = mongoose.models.MerchantProfile || mongoose.model('MerchantProfile', MerchantProfileSchema);
const CommissionSchema = new mongoose.Schema({}, { strict: false, collection: 'commissions' });
const Commission = mongoose.models.Commission || mongoose.model('Commission', CommissionSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const merchantUserId = '69da63463b6f0ccd4731620b';
        
        console.log(`Checking MerchantProfile for userId: ${merchantUserId}`);
        const profile = await MerchantProfile.findOne({ userId: new mongoose.Types.ObjectId(merchantUserId) });
        if (!profile) {
            console.log('MerchantProfile not found for this userId');
        } else {
            console.log('--- MerchantProfile ---');
            console.log(JSON.stringify(profile, null, 2));
        }

        // Test the aggregation logic exactly as in the API
        const pendingCommissions = await Commission.aggregate([
            { 
              $match: { 
                merchantId: new mongoose.Types.ObjectId(merchantUserId), 
                status: 'pending' 
              } 
            },
            { 
              $group: { 
                _id: null, 
                total: { $sum: '$amount' } 
              } 
            }
          ]);
        
        console.log('--- Aggregation Result ---');
        console.log(JSON.stringify(pendingCommissions, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();
