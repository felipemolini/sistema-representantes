import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { clienteSchema } from '@/lib/validators';

export async function GET() {
  const all = await prisma.cliente.findMany();
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = clienteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { nome, cpfCnpj, limiteCredito } = parsed.data;

  const existe = await prisma.cliente.findUnique({ where: { cpfCnpj } });
  if (existe)
    return NextResponse.json({ error: 'Cliente já cadastrado' }, { status: 409 });

  const cli = await prisma.cliente.create({
    data: { nome, cpfCnpj, limiteCredito },
  });
  return NextResponse.json(cli, { status: 201 });
}

