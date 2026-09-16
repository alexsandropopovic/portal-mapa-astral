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

// Converte markdown (**negrito** e *itálico*) para HTML seguro
function parseMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');
}

// Formata data para o padrão brasileiro DD/MM/AAAA
function formatDateBr(dateStr: string): string {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function generatePdfHtml({ name, birthDate, birthTime, city, chart, analysisText }: TemplateProps): string {
  const mandalaSvg = generateChartWheelSvg(chart);
  const formattedDate = formatDateBr(birthDate);

  // Processamento e estilização responsiva dos capítulos
  const formattedAnalysis = analysisText
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      if (trimmed === "---" || trimmed === "***") {
        return `<hr class="my-8 border-indigo-100" />`;
      }

      // Seção Inicial: O Raio-X Rápido
      if (
        trimmed.startsWith("# O RAIO-X") ||
        trimmed.startsWith("### SEÇÃO INICIAL") ||
        trimmed.startsWith("### O RAIO-X") ||
        trimmed.startsWith("# SEÇÃO INICIAL")
      ) {
        const titleClean = trimmed.replace(/^#+\s*/, "").trim();
        return `
          <div class="page-break-before my-8 p-5 sm:p-6 bg-gradient-to-br from-indigo-50/90 to-purple-50/50 rounded-2xl border border-indigo-100 shadow-sm">
            <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-600 bg-white/80 px-2.5 py-1 rounded-full border border-indigo-200/60 inline-block mb-2">
              Síntese Executiva • Leitura Rápida
            </span>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-indigo-950">${parseMarkdownInline(titleClean)}</h2>
            <p class="text-xs sm:text-sm text-indigo-900/80 mt-1">Um panorama essencial da sua jornada pessoal traduzido para a sua vida real.</p>
          </div>
        `;
      }

      // Títulos dos Capítulos Principais
      if (trimmed.startsWith("## ")) {
        const title = trimmed.replace("## ", "").trim();
        return `
          <div class="page-break-before pt-6 sm:pt-8 mb-5 border-t border-slate-100 sm:border-none">
            <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60 inline-block mb-2">
              Jornada Pessoal
            </span>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-indigo-950 border-b-2 border-indigo-200 pb-2 leading-snug">
              ${parseMarkdownInline(title)}
            </h2>
          </div>
        `;
      }

      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "").trim();
        return `<h3 class="text-lg font-bold text-indigo-950 mt-6 mb-2">${parseMarkdownInline(title)}</h3>`;
      }

      // Caixas de Destaque (Superpoder, Sombra, Ação Prática)
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
            // 🌟 Talento Inato (Ouro/Âmbar)
            if (line.includes("O Seu Maior Talento") || line.includes("Maior Talento")) {
              let content = line.replace(/.*(?:O Seu Maior Talento|Maior Talento):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="my-3 p-4 bg-amber-50/80 border border-amber-200/70 border-l-4 border-l-amber-500 rounded-xl shadow-sm avoid-break">
                  <span class="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1 mb-1">
                    🌟 O Seu Maior Talento
                  </span>
                  <p class="text-slate-800 text-xs sm:text-sm leading-relaxed">${parseMarkdownInline(content)}</p>
                </div>
              `;
            }

            // 🌑 Ponto de Atenção (Vinho/Rose)
            if (line.includes("O Ponto de Atenção") || line.includes("Ponto de Atenção")) {
              let content = line.replace(/.*(?:O Ponto de Atenção|Ponto de Atenção):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="my-3 p-4 bg-rose-50/80 border border-rose-200/70 border-l-4 border-l-rose-500 rounded-xl shadow-sm avoid-break">
                  <span class="text-[11px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1 mb-1">
                    🌑 O Ponto de Atenção
                  </span>
                  <p class="text-slate-800 text-xs sm:text-sm leading-relaxed">${parseMarkdownInline(content)}</p>
                </div>
              `;
            }

            // 🧭 Ação Prática (Índigo)
            if (line.includes("Ação Prática")) {
              let content = line.replace(/.*(?:Ação Prática):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="my-3 p-4 bg-indigo-50/80 border border-indigo-200/70 border-l-4 border-l-indigo-600 rounded-xl shadow-sm avoid-break">
                  <span class="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1 mb-1">
                    🧭 Ação Prática
                  </span>
                  <p class="text-slate-800 text-xs sm:text-sm leading-relaxed">${parseMarkdownInline(content)}</p>
                </div>
              `;
            }

            return `<p class="text-slate-700 leading-relaxed mb-3 text-xs sm:text-sm text-justify">${parseMarkdownInline(line)}</p>`;
          })
          .join("");
      }

      // Parágrafos regulares com tipografia confortável
      return `<p class="text-slate-700 leading-relaxed mb-4 text-sm sm:text-base text-justify">${parseMarkdownInline(trimmed)}</p>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="pt-BR" class="scroll-smooth">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guia Pessoal de Autoconhecimento - ${name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      /* Regras exclusivas para impressão e compilação do PDF */
      @media print {
        @page {
          size: A4;
          margin: 18mm 15mm 18mm 15mm;
        }
        body {
          background-color: #ffffff !important;
          padding: 0 !important;
        }
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .cover-page {
          height: 880px !important;
          margin-bottom: 0 !important;
        }
        .reader-container {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      }

      /* Regras para visualização em tela (Mobile e Desktop) */
      @media screen {
        body {
          background-color: #f1f5f9;
        }
        .cover-page {
          min-height: 75vh;
        }
      }
    </style>
  </head>
  <body class="text-slate-900 antialiased py-4 sm:py-10 px-2 sm:px-4 selection:bg-indigo-100 selection:text-indigo-900">

    <!-- CONTAINER PRINCIPAL CENTRALIZADO E RESPONSIVO (MAX 768px) -->
    <main class="reader-container max-w-3xl mx-auto bg-white sm:shadow-xl sm:rounded-3xl p-5 sm:p-12 border border-slate-200/60">

      <!-- 1. CAPA EDITORIAL RESPONSIVA -->
      <section class="cover-page flex flex-col justify-between items-center text-center p-6 sm:p-10 border-4 border-double border-indigo-950 rounded-2xl bg-gradient-to-b from-indigo-50/30 to-white mb-10 sm:mb-16">
        <div class="mt-4 sm:mt-8">
          <div class="text-indigo-900 text-3xl sm:text-4xl mb-3 tracking-widest">✦ ☽ ☉ ☾ ✦</div>
          <h1 class="text-3xl sm:text-4xl font-serif font-bold text-indigo-950 tracking-wider uppercase leading-tight">
            Guia de Autoconhecimento
          </h1>
          <p class="text-slate-500 tracking-widest mt-2 uppercase text-[10px] sm:text-xs font-medium">
            Seu Livro Pessoal de Propósito, Emoções e Potenciais
          </p>
        </div>

        <div class="my-6 p-5 sm:p-6 bg-indigo-50/70 border border-indigo-100 rounded-2xl w-full max-w-md shadow-sm">
          <p class="text-[10px] sm:text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mb-1">
            Preparado com carinho para
          </p>
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-indigo-950 mb-2 sm:mb-3 capitalize">
            ${name}
          </h2>
          <div class="text-xs text-slate-600 space-y-0.5">
            <p><strong>Nascimento:</strong> ${formattedDate} às ${birthTime}</p>
            <p><strong>Local:</strong> ${city}</p>
          </div>
        </div>

        <div class="mb-4 text-xs text-slate-400 max-w-sm">
          <p>Um mapa do céu exato no instante da sua chegada ao mundo, traduzido em clareza para a sua vida real.</p>
        </div>
      </section>

      <!-- 2. MANDALA ASTRAL + COORDENADAS -->
      <section class="page-break-before pt-2 sm:pt-4 text-center mb-10 sm:mb-16">
        <h2 class="text-2xl sm:text-3xl font-serif font-bold text-indigo-950 mb-1">
          Sua Mandala Astrológica
        </h2>
        <p class="text-xs text-slate-500 mb-6">
          A fotografia astronômica exata do céu no momento do seu nascimento
        </p>

        <!-- SVG COM LARGURA MÁXIMA PROPORCIONAL AO CELULAR -->
        <div class="my-4 flex justify-center w-full max-w-[320px] sm:max-w-[400px] mx-auto">
          ${mandalaSvg}
        </div>

        <!-- CARDS DE PLANETAS (EM 2 COLUNAS COMPACTAS) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left max-w-lg mx-auto">
          <div class="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl">
            <span class="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Sol (Identidade Central)</span>
            <p class="text-sm sm:text-base font-bold text-amber-950">${chart.sun.sign} (${chart.sun.degree})</p>
          </div>
          <div class="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-xl">
            <span class="text-[10px] text-indigo-800 font-bold uppercase tracking-wider block">Lua (Mundo Emocional)</span>
            <p class="text-sm sm:text-base font-bold text-indigo-950">${chart.moon.sign} (${chart.moon.degree})</p>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span class="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Mercúrio (Mente & Voz)</span>
            <p class="text-sm sm:text-base font-semibold text-slate-900">${chart.mercury.sign} (${chart.mercury.degree})</p>
          </div>
          <div class="p-3 bg-pink-50/80 border border-pink-200/80 rounded-xl">
            <span class="text-[10px] text-pink-800 font-bold uppercase tracking-wider block">Vênus (Afeto & Valores)</span>
            <p class="text-sm sm:text-base font-semibold text-pink-950">${chart.venus.sign} (${chart.venus.degree})</p>
          </div>
        </div>
      </section>

      <!-- 3. CONTEÚDO (RAIO-X + CAPÍTULOS DETALHADOS) -->
      <article class="prose-slate max-w-none">
        ${formattedAnalysis}
      </article>

      <!-- RODAPÉ FINAL DE ENCERRAMENTO -->
      <footer class="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
        <p>✦ Guia Pessoal de Autoconhecimento • Guarde este documento para consultas futuras ✦</p>
      </footer>

    </main>
  </body>
  </html>
  `;
}