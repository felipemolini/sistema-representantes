import { getTinyAccessToken } from '@/lib/tinyTokenManager';

export async function GET(req: Request) {
  if (req.headers.get('x-cron-secret') !== process.env.VERCEL_CRON_SECRET)
    return new Response('Forbidden', { status: 403 });

  await getTinyAccessToken();
  return new Response(null, { status: 204 });
}
