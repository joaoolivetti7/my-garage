"use client";

import { consultarMecanicoAI } from "@/app/actions/ai";
import { Bot, ImagePlus, Send, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
// Usamos useFormState para lidar com o retorno da Server Action
import { useFormState, useFormStatus } from "react-dom";

// Botão de enviar que desabilita enquanto carrega
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-bold"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" /> Analisando...
        </>
      ) : (
        <>
          <Send size={18} /> Enviar para Análise
        </>
      )}
    </button>
  );
}

export function AIConsultant() {
  const [state, formAction] = useFormState(consultarMecanicoAI, null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Função para mostrar o preview da imagem antes de enviar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6 rounded-2xl shadow-xl mb-8 border border-blue-800/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500/20 p-2 rounded-full">
          <Bot size={32} className="text-blue-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Consultor THP (IA)</h2>
          <p className="text-blue-200 text-sm">
            Envie uma foto do problema e receba um diagnóstico.
          </p>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <textarea
          name="pergunta"
          required
          placeholder="Ex: Esse barulho na correia é normal? O que é essa mancha de óleo aqui?"
          className="w-full p-4 rounded-lg bg-slate-800/50 border border-slate-700 focus:border-blue-500 outline-none text-white placeholder:text-slate-500 min-h-[100px]"
        />

        {/* Área de Upload com Preview */}
        <div className="flex gap-4 items-start">
          <label className="flex-1 cursor-pointer bg-slate-800/50 hover:bg-slate-800 border border-slate-700 border-dashed rounded-lg p-4 text-center transition-colors flex flex-col items-center gap-2 text-slate-400">
            <ImagePlus size={24} />
            <span className="text-sm font-bold">Adicionar Foto (Opcional)</span>
            <input
              type="file"
              name="imagem"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {/* Preview da imagem se existir */}
          {imagePreview && (
            <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-blue-500/50 shadow-sm shrink-0">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <SubmitButton />
      </form>

      {/* Área de Resposta */}
      {state?.sucesso && (
        <div className="mt-6 bg-blue-950/50 p-4 rounded-xl border border-blue-500/30 animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
            <Bot size={16} /> Diagnóstico da IA:
          </h3>
          {/* Usamos whitespace-pre-wrap para respeitar os parágrafos que a IA gera */}
          <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm">
            {state.sucesso}
          </div>
        </div>
      )}

      {state?.erro && (
        <div className="mt-4 bg-red-950/50 p-3 text-red-300 rounded-lg border border-red-900/50 flex items-center gap-2 text-sm font-bold">
          <AlertTriangle size={16} /> {state.erro}
        </div>
      )}
    </div>
  );
}
