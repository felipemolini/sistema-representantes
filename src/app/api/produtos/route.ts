import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const all = await prisma.produto.findMany();
  return NextResponse.json(all);
}
