"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download, MoonStar, Eye, CheckCircle2 } from "lucide-react";

interface GeneratedData {
  name: string;
  html: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // 1. Gera o mapa e prepara o HTML
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setGeneratedData(null);
    setStatusText("1/3: Consultando efemérides astronômicas e fuso horário...");

    try {
      setTimeout(() => setStatusText("2/3: Traçando os aspectos da sua mandala natal..."), 2000);
      setTimeout(() => setStatusText("3/3: Redigindo seu raio-x pessoal e os 8 capítulos..."), 5000);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ocorreu um erro ao gerar o mapa.");
      }

      const data = await response.json();
      setGeneratedData({ name: data.name, html: data.html });
      setStatusText("Mapa Astral gerado com sucesso!");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro inesperado ao gerar o mapa.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Abre o mapa direto no navegador (nova aba)
  const handlePreviewHtml = () => {
    if (!generatedData) return;
    const blob = new Blob([generatedData.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // 3. Exporta e baixa o PDF apenas sob demanda
  const handleDownloadPdf = async () => {
    if (!generatedData) return;
    setPdfLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: generatedData.html,
          name: generatedData.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao compilar o PDF.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Guia-Autoconhecimento-${encodeURIComponent(generatedData.name)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao baixar o PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
            <MoonStar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
            Portal Astral Pro
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Geração de livro de mapa natal com mandala vetorial e IA
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/40 text-red-200 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {generatedData ? (
          <div className="text-center py-4 space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mapa Astral Pronto!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Escolha abaixo como você deseja explorar o seu guia personalizado:
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              {/* Botão 1: Ver no Navegador */}
              <button
                onClick={handlePreviewHtml}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Mapa no Navegador (HTML)</span>
              </button>

              {/* Botão 2: Baixar PDF (Só gera quando clicado) */}
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200"
              >
                {pdfLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Compilando PDF no PDFShift...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Baixar Livro Completo em PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setGeneratedData(null)}
                className="text-xs text-slate-500 hover:text-slate-300 transition mt-2"
              >
                ← Gerar outro mapa astral
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gabriel Albuquerque"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Horário Exato
                </label>
                <input
                  type="time"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Cidade e Estado de Nascimento
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Curitiba, PR"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Mapa Astral...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Mapa Astral</span>
                </>
              )}
            </button>
          </form>
        )}

        {loading && (
          <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <p className="text-xs text-indigo-400 font-medium animate-pulse">{statusText}</p>
          </div>
        )}
      </div>
    </main>
  );
}