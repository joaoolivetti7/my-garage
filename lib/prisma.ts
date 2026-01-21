// lib/prisma.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`;

  const pool = new Pool({
    connectionString,
  });

  const adapter = new PrismaPg(pool);

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

export async function getPrecoFipe(codigo: string, anoDesejado: number) {
  try {
    const res = await fetch(
      `https://brasilapi.com.br/api/fipe/preco/v1/${codigo}`,
    );

    if (!res.ok) return null;

    const data = await res.json();

    const fipeExata = data.find((item: any) => item.anoModelo === anoDesejado);

    return fipeExata || data[0];
  } catch (error) {
    console.error("Erro ao buscar FIPE:", error);
    return null;
  }
}
