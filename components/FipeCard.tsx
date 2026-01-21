"use client";

import { DollarSign } from "lucide-react";

export function FipeCard({
  fipeData,
  totalGasto,
}: {
  fipeData: any;
  totalGasto: number;
}) {
  if (!fipeData) return null;

  const valorFipe = parseFloat(
    fipeData.valor.replace("R$ ", "").replace(".", "").replace(",", "."),
  );
  const porcentagemGasta = (totalGasto / valorFipe) * 100;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700 mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Valor de Mercado (FIPE)
          </h3>
          <div className="text-2xl font-bold text-green-400">
            {fipeData.valor}
          </div>
          <p className="text-xs text-slate-500">
            {fipeData.modelo} ({fipeData.anoModelo})
          </p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg">
          <DollarSign className="text-green-400" size={20} />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-300">Investido em Manutenção</span>
          <span className="font-bold">
            R${" "}
            {totalGasto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Barra de Progresso do Custo/Benefício */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full ${porcentagemGasta > 50 ? "bg-red-500" : "bg-blue-500"}`}
            style={{ width: `${Math.min(porcentagemGasta, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-right text-slate-500">
          Você já recomprou <strong>{porcentagemGasta.toFixed(1)}%</strong> do
          carro em peças.
        </p>
      </div>
    </div>
  );
}
