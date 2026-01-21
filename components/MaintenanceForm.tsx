// components/MaintenanceForm.tsx
"use client";

import { adicionarManutencao } from "@/app/actions";
import { PlusCircle, Wrench, AlertTriangle, Sparkles } from "lucide-react";
import { useRef } from "react";

export function MaintenanceForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-700">
        <PlusCircle size={20} className="text-blue-600" /> Nova Manutenção
      </h3>

      <form
        ref={ref}
        action={async (formData) => {
          await adicionarManutencao(formData);
          ref.current?.reset();
        }}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
      >
        {/* Descrição */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            O que foi feito?
          </label>
          <input
            name="descricao"
            required
            placeholder="Ex: Troca de Óleo, Pastilha..."
            className="w-full p-2 border rounded border-slate-300 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Tipo (NOVO) */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Tipo
          </label>
          <div className="relative">
            <select
              name="tipo"
              className="w-full p-2 border rounded border-slate-300 bg-white appearance-none cursor-pointer focus:border-blue-500 outline-none"
            >
              <option value="PREVENTIVA">🟢 Preventiva</option>
              <option value="CORRETIVA">🔴 Corretiva</option>
              <option value="ESTETICA">✨ Estética</option>
            </select>
            {/* Ícone de seta fake para ficar bonito */}
            <div className="absolute right-2 top-3 pointer-events-none text-slate-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* KM */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            KM
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
            placeholder="0,00"
            className="w-full p-2 border rounded border-slate-300 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Botão */}
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded transition-colors flex justify-center items-center h-[42px]"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
