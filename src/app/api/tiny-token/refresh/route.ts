import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export async function POST(req: Request) {
  let body;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.refreshToken)
    return NextResponse.json({ error: 'refreshToken required' }, { status: 400 });

  const redis = getRedis();
  await redis.set('tiny:refreshToken', body.refreshToken, { ex: 23 * 3600 });

  return NextResponse.json({ ok: true });
}
