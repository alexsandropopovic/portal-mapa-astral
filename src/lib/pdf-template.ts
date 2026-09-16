import { ChartCalculations } from "./astronomy";
import { generateChartWheelSvg } from "./chart-wheel";

interface TemplateProps {
  name: string;
  birthDate: string;
  birthTime: string;
  city: string;
  chart: ChartCalculations;
  analysisText: string;
}

export function generatePdfHtml({ name, birthDate, birthTime, city, chart, analysisText }: TemplateProps): string {
  const mandalaSvg = generateChartWheelSvg(chart);

  // Parser inteligente para formatar a estrutura do novo prompt
  const formattedAnalysis = analysisText
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Linhas divisórias (---)
      if (trimmed === "---" || trimmed === "***") {
        return `<hr class="my-6 border-indigo-200/50" />`;
      }

      // Título de Capítulo Principal (## ) -> Força nova página
      if (trimmed.startsWith("## ")) {
        const title = trimmed.replace("## ", "").trim();
        return `
          <div class="page-break-before pt-2 mb-6">
            <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 inline-block mb-2">
              Jornada Pessoal
            </span>
            <h2 class="text-xl font-serif font-bold text-indigo-950 border-b-2 border-indigo-200 pb-2">${title}</h2>
          </div>
        `;
      }

      // Seção Inicial: O Raio-X Rápido (### ) -> Abre uma página dedicada de leitura rápida
      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "").trim();
        return `
          <div class="page-break-before pt-2 mb-6 p-5 bg-gradient-to-br from-indigo-50/90 to-purple-50/60 rounded-xl border border-indigo-200/70 shadow-sm">
            <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-600 block mb-1">
              Visão Geral • Leitura Rápida
            </span>
            <h3 class="text-lg font-serif font-bold text-indigo-950">${title}</h3>
            <p class="text-xs text-indigo-800/80 mt-1">Um panorama essencial da sua jornada para consulta imediata.</p>
          </div>
        `;
      }

      // Verifica se o bloco contém os tópicos de destaque (mesmo que venham em linhas separadas por \n)
      const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
      const containsCallout = lines.some((l) =>
        l.includes("O Seu Maior Talento") ||
        l.includes("Maior Talento") ||
        l.includes("O Ponto de Atenção") ||
        l.includes("Ponto de Atenção") ||
        l.includes("Ação Prática")
      );

      if (containsCallout) {
        return lines
          .map((line) => {
            // 🌟 Caixa Dourada: O Seu Maior Talento
            if (line.includes("O Seu Maior Talento") || line.includes("Maior Talento")) {
              const content = line
                .replace(/.*(?:O Seu Maior Talento|Maior Talento):\*{0,2}\s*/i, "")
                .trim();
              return `
                <div class="my-3 p-3.5 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-lg shadow-sm">
                  <span class="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">🌟 O Seu Maior Talento</span>
                  <p class="text-gray-800 text-xs leading-relaxed text-justify">${content}</p>
                </div>
              `;
            }

            // 🌑 Caixa Vinho/Rose: O Ponto de Atenção
            if (line.includes("O Ponto de Atenção") || line.includes("Ponto de Atenção")) {
              const content = line
                .replace(/.*(?:O Ponto de Atenção|Ponto de Atenção):\*{0,2}\s*/i, "")
                .trim();
              return `
                <div class="my-3 p-3.5 bg-rose-50/90 border-l-4 border-rose-500 rounded-r-lg shadow-sm">
                  <span class="text-[11px] font-bold text-rose-900 uppercase tracking-wider block mb-1">🌑 O Ponto de Atenção</span>
                  <p class="text-gray-800 text-xs leading-relaxed text-justify">${content}</p>
                </div>
              `;
            }

            // 🧭 Caixa Índigo: Ação Prática
            if (line.includes("Ação Prática")) {
              const content = line
                .replace(/.*(?:Ação Prática):\*{0,2}\s*/i, "")
                .trim();
              return `
                <div class="my-3 p-3.5 bg-indigo-50/90 border-l-4 border-indigo-600 rounded-r-lg shadow-sm">
                  <span class="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">🧭 Ação Prática</span>
                  <p class="text-gray-800 text-xs leading-relaxed text-justify">${content}</p>
                </div>
              `;
            }

            // Linha regular dentro do bloco
            return `<p class="text-gray-700 leading-relaxed mb-3 text-justify text-sm">${line}</p>`;
          })
          .join("");
      }

      // Parágrafo Regular de Texto
      return `<p class="text-gray-700 leading-relaxed mb-4 text-justify text-sm">${trimmed}</p>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Guia Pessoal de Autoconhecimento - ${name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @page {
        size: A4;
        margin: 20mm 15mm 20mm 15mm;
      }
      .page-break-before {
        page-break-before: always;
      }
    </style>
  </head>
  <body class="bg-white text-gray-900 text-sm">
    <!-- PÁGINA 1: CAPA EDITORIAL HUMANIZADA -->
    <div class="h-[900px] flex flex-col justify-between items-center text-center p-8 border-4 border-double border-indigo-950">
      <div class="mt-10">
        <div class="text-indigo-900 text-5xl mb-4">✦ ☽ ☉ ☾ ✦</div>
        <h1 class="text-4xl font-serif font-bold text-indigo-950 tracking-wider uppercase">Guia de Autoconhecimento</h1>
        <p class="text-gray-500 tracking-widest mt-2 uppercase text-xs">Seu Livro Pessoal de Propósito, Emoções e Potenciais</p>
      </div>

      <div class="my-8 p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl w-full max-w-md shadow-sm">
        <p class="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mb-1">Preparado com carinho para</p>
        <h2 class="text-2xl font-serif font-bold text-indigo-950 mb-3">${name}</h2>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Nascimento:</strong> ${birthDate} às ${birthTime}</p>
          <p><strong>Local:</strong> ${city}</p>
        </div>
      </div>

      <div class="mb-8 text-xs text-gray-400 max-w-sm">
        <p>Um mapa do céu exato no instante da sua chegada ao mundo, traduzido em clareza para a sua vida real.</p>
      </div>
    </div>

    <!-- PÁGINA 2: MANDALA VISUAL + PILARES ESSENCIAIS -->
    <div class="page-break-before pt-2 text-center">
      <h2 class="text-2xl font-serif font-bold text-indigo-950 mb-1">Sua Mandala Astrológica</h2>
      <p class="text-xs text-gray-500 mb-4">A fotografia astronômica exata do céu no momento do seu nascimento</p>

      <!-- MANDALA SVG VETORIAL -->
      <div class="my-3 flex justify-center">
        ${mandalaSvg}
      </div>

      <!-- COORDENADAS DOS ASTROS PRINCIPAIS -->
      <div class="grid grid-cols-2 gap-3 mt-6 text-left">
        <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span class="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Sol (Identidade Central)</span>
          <p class="text-sm font-bold text-amber-950">${chart.sun.sign} (${chart.sun.degree})</p>
        </div>
        <div class="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
          <span class="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">Lua (Mundo Emocional)</span>
          <p class="text-sm font-bold text-indigo-950">${chart.moon.sign} (${chart.moon.degree})</p>
        </div>
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span class="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Mercúrio (Mente & Voz)</span>
          <p class="text-sm font-semibold text-slate-900">${chart.mercury.sign} (${chart.mercury.degree})</p>
        </div>
        <div class="p-2.5 bg-pink-50 border border-pink-200 rounded-lg">
          <span class="text-[10px] text-pink-700 font-bold uppercase tracking-wider">Vênus (Afeto & Valores)</span>
          <p class="text-sm font-semibold text-pink-950">${chart.venus.sign} (${chart.venus.degree})</p>
        </div>
      </div>
    </div>

    <!-- PÁGINA 3 EM DIANTE: RAIO-X INICIAL + CAPÍTULOS DETALHADOS -->
    <div>
      ${formattedAnalysis}
    </div>
  </body>
  </html>
  `;
}