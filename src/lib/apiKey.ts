import APIKey from '@/models/APIKey';
import dbConnect from './mongodb';

/**
 * Validates an API key and enforces rate limits.
 * Current implementation uses a 1-hour rolling window based on usageCount.
 * 
 * @param key The API key string from headers
 * @returns The API key document if valid, or throws an error
 */
/**
 * Validates an API key and enforces rate limits.
 * 
 * @param key The API key string from headers
 * @param origin The request origin for CORS validation
 * @returns The API key document if valid
 */
export async function validateApiKey(key: string, origin?: string) {
  await dbConnect();

  const apiKey = await APIKey.findOne({ key, isActive: true });
  
  if (!apiKey) {
    throw new Error('Invalid or inactive API Key');
  }

  // 1. CORS Origin Validation
  if (origin && apiKey.allowedOrigins && !apiKey.allowedOrigins.includes('*')) {
    const isAllowed = apiKey.allowedOrigins.some(ao => 
      ao === origin || (ao.startsWith('*') && origin.endsWith(ao.slice(1)))
    );
    if (!isAllowed) {
      throw new Error(`Origin ${origin} is not authorized for this API key`);
    }
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // 2. Rate Limit Validation
  if (!apiKey.lastUsedAt || apiKey.lastUsedAt < oneHourAgo) {
    apiKey.usageCount = 1;
  } else {
    if (apiKey.usageCount >= apiKey.rateLimit) {
      throw new Error(`Rate limit exceeded (${apiKey.rateLimit} requests/hour)`);
    }
    apiKey.usageCount += 1;
  }

  apiKey.lastUsedAt = now;
  await apiKey.save();

  return apiKey;
}
