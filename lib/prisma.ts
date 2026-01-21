// lib/prisma.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // 1. Cria a conexão física com o Postgres
  const connectionString = `${process.env.DATABASE_URL}`;

  const pool = new Pool({
    connectionString,
  });

  // 2. Cria o adaptador do Prisma que usa essa conexão
  const adapter = new PrismaPg(pool);

  // 3. Inicia o Prisma usando o ADAPTER (o jeito novo)
  return new PrismaClient({
    adapter,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// lib/fipe.ts
export async function getPrecoFipe(codigo: string, anoDesejado: number) {
  try {
    const res = await fetch(
      `https://brasilapi.com.br/api/fipe/preco/v1/${codigo}`,
    );

    if (!res.ok) return null;

    const data = await res.json();

    // AQUI ESTÁ A CORREÇÃO:
    // Procura na lista o item que tem o anoModelo igual ao ano do seu carro
    const fipeExata = data.find((item: any) => item.anoModelo === anoDesejado);

    // Se achar, retorna a correta. Se não (difícil), retorna a primeira como fallback.
    return fipeExata || data[0];
  } catch (error) {
    console.error("Erro ao buscar FIPE:", error);
    return null;
  }
}
