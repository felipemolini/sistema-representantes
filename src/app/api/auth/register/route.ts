import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';

export async function POST(req: Request) {
  const { email, senha, perfil = 'vendedor' } = await req.json();

  if (!email || !senha)
    return NextResponse.json({ error: 'email e senha obrigatórios' }, { status: 400 });

  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe)
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 });

  const hash = await hashPassword(senha);
  await prisma.user.create({ data: { email, hash, perfil } });

  return NextResponse.json({ ok: true });
}
