import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function sign(payload: object) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}

export async function verify<T>(token: string): Promise<T> {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}
