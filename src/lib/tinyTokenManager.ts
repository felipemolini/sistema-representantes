import { getRedis } from '@/lib/redis';

const redis = getRedis();
const A = 'tiny:accessToken';
const E = 'tiny:expiresAt';
const R = 'tiny:refreshToken';

type TinyRes = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;       // 4 h
};

export async function getTinyAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const cached = await redis.get<string>(A);
  const exp    = Number(await redis.get<string>(E));
  if (cached && exp - now > 60) return cached;          // ainda válido

  const refresh =
    (await redis.get<string>(R)) || process.env.TINY_REFRESH_TOKEN!;
  if (!refresh) throw new Error('Nenhum refresh_token disponível');

  const res = await fetch(
  'https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token',
  {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.TINY_CLIENT_ID!,
      client_secret: process.env.TINY_CLIENT_SECRET!,
      refresh_token: refresh,
    }),
  }
);

  if (!res.ok) {
    console.error('Tiny token error →', res.status, await res.text());
    throw new Error('Falha ao renovar token Tiny');
  }

  const data: TinyRes = await res.json();

  await redis.set(A, data.access_token, { ex: data.expires_in });
  await redis.set(E, String(now + data.expires_in), { ex: data.expires_in });

  if (data.refresh_token)                       // às vezes vem novo
    await redis.set(R, data.refresh_token, { ex: 23 * 3600 });

  return data.access_token;
}
