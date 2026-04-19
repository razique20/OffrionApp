import dbConnect from './src/lib/mongodb';
import Deal from './src/models/Deal';

async function checkDeals() {
  await dbConnect();
  const allDeals = await Deal.find({});
  console.log(`Total deals: ${allDeals.length}`);
  
  const stats = allDeals.reduce((acc: any, deal: any) => {
    const country = deal.country || 'MISSING';
    acc[country] = (acc[country] || 0) + 1;
    acc.active = (acc.active || 0) + (deal.isActive ? 1 : 0);
    acc.inactive = (acc.inactive || 0) + (deal.isActive ? 0 : 1);
    return acc;
  }, {});

  console.log('Deal Stats:', stats);
  process.exit(0);
}

checkDeals();
