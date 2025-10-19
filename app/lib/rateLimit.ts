// Simple in-memory limiter for MVP; replace with Redis/Upstash in production
const buckets = new Map<string, { count: number; ts: number }>();

export function rateLimit(key: string, max = 20, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.ts > windowMs) {
    buckets.set(key, { count: 1, ts: now });
    return { ok: true };
  }
  if (b.count >= max) return { ok: false };
  b.count += 1;
  return { ok: true };
}
