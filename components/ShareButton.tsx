"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton({ carId }: { carId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Cria o link baseado na URL atual
    const url = `${window.location.origin}/share/${carId}`;
    navigator.clipboard.writeText(url);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 hover:border-blue-200"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Link Copiado!" : "Gerar Link de Venda"}
    </button>
  );
}
