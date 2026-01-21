import prisma, { getPrecoFipe } from "@/lib/prisma";
import { Wrench, Calendar, DollarSign, Activity, Droplets } from "lucide-react";
import { MaintenanceForm } from "@/components/MaintenanceForm";
import { CarForm } from "@/components/CarForm"; // <--- Importe o novo form
import { FipeCard } from "@/components/FipeCard";
import { PdfButton } from "@/components/PdfButton";
import { ShareButton } from "@/components/ShareButton";

async function getDados() {
  const carro = await prisma.carro.findFirst(); // Tenta achar o carro

  if (!carro) return { carro: null, manutencoes: [] }; // Retorna nulo se não tiver

  const manutencoes = await prisma.manutencao.findMany({
    where: { carroId: carro.id },
    orderBy: { km: "desc" },
  });

  return { carro, manutencoes };
}

export default async function Home() {
  const { carro, manutencoes } = await getDados();

  // 1. LÓGICA: Se não tem carro, mostra a tela de cadastro
  if (!carro) {
    return <CarForm />;
  }

  const totalGasto = manutencoes.reduce((acc, item) => acc + item.custo, 0);

  let dadosFipe = null;
  if (carro.fipeCodigo) {
    // Passamos o ano do carro (ex: 2015) para filtrar certo
    dadosFipe = await getPrecoFipe(carro.fipeCodigo, carro.ano);
  }

  // 2. LÓGICA: Cálculo da Próxima Troca (Regra dos 7.000km)
  const ultimaTrocaOleo = manutencoes.find(
    (m) =>
      m.descricao.toLowerCase().includes("oleo") ||
      m.descricao.toLowerCase().includes("óleo"),
  );

  let avisoTroca = null;

  if (ultimaTrocaOleo) {
    const intervaloTroca = 7000; // THP gosta de óleo novo
    const kmProximaTroca = ultimaTrocaOleo.km + intervaloTroca;
    const kmRestante = kmProximaTroca - carro.kmAtual;
    const percentualUso = 100 - (kmRestante / intervaloTroca) * 100;

    // Define a cor e mensagem do aviso
    let corBarra = "bg-green-500";
    let textoAviso = `Faltam ${kmRestante.toLocaleString()} km`;

    if (kmRestante <= 1000 && kmRestante > 0) {
      corBarra = "bg-yellow-500";
      textoAviso = "Planeje a troca em breve";
    } else if (kmRestante <= 0) {
      corBarra = "bg-red-500";
      textoAviso = `PASSOU ${Math.abs(kmRestante)} KM! TROQUE AGORA!`;
    }

    avisoTroca = {
      kmProximaTroca,
      kmRestante,
      percentualUso,
      corBarra,
      textoAviso,
    };
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* HEADER DO CARRO */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {carro.modelo}
            </h1>
            <p className="text-slate-500">
              Placa: {carro.placa || "---"} • Ano {carro.ano}
            </p>
            <div className="flex gap-2 mt-4">
              <ShareButton carId={carro.id} />
              {/* BOTÃO PDF NOVO */}
              <PdfButton carro={carro} manutencoes={manutencoes} />
            </div>
          </div>
          <div className="text-right w-full md:w-auto">
            <div className="text-4xl font-mono font-bold text-blue-600">
              {carro.kmAtual.toLocaleString()} km
            </div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Hodômetro Atual
            </p>
          </div>
        </div>

        {/* --- NOVO: CARD DE TROCA DE ÓLEO --- */}
        {avisoTroca ? (
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg mb-8 border-l-4 border-blue-500 relative overflow-hidden">
            <div className="flex justify-between items-end relative z-10">
              <div>
                <div className="flex items-center gap-2 text-blue-300 font-bold uppercase text-xs mb-1">
                  <Droplets size={16} /> Próxima Troca de Óleo
                </div>
                <div className="text-3xl font-bold">
                  {avisoTroca.kmProximaTroca.toLocaleString()} km
                </div>
                <div className="text-slate-400 text-sm mt-1">
                  {avisoTroca.textoAviso}
                </div>
              </div>

              {/* Barra circular ou visual simples */}
              <div className="text-right">
                <div className="text-4xl font-bold opacity-20">
                  {Math.floor(avisoTroca.percentualUso)}%
                </div>
              </div>
            </div>

            {/* Barra de progresso fundo */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
              <div
                className={`h-full ${avisoTroca.corBarra} transition-all duration-1000`}
                style={{ width: `${Math.min(avisoTroca.percentualUso, 100)}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded text-yellow-800 text-sm">
            ⚠ Cadastre a primeira troca de óleo para ativar o monitoramento
            inteligente.
          </div>
        )}

        {/* DASHBOARD STATUS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <CardStat
            icon={<DollarSign className="text-green-500" />}
            label="Investido"
            value={`R$ ${totalGasto.toLocaleString()}`}
          />
          <CardStat
            icon={<Wrench className="text-orange-500" />}
            label="Serviços"
            value={manutencoes.length.toString()}
          />
          <CardStat
            icon={<Activity className="text-blue-500" />}
            label="Motor"
            value="THP 1.6"
          />
        </div>

        {/* FIPE CARD (Novo - Ocupa 1 espaço ou destaque) */}
        {dadosFipe && (
          <div className="lg:col-span-1">
            <FipeCard fipeData={dadosFipe} totalGasto={totalGasto} />
          </div>
        )}

        {/* FORMULÁRIO */}
        <MaintenanceForm />

        {/* LISTA HISTÓRICO */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar size={20} /> Histórico de Oficina
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {manutencoes.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Nenhum registro ainda.
            </div>
          ) : (
            manutencoes.map((item) => (
              <div
                key={item.id}
                className="p-4 border-b border-slate-100 flex justify-between items-center hover:bg-slate-50"
              >
                <div>
                  {/* Título da Manutenção */}
                  <div className="font-bold text-lg text-slate-800">
                    {item.descricao}
                  </div>

                  {/* Linha de baixo: Data • KM • Etiqueta Colorida */}
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{new Date(item.data).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{item.km.toLocaleString()} km</span>

                    {/* AQUI ENTRA A ETIQUETA COLORIDA NOVA */}
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border text-[10px] ${
                        item.tipo === "CORRETIVA"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : item.tipo === "ESTETICA"
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-green-50 text-green-600 border-green-200"
                      }`}
                    >
                      {item.tipo}
                    </span>
                  </div>
                </div>

                {/* Valor à direita */}
                <div className="font-bold text-slate-700">
                  R${" "}
                  {item.custo.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CardStat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-2">{icon}</div>
      <div className="text-xl md:text-2xl font-bold truncate">{value}</div>
      <div className="text-xs text-slate-400 uppercase font-bold">{label}</div>
    </div>
  );
}
