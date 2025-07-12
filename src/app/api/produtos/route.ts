import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { produtoSchema } from '@/lib/validators';

export async function POST(req: Request) {
  /* 0) Tentar ler o corpo como JSON */
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Corpo da requisição precisa ser JSON' },
      { status: 400 }
    );
  }

  /* 1) Validar com Zod */
  const parsed = produtoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { nome, codigo, preco } = parsed.data;

  /* 2) Verificar duplicidade */
  const existe = await prisma.produto.findUnique({ where: { codigo } });
  if (existe) {
    return NextResponse.json({ error: 'Produto já existe' }, { status: 409 });
  }

  /* 3) Criar no banco */
  const prod = await prisma.produto.create({
    data: { nome, codigo, preco },
  });

  return NextResponse.json(prod, { status: 201 });
}

/* GET opcional para listar (já existia) */
export async function GET() {
  const all = await prisma.produto.findMany();
  return NextResponse.json(all);
}
