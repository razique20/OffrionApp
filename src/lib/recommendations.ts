import Deal, { IDeal } from '@/models/Deal';

interface RecommendOptions {
  categoryId?: string;
  lat?: number;
  lng?: number;
  limit?: number;
}

/**
 * Basic AI-style recommendation engine.
 * Ranks deals based on:
 * 1. Category preference (if match)
 * 2. Priority Score (Merchant boosting)
 * 3. Proximity (if coordinates provided)
 * 4. Recency (Newer first)
 */
export async function getRecommendedDeals(options: RecommendOptions = {}) {
  const { categoryId, lat, lng, limit = 10 } = options;

  let query: any = { isActive: true };
  if (categoryId) {
    query.categoryId = categoryId;
  }

  // If geo provided, use $near to find closest deals
  if (lat !== undefined && lng !== undefined) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: 50000, // 50km
      },
    };
  }

  const deals = await Deal.find(query)
    .sort({ priorityScore: -1, createdAt: -1 })
    .limit(limit);

  return deals;
}
