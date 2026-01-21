// app/actions/ai.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function consultarMecanicoAI(prevState: any, formData: FormData) {
  const pergunta = formData.get("pergunta") as string;
  const imagemFile = formData.get("imagem") as File | null;
  const apiKey = process.env.GOOGLE_API_KEY;

  // DEBUG: Verificar se a chave está carregando (vai aparecer no terminal do VS Code)
  console.log("Tentando conectar na IA...");
  if (!apiKey) {
    console.error("ERRO CRÍTICO: Chave de API não encontrada no .env.local");
    return { erro: "Erro de configuração: Chave de API não encontrada." };
  } else {
    console.log(`Chave encontrada: ${apiKey.substring(0, 5)}...`);
  }

  if (!pergunta) {
    return { erro: "Por favor, descreva o problema." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // MODELO OFICIAL ESTÁVEL
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Você é um mecânico especialista em carros, com foco em motores THP. 
    O usuário está te mandando uma foto e uma dúvida.
    Analise a imagem com cuidado técnico. Se identificar vazamentos, peças quebradas ou luzes de painel, explique o que é e a gravidade.
    
    Pergunta do usuário: "${pergunta}"`;

    let requestParts: any[] = [prompt];

    if (imagemFile && imagemFile.size > 0) {
      const arrayBuffer = await imagemFile.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: imagemFile.type,
        },
      };
      requestParts.push(imagePart);
    }

    const result = await model.generateContent(requestParts);
    const response = await result.response;
    const text = response.text();

    return { sucesso: text };
  } catch (error: any) {
    console.error("Erro detalhado da IA:", error);

    // Tratamento de erro específico para chave inválida ou modelo errado
    if (error.message?.includes("404")) {
      return {
        erro: "Erro de Conexão: O modelo de IA não foi encontrado. Verifique se sua API Key tem permissão.",
      };
    }

    return { erro: "O serviço de IA está indisponível no momento." };
  }
}
