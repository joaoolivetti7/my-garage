// app/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function adicionarManutencao(formData: FormData) {
  // 1. Pegar os dados do formulário HTML
  const descricao = formData.get("descricao") as string;
  const km = parseInt(formData.get("km") as string);
  const custo = parseFloat(formData.get("custo") as string);
  const tipo = formData.get("tipo") as string;

  // Hack: Pegar o primeiro carro do banco (já que é um sistema pessoal)
  const carro = await prisma.carro.findFirst();
  if (!carro) return;

  // 2. Salvar no Banco
  await prisma.manutencao.create({
    data: {
      descricao,
      km,
      custo,
      tipo,
      carroId: carro.id,
    },
  });

  // 3. Atualizar a KM do carro se essa manutenção tiver KM maior que a atual
  if (km > carro.kmAtual) {
    await prisma.carro.update({
      where: { id: carro.id },
      data: { kmAtual: km },
    });
  }

  // 4. Avisar a tela para recarregar os dados
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
