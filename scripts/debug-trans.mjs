import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

// Define models here to avoid import issues in scratch script
const TransactionSchema = new mongoose.Schema({}, { strict: false, collection: 'transactions' });
const CommissionSchema = new mongoose.Schema({}, { strict: false, collection: 'commissions' });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
const Commission = mongoose.models.Commission || mongoose.model('Commission', CommissionSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const transactionId = '69dab24c77bf9f3e3bd878b6';
        
        console.log(`Checking Transaction: ${transactionId}`);
        const trans = await Transaction.findById(transactionId);
        if (!trans) {
            console.log('Transaction not found');
        } else {
            console.log('--- Transaction ---');
            console.log(JSON.stringify(trans, null, 2));
        }

        const comm = await Commission.findOne({ transactionId: new mongoose.Types.ObjectId(transactionId) });
        if (!comm) {
            console.log('Commission record not found for this transaction');
        } else {
            console.log('--- Commission ---');
            console.log(JSON.stringify(comm, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();
