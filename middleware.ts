// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@/lib/jwt';

export const config = {
  matcher: ['/api/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ───────────── 1. Rotas públicas ───────────── */
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  /* ───────────── 2. Extrair e validar JWT ─────── */
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Token faltando' }, { status: 401 });
  }

  let payload: { perfil: string };
  try {
    payload = await verify<{ perfil: string }>(token);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  /* ───────────── 3. Regras de autorização ─────── */

  // 3A. Apenas usuários "master" podem acessar rotas que trocam o refresh-token da Tiny
  if (pathname.startsWith('/api/tiny-token') && payload.perfil !== 'master') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3B. Apenas "master" pode criar ou alterar produtos
  if (
    pathname.startsWith('/api/produtos') &&
    req.method === 'POST' &&
    payload.perfil !== 'master'
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  /* ───────────── 4. Autorizado ─────────────────── */
  return NextResponse.next();
}
