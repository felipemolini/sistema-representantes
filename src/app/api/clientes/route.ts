import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { nome, cpfCnpj, limiteCredito } = await req.json();
  const cli = await prisma.cliente.create({
    data: { nome, cpfCnpj, limiteCredito },
  });
  return NextResponse.json(cli);
}

export async function GET() {
  const all = await prisma.cliente.findMany();
  return NextResponse.json(all);
}