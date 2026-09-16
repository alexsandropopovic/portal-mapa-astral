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

  const formattedAnalysis = analysisText
    .split("\n\n")
    .map((paragraph) => {
      if (paragraph.startsWith("### ")) {
        return `<h3 class="text-lg font-bold text-indigo-950 mt-6 mb-2 border-b border-indigo-200 pb-1">${paragraph.replace("### ", "")}</h3>`;
      }
      if (paragraph.startsWith("## ")) {
        return `<h2 class="text-xl font-bold text-indigo-900 mt-8 mb-3 border-b-2 border-indigo-300 pb-1 page-break-before">${paragraph.replace("## ", "")}</h2>`;
      }
      return `<p class="text-gray-700 leading-relaxed mb-4 text-justify text-sm">${paragraph}</p>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Mapa Astral - ${name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
      .page-break-before { page-break-before: always; }
    </style>
  </head>
  <body class="bg-white text-gray-900 text-sm">
    <!-- CAPA -->
    <div class="h-[900px] flex flex-col justify-between items-center text-center p-8 border-4 border-double border-indigo-900">
      <div class="mt-12">
        <div class="text-indigo-900 text-5xl mb-4">✦ ☽ ☉ ☾ ✦</div>
        <h1 class="text-4xl font-serif font-bold text-indigo-950 tracking-wider uppercase">Mapa Astral Natal</h1>
        <p class="text-gray-500 tracking-widest mt-2 uppercase text-xs">Relatório de Síntese Psicológica e Arquetípica</p>
      </div>

      <div class="my-10 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl w-full max-w-md">
        <p class="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">Elaborado exclusivamente para</p>
        <h2 class="text-2xl font-serif font-bold text-indigo-950 mb-3">${name}</h2>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Nascimento:</strong> ${birthDate} às ${birthTime}</p>
          <p><strong>Local:</strong> ${city}</p>
        </div>
      </div>

      <div class="mb-10 text-xs text-gray-400">
        <p>Cálculos astronômicos precisos com base em coordenadas celestes.</p>
      </div>
    </div>

    <!-- MANDALA VISUAL (PÁGINA 2) -->
    <div class="page-break-before pt-2 text-center">
      <h2 class="text-2xl font-serif font-bold text-indigo-950 mb-1">Mandala Astrológica Natal</h2>
      <p class="text-xs text-gray-500 mb-4">Representação gráfica das esferas celestes no momento do nascimento</p>

      <div class="my-4 flex justify-center">
        ${mandalaSvg}
      </div>

      <div class="grid grid-cols-2 gap-3 mt-6 text-left">
        <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span class="text-[10px] text-amber-700 font-bold uppercase">Sol</span>
          <p class="text-sm font-bold text-amber-950">${chart.sun.sign} (${chart.sun.degree})</p>
        </div>
        <div class="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
          <span class="text-[10px] text-indigo-700 font-bold uppercase">Lua</span>
          <p class="text-sm font-bold text-indigo-950">${chart.moon.sign} (${chart.moon.degree})</p>
        </div>
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span class="text-[10px] text-slate-600 font-bold uppercase">Mercúrio</span>
          <p class="text-sm font-semibold text-slate-900">${chart.mercury.sign} (${chart.mercury.degree})</p>
        </div>
        <div class="p-2.5 bg-pink-50 border border-pink-200 rounded-lg">
          <span class="text-[10px] text-pink-700 font-bold uppercase">Vênus</span>
          <p class="text-sm font-semibold text-pink-950">${chart.venus.sign} (${chart.venus.degree})</p>
        </div>
      </div>
    </div>

    <!-- OS 8 CAPÍTULOS -->
    <div class="page-break-before pt-4">
      ${formattedAnalysis}
    </div>
  </body>
  </html>
  `;
}