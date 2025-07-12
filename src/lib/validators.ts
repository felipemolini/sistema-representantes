import { z } from 'zod';

// Expressões simples — você pode suavizar/fortalecer depois
export const cpfCnpjRegex = /^[0-9]{11,14}$/;
export const codigoRegex  = /^[A-Z0-9_-]{2,20}$/;

export const clienteSchema = z.object({
  nome: z.string().min(3),
  cpfCnpj: z.string().regex(cpfCnpjRegex, 'CPF/CNPJ inválido'),
  limiteCredito: z.coerce.number().positive().optional(),
});

export const produtoSchema = z.object({
  nome: z.string().min(2),
  codigo: z.string().regex(codigoRegex, 'Código inválido'),
  preco: z.coerce.number().positive(),
});
