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

// 1. Converte markdown básico (**negrito** e *itálico*) para HTML
function parseMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
}

// 2. Formata data de YYYY-MM-DD para DD/MM/YYYY
function formatDateBr(dateStr: string): string {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function generatePdfHtml({ name, birthDate, birthTime, city, chart, analysisText }: TemplateProps): string {
  const mandalaSvg = generateChartWheelSvg(chart);
  const formattedDate = formatDateBr(birthDate);

  // 3. Processamento inteligente dos blocos de texto
  const formattedAnalysis = analysisText
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Remove divisores redundantes (---)
      if (trimmed === "---" || trimmed === "***") {
        return "";
      }

      // Título do Raio-X Inicial (# ou ###) -> Inicia sempre em folha nova com card de apresentação
      if (
        trimmed.startsWith("# O RAIO-X") ||
        trimmed.startsWith("### SEÇÃO INICIAL") ||
        trimmed.startsWith("### O RAIO-X") ||
        trimmed.startsWith("# SEÇÃO INICIAL")
      ) {
        const titleClean = trimmed.replace(/^#+\s*/, "").trim();
        return `
          <div class="page-break-before pt-2 mb-4 p-4 bg-indigo-50/80 rounded-xl border border-indigo-200/70 shadow-sm">
            <span class="text-[9px] uppercase font-bold tracking-widest text-indigo-600 block mb-0.5">
              Síntese Executiva • Leitura Rápida
            </span>
            <h2 class="text-lg font-serif font-bold text-indigo-950">${parseMarkdownInline(titleClean)}</h2>
            <p class="text-[11px] text-indigo-900/80 mt-1">Um panorama essencial da sua jornada pessoal traduzido para a vida real.</p>
          </div>
        `;
      }

      // Títulos dos Capítulos Principais (## ) -> Força nova página para cada capítulo
      if (trimmed.startsWith("## ")) {
        const title = trimmed.replace("## ", "").trim();
        return `
          <div class="page-break-before pt-2 mb-4">
            <span class="text-[9px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mb-1.5">
              Jornada Pessoal
            </span>
            <h2 class="text-xl font-serif font-bold text-indigo-950 border-b-2 border-indigo-200 pb-1.5 leading-snug">
              ${parseMarkdownInline(title)}
            </h2>
          </div>
        `;
      }

      // Subtítulos regulares (### )
      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "").trim();
        return `<h3 class="text-base font-bold text-indigo-950 mt-4 mb-2 border-b border-indigo-100 pb-1">${parseMarkdownInline(title)}</h3>`;
      }

      // Tratamento das Caixas de Destaque (mesmo se vierem juntas em bullet points)
      const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
      const hasCallout = lines.some((l) =>
        l.includes("O Seu Maior Talento") ||
        l.includes("Maior Talento") ||
        l.includes("O Ponto de Atenção") ||
        l.includes("Ponto de Atenção") ||
        l.includes("Ação Prática")
      );

      if (hasCallout) {
        return lines
          .map((line) => {
            // Caixa Dourada: O Seu Maior Talento
            if (line.includes("O Seu Maior Talento") || line.includes("Maior Talento")) {
              let content = line.replace(/.*(?:O Seu Maior Talento|Maior Talento):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="my-2.5 p-3 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-lg shadow-sm avoid-break">
                  <span class="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-0.5">🌟 O Seu Maior Talento</span>
                  <p class="text-gray-800 text-xs leading-relaxed text-justify">${parseMarkdownInline(content)}</p>
                </div>
              `;
            }

            // Caixa Vinho: O Ponto de Atenção
            if (line.includes("O Ponto de Atenção") || line.includes("Ponto de Atenção")) {
              let content = line.replace(/.*(?:O Ponto de Atenção|Ponto de Atenção):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="my-2.5 p-3 bg-rose-50/90 border-l-4 border-rose-500 rounded-r-lg shadow-sm avoid-break">
                  <span class="text-[10px] font-bold text-rose-900 uppercase tracking-wider block mb-0.5">🌑 O Ponto de Atenção</span>
                  <p class="text-gray-800 text-xs leading-relaxed text-justify">${parseMarkdownInline(content)}</p>
                </div>
              `;
            }

            // Caixa Índigo: Ação Prática
            if (line.includes("Ação Prática")) {
              let content = line.replace(/.*(?:Ação Prática):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="my-2.5 p-3 bg-indigo-50/90 border-l-4 border-indigo-600 rounded-r-lg shadow-sm avoid-break">
                  <span class="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-0.5">🧭 Ação Prática</span>
                  <p class="text-gray-800 text-xs leading-relaxed text-justify">${parseMarkdownInline(content)}</p>
                </div>
              `;
            }

            return `<p class="text-gray-700 leading-relaxed mb-2.5 text-justify text-xs">${parseMarkdownInline(line)}</p>`;
          })
          .join("");
      }

      // Parágrafos regulares (com espaçamento otimizado para evitar páginas órfãs)
      return `<p class="text-gray-700 leading-relaxed mb-3 text-justify text-[13px]">${parseMarkdownInline(trimmed)}</p>`;
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
        margin: 18mm 15mm 18mm 15mm;
      }
      .page-break-before {
        page-break-before: always;
      }
      .avoid-break {
        page-break-inside: avoid;
      }
    </style>
  </head>
  <body class="bg-white text-gray-900 text-sm">

    <!-- PÁGINA 1: CAPA EDITORIAL -->
    <div class="h-[880px] flex flex-col justify-between items-center text-center p-8 border-4 border-double border-indigo-950">
      <div class="mt-8">
        <div class="text-indigo-900 text-4xl mb-3">✦ ☽ ☉ ☾ ✦</div>
        <h1 class="text-4xl font-serif font-bold text-indigo-950 tracking-wider uppercase">Guia de Autoconhecimento</h1>
        <p class="text-gray-500 tracking-widest mt-2 uppercase text-xs">Seu Livro Pessoal de Propósito, Emoções e Potenciais</p>
      </div>

      <div class="my-6 p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl w-full max-w-md shadow-sm">
        <p class="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mb-1">Preparado com carinho para</p>
        <h2 class="text-2xl font-serif font-bold text-indigo-950 mb-3">${name}</h2>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Nascimento:</strong> ${formattedDate} às ${birthTime}</p>
          <p><strong>Local:</strong> ${city}</p>
        </div>
      </div>

      <div class="mb-6 text-xs text-gray-400 max-w-sm">
        <p>Um mapa do céu exato no instante da sua chegada ao mundo, traduzido em clareza para a sua vida real.</p>
      </div>
    </div>

    <!-- PÁGINA 2: MANDALA VISUAL (EXCLUSIVA, SEM VAZAMENTO DE TEXTO) -->
    <div class="page-break-before pt-2 text-center">
      <h2 class="text-2xl font-serif font-bold text-indigo-950 mb-1">Sua Mandala Astrológica</h2>
      <p class="text-xs text-gray-500 mb-3">A fotografia astronômica exata do céu no momento do seu nascimento</p>

      <!-- MANDALA SVG VETORIAL -->
      <div class="my-2 flex justify-center">
        ${mandalaSvg}
      </div>

      <!-- COORDENADAS DOS ASTROS PRINCIPAIS -->
      <div class="grid grid-cols-2 gap-3 mt-5 text-left">
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

    <!-- PÁGINA 3 EM DIANTE: RAIO-X + CAPÍTULOS (SEMPRE INICIA EM PÁGINA NOVA) -->
    <div>
      ${formattedAnalysis}
    </div>

  </body>
  </html>
  `;
}