import { NextRequest } from 'next/server';

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 20);

const requestLog = new Map<string, number[]>();

export async function checkRateLimit(req: NextRequest): Promise<{ allowed: boolean }> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return { allowed: false };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return { allowed: true };
}
