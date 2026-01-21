// components/MaintenanceForm.tsx
"use client";

import { adicionarManutencao } from "@/app/actions";
import { PlusCircle, Droplets, Wrench, AlertTriangle } from "lucide-react";
import { useRef, useState } from "react";

export function MaintenanceForm() {
  const ref = useRef<HTMLFormElement>(null);

  // Tipos possíveis: 'TROCA_OLEO', 'COMPLETAR_OLEO', 'PREVENTIVA', 'CORRETIVA'
  const [tipoAcao, setTipoAcao] = useState("PREVENTIVA");

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800">
        <PlusCircle size={20} className="text-blue-600" /> Registrar Serviço
      </h3>

      {/* 1. SELETOR DE AÇÃO (Botões grandes pra não ter erro) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setTipoAcao("TROCA_OLEO")}
          className={`p-3 rounded-lg border flex flex-col items-center gap-2 text-xs font-bold transition-all ${tipoAcao === "TROCA_OLEO" ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500" : "bg-white border-slate-200 hover:bg-slate-50"}`}
        >
          <Droplets size={20} /> TROCA DE ÓLEO
        </button>
        <button
          onClick={() => setTipoAcao("COMPLETAR_OLEO")}
          className={`p-3 rounded-lg border flex flex-col items-center gap-2 text-xs font-bold transition-all ${tipoAcao === "COMPLETAR_OLEO" ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500" : "bg-white border-slate-200 hover:bg-slate-50"}`}
        >
          <span className="text-xl">🛢️</span> COMPLETAR
        </button>
        <button
          onClick={() => setTipoAcao("PREVENTIVA")}
          className={`p-3 rounded-lg border flex flex-col items-center gap-2 text-xs font-bold transition-all ${tipoAcao === "PREVENTIVA" ? "bg-slate-100 border-slate-400 text-slate-700 ring-1 ring-slate-400" : "bg-white border-slate-200 hover:bg-slate-50"}`}
        >
          <Wrench size={20} /> PREVENTIVA
        </button>
        <button
          onClick={() => setTipoAcao("CORRETIVA")}
          className={`p-3 rounded-lg border flex flex-col items-center gap-2 text-xs font-bold transition-all ${tipoAcao === "CORRETIVA" ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500" : "bg-white border-slate-200 hover:bg-slate-50"}`}
        >
          <AlertTriangle size={20} /> CORRETIVA
        </button>
      </div>

      <form
        ref={ref}
        action={async (formData) => {
          await adicionarManutencao(formData);
          ref.current?.reset();
          setTipoAcao("PREVENTIVA"); // Volta ao padrão
        }}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
      >
        {/* Input Oculto para enviar o TIPO correto pro servidor */}
        <input type="hidden" name="tipo" value={tipoAcao} />

        {/* Descrição */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Descrição
          </label>
          <input
            name="descricao"
            required
            placeholder={
              tipoAcao === "TROCA_OLEO"
                ? "Óleo 5w30 + Filtro"
                : tipoAcao === "COMPLETAR_OLEO"
                  ? "Completei nível"
                  : "Ex: Troca de Pastilhas"
            }
            className="w-full p-2 border rounded border-slate-300 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* CAMPO DE LITROS (Só aparece se for Completar) */}
        {tipoAcao === "COMPLETAR_OLEO" && (
          <div className="md:col-span-2 animate-in zoom-in duration-200">
            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">
              Qtd (Litros)
            </label>
            <input
              name="quantidade"
              type="number"
              step="0.1"
              required
              placeholder="0.5"
              className="w-full p-2 border-2 border-blue-100 rounded bg-blue-50 focus:border-blue-500 outline-none"
            />
          </div>
        )}

        {/* KM */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            KM Atual
          </label>
          <input
            name="km"
            type="number"
            required
            placeholder="Ex: 85000"
            className="w-full p-2 border rounded border-slate-300 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Valor */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Valor (R$)
          </label>
          <input
            name="custo"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            className="w-full p-2 border rounded border-slate-300 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Botão Salvar */}
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-bold p-2 rounded transition-colors flex justify-center items-center h-[42px]"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
