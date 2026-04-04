// ========== structure definition ==========
type RateLimitEntry = {
  count: number;
  lastRequest: number;
};

// ========== in-memory storage ==========
const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  // ========== first request ==========
  if (!entry) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return true;
  }

  // ========== window reset ==========
  if (now - entry.lastRequest > windowMs) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return true;
  }

  // ========== threshold check ==========
  if (entry.count >= limit) return false;

  // ========== increment if under limit ==========
  entry.count++;
  return true;
}
