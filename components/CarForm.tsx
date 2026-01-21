// components/CarForm.tsx
"use client";

import { criarCarro } from "@/app/actions";
import { CarFront } from "lucide-react";

export function CarForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-200">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CarFront size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Bem-vindo à Garagem
          </h1>
          <p className="text-slate-500">Cadastre seu veículo para começar.</p>
        </div>

        <form action={criarCarro} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Modelo
            </label>
            <input
              name="modelo"
              required
              placeholder="Ex: C4 Lounge THP"
              className="w-full p-3 border rounded-lg border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">
                Ano
              </label>
              <input
                name="ano"
                type="number"
                required
                placeholder="2015"
                className="w-full p-3 border rounded-lg border-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">
                Placa (Opcional)
              </label>
              <input
                name="placa"
                placeholder="ABC-1234"
                className="w-full p-3 border rounded-lg border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              KM Atual
            </label>
            <input
              name="kmAtual"
              type="number"
              required
              placeholder="Ex: 85000"
              className="w-full p-3 border rounded-lg border-slate-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Salvar Meu Carro
          </button>
        </form>
      </div>
    </div>
  );
}
