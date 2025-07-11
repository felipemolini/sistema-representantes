import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/** Assina e devolve um JWT válido por 1 h */
export async function sign(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}

export async function verify<T extends JWTPayload>(token: string): Promise<T> {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}
