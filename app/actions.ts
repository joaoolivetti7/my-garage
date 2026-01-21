"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function adicionarManutencao(formData: FormData) {
  const descricao = formData.get("descricao") as string;
  const km = parseInt(formData.get("km") as string);
  const custo = parseFloat(formData.get("custo") as string);
  const tipo = formData.get("tipo") as string;
  const qtdRaw = formData.get("quantidade") as string;
  const quantidade = qtdRaw ? parseFloat(qtdRaw) : null;

  const carro = await prisma.carro.findFirst();
  if (!carro) return;

  await prisma.manutencao.create({
    data: {
      descricao,
      km,
      custo,
      tipo,
      quantidade,
      carroId: carro.id,
    },
  });

  if (km > carro.kmAtual) {
    await prisma.carro.update({
      where: { id: carro.id },
      data: { kmAtual: km },
    });
  }

  revalidatePath("/");
}

export async function criarCarro(formData: FormData) {
  const modelo = formData.get("modelo") as string;
  const placa = formData.get("placa") as string;
  const ano = parseInt(formData.get("ano") as string);
  const kmAtual = parseInt(formData.get("kmAtual") as string);

  await prisma.carro.create({
    data: {
      modelo,
      placa,
      ano,
      kmAtual,
    },
  });

  revalidatePath("/");
}
