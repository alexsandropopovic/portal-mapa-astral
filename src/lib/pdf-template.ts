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

// 1. Converte markdown inline (**negrito** e *itálico*) para HTML
function parseMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');
}

// 2. Limpa caracteres hash (#) que a IA possa deixar soltos
function cleanTitleHashes(text: string): string {
  return text.replace(/#+/g, "").replace(/\s+/g, " ").trim();
}

// 3. Formata data para DD/MM/AAAA
function formatDateBr(dateStr: string): string {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function generatePdfHtml({ name, birthDate, birthTime, city, chart, analysisText }: TemplateProps): string {
  const mandalaSvg = generateChartWheelSvg(chart);
  const formattedDate = formatDateBr(birthDate);

  // 4. Processamento inteligente das seções
  const formattedAnalysis = analysisText
    .split("\n\n")
    .map((block) => {
      let trimmed = block.trim();
      if (!trimmed) return "";

      // Ignora divisores redundantes
      if (trimmed === "---" || trimmed === "***") return "";

      // Ignora repetições do título geral que possam vazar
      if (
        trimmed.startsWith("# CÓDIGO ASTRAL") ||
        trimmed.startsWith("# CODIGO ASTRAL") ||
        (trimmed.includes("DOSSIÊ DE ENGENHARIA COMPORTAMENTAL") && !trimmed.includes("TRILHA"))
      ) {
        return "";
      }

      // Seção Inicial: O Raio-X da Alma (Inicia sempre em folha nova)
      if (trimmed.toUpperCase().includes("RAIO-X")) {
        const titleClean = cleanTitleHashes(trimmed);
        return `
          <div class="page-break-before pt-4 sm:pt-6 mb-5">
            <div class="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/90 to-purple-50/50 rounded-2xl border border-indigo-200/80 shadow-sm">
              <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200/60 inline-block mb-2">
                Síntese da Alma • Leitura em 10 Minutos
              </span>
              <h2 class="text-xl sm:text-2xl font-serif font-bold text-indigo-950">${parseMarkdownInline(titleClean)}</h2>
              <p class="text-xs sm:text-sm text-indigo-900/80 mt-1">Um panorama essencial da sua paisagem interior traduzido com clareza e reverência.</p>
            </div>
          </div>
        `;
      }

      // Títulos das Trilhas e Síntese Estratégica (## ) -> Força nova página
      if (trimmed.startsWith("## ") || trimmed.toUpperCase().includes("TRILHA ") || trimmed.toUpperCase().includes("SÍNTESE ESTRATÉGICA")) {
        const titleClean = cleanTitleHashes(trimmed.replace("## ", ""));
        
        let badge = "Dimensão da Alma";
        if (titleClean.toUpperCase().includes("TRILHA 1")) badge = "Trilha 01 • Vocação Sagrada & Abundância";
        else if (titleClean.toUpperCase().includes("TRILHA 2")) badge = "Trilha 02 • Mistérios da Sombra & Consciência";
        else if (titleClean.toUpperCase().includes("TRILHA 3")) badge = "Trilha 03 • Templo dos Afetos & Relações";
        else if (titleClean.toUpperCase().includes("TRILHA 4")) badge = "Trilha 04 • Radar dos Ciclos & Roda do Tempo";
        else if (titleClean.toUpperCase().includes("SÍNTESE")) badge = "Manifesto Final • Luz Pessoal";

        return `
          <div class="page-break-before pt-6 sm:pt-8 mb-5">
            <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 inline-block mb-1.5">
              ${badge}
            </span>
            <h2 class="text-xl sm:text-2xl font-serif font-bold text-indigo-950 border-b-2 border-indigo-200 pb-2 leading-snug">
              ${parseMarkdownInline(titleClean)}
            </h2>
          </div>
        `;
      }

      // Subtítulos regulares (### )
      if (trimmed.startsWith("### ")) {
        const titleClean = cleanTitleHashes(trimmed.replace("### ", ""));
        return `<h3 class="text-base sm:text-lg font-bold text-indigo-950 mt-5 mb-2">${parseMarkdownInline(titleClean)}</h3>`;
      }

      // Caixas de Destaque com proteção estrita contra quebra ao meio
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
            // 🌟 Talento Inato (Dourado/Âmbar)
            if (line.includes("O Seu Maior Talento") || line.includes("Maior Talento")) {
              let content = line.replace(/.*(?:O Seu Maior Talento|Maior Talento):\*{0,2}\s*/i, "").trim();
              content = content.charAt(0).toUpperCase() + content.slice(1);
              return `
                <div class="avoid-break my-3 p-3.5 sm:p-4 bg-amber-50/90 border border-amber-200/70 border-l-4 border-l-amber-500 rounded-xl shadow-sm" style="page-break-inside: avoid !important; break-inside: avoid !important;">
                  <span class="text-[10px] sm:text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
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
                <div class="avoid-break my-3 p-3.5 sm:p-4 bg-rose-50/90 border border-rose-200/70 border-l-4 border-l-rose-500 rounded-xl shadow-sm" style="page-break-inside: avoid !important; break-inside: avoid !important;">
                  <span class="text-[10px] sm:text-[11px] font-bold text-rose-900 uppercase tracking-wider block mb-1">
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
                <div class="avoid-break my-3 p-3.5 sm:p-4 bg-indigo-50/90 border border-indigo-200/70 border-l-4 border-l-indigo-600 rounded-xl shadow-sm" style="page-break-inside: avoid !important; break-inside: avoid !important;">
                  <span class="text-[10px] sm:text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
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

      // Parágrafos regulares
      return `<p class="text-slate-700 leading-relaxed mb-3.5 text-xs sm:text-base text-justify">${parseMarkdownInline(trimmed)}</p>`;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="pt-BR" class="scroll-smooth">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código Astral: Dossiê em 4 Trilhas - ${name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      /* REGRAS RÍGIDAS DE IMPRESSÃO A4 (PDFSHIFT) */
      @media print {
        @page {
          size: A4;
          margin: 16mm 15mm 16mm 15mm;
        }
        html, body, main, section, article, div {
          overflow: visible !important;
          overflow-x: visible !important;
          height: auto !important;
        }
        body {
          background-color: #ffffff !important;
          padding: 0 !important;
        }
        .reader-container {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
        .page-break-after {
          page-break-after: always !important;
          break-after: page !important;
        }
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .cover-page {
          min-height: 940px !important;
          height: 940px !important;
          page-break-after: always !important;
          break-after: page !important;
          margin-bottom: 0 !important;
        }
        .mandala-page {
          min-height: 940px !important;
          page-break-after: always !important;
          break-after: page !important;
        }
      }

      /* REGRAS PARA VISUALIZAÇÃO EM TELA (MOBILE E DESKTOP) */
      @media screen {
        body {
          background-color: #f8fafc;
          overflow-x: hidden;
        }
        .cover-page {
          min-height: 70vh;
        }
        .reader-container {
          overflow-x: hidden;
        }
      }
    </style>
  </head>
  <body class="text-slate-900 antialiased py-2 sm:py-8 px-1 sm:px-4">

    <main class="reader-container max-w-3xl mx-auto bg-white sm:shadow-xl sm:rounded-3xl p-3 sm:p-10 border-0 sm:border border-slate-200/60">

      <!-- PÁGINA 1: CAPA COM QUEBRA FORÇADA NO FINAL (page-break-after) -->
      <section class="cover-page page-break-after flex flex-col justify-between items-center text-center p-4 sm:p-8 border-2 sm:border-4 border-indigo-950 sm:border-double rounded-2xl bg-gradient-to-b from-indigo-50/20 to-white mb-8 sm:mb-14">
        <div class="mt-4 sm:mt-8 w-full">
          <div class="text-indigo-900 text-2xl sm:text-3xl mb-2 tracking-widest">✦ ☽ ☉ ☾ ✦</div>
          
          <h1 class="text-2xl sm:text-4xl font-serif font-black text-indigo-950 tracking-wider uppercase leading-tight">
            Código Astral
          </h1>
          
          <p class="text-indigo-700 tracking-widest mt-1 uppercase text-[10px] sm:text-xs font-bold">
            Dossiê de Engenharia Comportamental em 4 Trilhas
          </p>
          <p class="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5">
            Seu Manual de Instruções Pessoal para Tomada de Decisão
          </p>
        </div>

        <div class="my-6 p-4 sm:p-6 bg-indigo-50/70 border border-indigo-100 rounded-xl w-full max-w-sm shadow-sm">
          <p class="text-[9px] sm:text-[10px] text-indigo-600 font-semibold uppercase tracking-wider mb-1">
            Preparado exclusivamente para
          </p>
          <h2 class="text-lg sm:text-2xl font-serif font-bold text-indigo-950 mb-1.5 capitalize">
            ${name}
          </h2>
          <div class="text-[11px] sm:text-xs text-slate-600 space-y-0.5">
            <p><strong>Nascimento:</strong> ${formattedDate} às ${birthTime}</p>
            <p class="break-words"><strong>Local:</strong> ${city}</p>
          </div>
        </div>

        <div class="mb-4 text-[10px] sm:text-xs text-slate-400 max-w-xs px-2">
          <p>Decodificação de coordenadas celestes traduzidas em clareza prática para sua vida real.</p>
        </div>
      </section>

      <!-- PÁGINA 2: MANDALA ASTRAL ISOLADA COM QUEBRA FORÇADA NO FINAL (page-break-after) -->
      <section class="mandala-page page-break-after pt-4 sm:pt-6 text-center mb-8 sm:mb-14">
        <h2 class="text-xl sm:text-3xl font-serif font-bold text-indigo-950 mb-1">
          Sua Mandala Astrológica
        </h2>
        <p class="text-xs text-slate-500 mb-4 sm:mb-6">
          A fotografia astronômica exata do céu no momento do seu nascimento
        </p>

        <div class="my-3 flex justify-center w-full max-w-[280px] sm:max-w-[380px] mx-auto">
          ${mandalaSvg}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-6 text-left max-w-md mx-auto">
          <div class="p-2.5 sm:p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl">
            <span class="text-[9px] sm:text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Sol (Identidade Central)</span>
            <p class="text-xs sm:text-base font-bold text-amber-950">${chart.sun.sign} (${chart.sun.degree})</p>
          </div>
          <div class="p-2.5 sm:p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-xl">
            <span class="text-[9px] sm:text-[10px] text-indigo-800 font-bold uppercase tracking-wider block">Lua (Mundo Emocional)</span>
            <p class="text-xs sm:text-base font-bold text-indigo-950">${chart.moon.sign} (${chart.moon.degree})</p>
          </div>
          <div class="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span class="text-[9px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Mercúrio (Mente & Voz)</span>
            <p class="text-xs sm:text-base font-semibold text-slate-900">${chart.mercury.sign} (${chart.mercury.degree})</p>
          </div>
          <div class="p-2.5 sm:p-3 bg-pink-50/80 border border-pink-200/80 rounded-xl">
            <span class="text-[9px] sm:text-[10px] text-pink-800 font-bold uppercase tracking-wider block">Vênus (Afeto & Valores)</span>
            <p class="text-xs sm:text-base font-semibold text-pink-950">${chart.venus.sign} (${chart.venus.degree})</p>
          </div>
        </div>
      </section>

      <!-- PÁGINA 3 EM DIANTE: RAIO-X + TRILHAS -->
      <article class="prose-slate max-w-none">
        ${formattedAnalysis}
      </article>

      <!-- RODAPÉ FINAL -->
      <footer class="mt-10 pt-6 border-t border-slate-100 text-center text-[10px] sm:text-xs text-slate-400">
        <p>✦ Código Astral: Dossiê em 4 Trilhas • Documento Pessoal e Intransferível ✦</p>
      </footer>

    </main>
  </body>
  </html>
  `;
}