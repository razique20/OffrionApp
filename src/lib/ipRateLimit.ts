
// Simple in-memory IP rate limiter for the prototype.
// For production, replace with Upstash/Redis or a managed service.

const ipCache = new Map<string, { count: number, resetAt: number }>();

/**
 * Checks if an IP has exceeded its rate limit.
 * 
 * @param ip The visitor's IP address
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns { allowed: boolean, remaining: number, reset: number }
 */
export function checkIpRateLimit(ip: string, limit: number = 60, windowMs: number = 60000) {
  const now = Date.now();
  const data = ipCache.get(ip);

  if (!data || now > data.resetAt) {
    const newData = { count: 1, resetAt: now + windowMs };
    ipCache.set(ip, newData);
    return { allowed: true, remaining: limit - 1, reset: newData.resetAt };
  }

  if (data.count >= limit) {
    return { allowed: false, remaining: 0, reset: data.resetAt };
  }

  data.count += 1;
  return { allowed: true, remaining: limit - data.count, reset: data.resetAt };
}

// Cleanup expired entries periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipCache.entries()) {
      if (now > data.resetAt) {
        ipCache.delete(ip);
      }
    }
  }, 300000);
}
