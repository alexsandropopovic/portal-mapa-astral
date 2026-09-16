"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download, MoonStar, CheckCircle2 } from "lucide-react";

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
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setDownloadSuccess(false);
    setStatusText("1/4: Calculando posições astronômicas exatas...");

    try {
      setTimeout(() => setStatusText("2/4: Claude 3.5 Haiku redigindo os 8 capítulos..."), 2000);
      setTimeout(() => setStatusText("3/4: PDFShift gerando o livro com a Mandala SVG..."), 7000);
      setTimeout(() => setStatusText("4/4: Preparando o download no seu navegador..."), 12000);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Ocorreu um erro ao gerar o mapa.");
      }

      // Recebe o arquivo PDF e dispara o download automático
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setLastBlobUrl(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Mapa-Astral-${formData.name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setDownloadSuccess(true);
      setStatusText("Mapa Astral gerado e baixado com sucesso!");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro inesperado ao gerar o mapa.");
    } finally {
      setLoading(false);
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

        {downloadSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Download Concluído!</h2>
            <p className="text-xs text-slate-400">
              O seu arquivo PDF foi gerado com sucesso e já deve estar na pasta de downloads do seu computador.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              {lastBlobUrl && (
                <a
                  href={lastBlobUrl}
                  download={`Mapa-Astral-${formData.name.replace(/\s+/g, "_")}.pdf`}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Novamente</span>
                </a>
              )}

              <button
                onClick={() => setDownloadSuccess(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition mt-2"
              >
                Gerar outro mapa astral
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
                  <span>Gerando Livro em PDF...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar e Baixar Mapa Astral</span>
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