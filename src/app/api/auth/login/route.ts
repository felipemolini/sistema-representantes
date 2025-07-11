import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkPassword } from '@/lib/password';
import { sign } from '@/lib/jwt';

export async function POST(req: Request) {
  const { email, senha } = await req.json();
  if (!email || !senha)
    return NextResponse.json({ error: 'Credenciais faltando' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await checkPassword(senha, user.hash)))
    return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 });

  const token = await sign({ sub: user.id, perfil: user.perfil });
  return NextResponse.json({ token });
}
