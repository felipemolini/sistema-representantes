import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@/lib/jwt';

export const config = { matcher: ['/api/:path*'] };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // liberar rotas públicas
  if (pathname.startsWith('/api/auth')) return NextResponse.next();

  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Token faltando' }, { status: 401 });

  try {
    const payload = await verify<{ perfil: string }>(token);

    // exemplo: rota só-master
    if (pathname.startsWith('/api/tiny-token') && payload.perfil !== 'master')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
