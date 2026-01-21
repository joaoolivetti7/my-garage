"use client";

import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Carro {
  modelo: string;
}

interface Manutencao {
  data: string | Date;
  descricao: string;
  km: number;
  tipo: string;
}

export function PdfButton({
  carro,
  manutencoes,
}: {
  carro: Carro;
  manutencoes: Manutencao[];
}) {
  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(30, 41, 59); // Slate-900
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(carro.modelo, 14, 20);
    doc.setFontSize(10);
    doc.text(
      `Relatório de Histórico Veicular • Gerado em ${new Date().toLocaleDateString()}`,
      14,
      30,
    );

    const tableData = manutencoes.map((m) => [
      new Date(m.data).toLocaleDateString(),
      m.descricao,
      `${m.km.toLocaleString()} km`,
      m.tipo,
    ]);

    autoTable(doc, {
      head: [["Data", "Serviço Realizado", "KM", "Tipo"]],
      body: tableData,
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] }, // Azul
      styles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [241, 245, 249] }, // Zebra
    });

    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Este documento comprova a procedência das manutenções realizadas.",
      14,
      doc.internal.pageSize.height - 10,
    );

    doc.save(`historico-${carro.modelo.replace(/\s/g, "-")}.pdf`);
  };

  return (
    <button
      onClick={gerarPDF}
      className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-red-200 shadow-sm"
    >
      <FileText size={16} /> Baixar PDF
    </button>
  );
}
