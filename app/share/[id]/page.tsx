import prisma from "@/lib/prisma";
import { Calendar, CheckCircle, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

// CORREÇÃO: O tipo agora é uma Promise
type Props = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: Props) {
  // CORREÇÃO: Precisamos aguardar o params resolver antes de pegar o ID
  const { id } = await params;

  const carro = await prisma.carro.findUnique({
    where: { id }, // Agora o id existe!
  });

  if (!carro) return notFound();

  const manutencoes = await prisma.manutencao.findMany({
    where: { carroId: carro.id },
    orderBy: { data: "desc" },
  });

  // Filtra itens importantes (Motor THP)
  const itensCriticos = manutencoes.filter(
    (m) =>
      m.descricao.toLowerCase().includes("corrente") ||
      m.descricao.toLowerCase().includes("alta") ||
      m.descricao.toLowerCase().includes("tampa") ||
      m.descricao.toLowerCase().includes("turbo") ||
      m.descricao.toLowerCase().includes("oleo"),
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        {/* CABEÇALHO "PREMIUM" */}
        <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              <ShieldCheck size={14} /> Veículo Certificado
            </div>
            <h1 className="text-4xl font-bold mb-2">{carro.modelo}</h1>
            <p className="text-slate-400">
              Ano {carro.ano} • Histórico de Manutenção Comprovado
            </p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
        </div>

        {/* DESTAQUES (CRÔNICOS RESOLVIDOS) */}
        {itensCriticos.length > 0 && (
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <h2 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-600" /> Manutenções
              Principais Realizadas
            </h2>
            <div className="grid gap-2">
              {itensCriticos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 text-sm text-blue-800"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="font-semibold">{item.descricao}</span>
                  <span className="opacity-60">
                    ({new Date(item.data).toLocaleDateString()})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE DE CUIDADO */}
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">
            Linha do Tempo Completa
          </h2>

          <div className="space-y-6 relative border-l-2 border-slate-200 ml-3 pl-8">
            {manutencoes.map((item) => (
              <div key={item.id} className="relative">
                <span
                  className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                    item.tipo === "PREVENTIVA"
                      ? "bg-green-500"
                      : item.tipo === "CORRETIVA"
                        ? "bg-red-500"
                        : "bg-purple-500"
                  }`}
                ></span>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      {item.descricao}
                    </h3>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.tipo === "PREVENTIVA"
                            ? "bg-green-100 text-green-700"
                            : item.tipo === "CORRETIVA"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar size={14} />{" "}
                      {new Date(item.data).toLocaleDateString()}
                    </div>
                    <div className="font-mono">
                      {item.km.toLocaleString()} km
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="bg-slate-50 p-6 text-center text-slate-400 text-xs border-t border-slate-200">
          Relatório gerado automaticamente via MyGarage App.
          <br />A veracidade das informações é de responsabilidade do
          proprietário.
        </div>
      </div>
    </div>
  );
}
