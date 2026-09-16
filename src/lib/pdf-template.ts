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

// Converte nome para Title Case (ex: "alexsandro" -> "Alexsandro")
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (["de", "da", "do", "dos", "das", "e"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Parser completo de Markdown para HTML editorial de luxo
function parseAstrologyMarkdown(md: string): string {
  // 1. Remove marcadores "---" e corrige quebras de hífen
  let text = md.replace(/^---\s*$/gm, "");
  text = text.replace(/tornase/g, "torna-se");

  // 2. Se a IA colocar tópicos na mesma linha (ex: "- Item. - Outro."), quebra para linhas separadas
  text = text.replace(/([^\n])\s*-\s+/g, "$1\n- ");
  text = text.replace(/([^\n])\s*(\d+\.\s+\*\*)/g, "$1\n$2");

  // 3. Converte **negrito** e *itálico*
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
  text = text.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic text-slate-700">$1</em>');

  // 4. Divide em blocos lógicos
  const rawBlocks = text.split(/\n\s*\n/);
  const htmlBlocks: string[] = [];

  for (let block of rawBlocks) {
    block = block.trim();
    if (!block) continue;

    // Título de Capítulo (##)
    if (block.startsWith("## ")) {
      const title = block.replace(/^##\s+/, "");
      htmlBlocks.push(`
        <div class="chapter-header page-break-before mt-8 mb-4 border-b-2 border-indigo-900/20 pb-2">
          <span class="text-[10px] tracking-widest uppercase text-indigo-600 font-bold">Análise Arquetípica</span>
          <h2 class="text-xl font-serif font-bold text-indigo-950">${title}</h2>
        </div>
      `);
      continue;
    }

    // Subtítulo (### ou títulos curtos sem ##)
    if (block.startsWith("### ")) {
      const sub = block.replace(/^###\s+/, "");
      htmlBlocks.push(`
        <h3 class="text-sm font-bold uppercase tracking-wider text-indigo-900 mt-5 mb-2 avoid-break border-b border-indigo-100 pb-1">
          ✦ ${sub}
        </h3>
      `);
      continue;
    }

    // Lista de Marcadores (- ou *)
    if (block.includes("\n- ") || block.startsWith("- ")) {
      const items = block
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- ") || line.startsWith("* "))
        .map((line) => line.replace(/^[-*]\s+/, ""))
        .map((item) => `<li class="text-slate-700 text-xs leading-relaxed mb-1.5 pl-1">${item}</li>`)
        .join("");

      htmlBlocks.push(`
        <ul class="my-3 pl-4 space-y-1 list-disc list-outside marker:text-indigo-600 avoid-break bg-indigo-50/40 p-3 rounded-lg border border-indigo-100/60">
          ${items}
        </ul>
      `);
      continue;
    }

    // Lista Numerada (1. 2. 3.)
    if (/^\d+\.\s+/.test(block) || block.includes("\n1. ")) {
      const items = block
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => /^\d+\.\s+/.test(line))
        .map((line) => line.replace(/^\d+\.\s+/, ""))
        .map((item) => `<li class="text-slate-700 text-xs leading-relaxed mb-2 pl-1">${item}</li>`)
        .join("");

      htmlBlocks.push(`
        <ol class="my-3 pl-4 space-y-1 list-decimal list-outside marker:font-bold marker:text-indigo-900 avoid-break">
          ${items}
        </ol>
      `);
      continue;
    }

    // Subtítulos embutidos que a IA cria sem "###" (ex: "Potenciais", "Desafios psicológicos")
    if (block.length < 50 && !block.endsWith(".") && !block.includes("<")) {
      htmlBlocks.push(`
        <h4 class="text-xs font-bold uppercase tracking-wide text-indigo-950 mt-4 mb-1.5 avoid-break">
          ${block}
        </h4>
      `);
      continue;
    }

    // Parágrafo Normal
    htmlBlocks.push(`
      <p class="text-slate-700 text-xs leading-relaxed mb-3 text-justify">
        ${block.replace(/\n/g, " ")}
      </p>
    `);
  }

  return htmlBlocks.join("\n");
}

export function generatePdfHtml({ name, birthDate, birthTime, city, chart, analysisText }: TemplateProps): string {
  const formattedName = toTitleCase(name);
  const mandalaSvg = generateChartWheelSvg(chart);
  const formattedAnalysis = parseAstrologyMarkdown(analysisText);

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Mapa Astral - ${formattedName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @page {
        size: A4;
        margin: 18mm 16mm 18mm 16mm;
      }
      .page-break-before {
        page-break-before: always;
      }
      .avoid-break {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    </style>
  </head>
  <body class="bg-white text-slate-900 text-xs antialiased">
    
    <!-- PÁGINA 1: CAPA EDITORIAL -->
    <div class="h-[920px] flex flex-col justify-between items-center text-center p-8 border-4 border-double border-indigo-950 rounded-xl">
      <div class="mt-16">
        <div class="text-indigo-900 text-4xl mb-4 tracking-widest">✦ ☽ ☉ ☾ ✦</div>
        <h1 class="text-3xl font-serif font-bold text-indigo-950 tracking-wider uppercase">Mapa Astral Natal</h1>
        <p class="text-slate-500 tracking-widest mt-2 uppercase text-[10px]">Livro de Síntese Psicológica e Arquetípica</p>
      </div>

      <div class="my-auto p-6 bg-slate-50 border border-indigo-100 rounded-2xl w-full max-w-sm shadow-sm">
        <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">Elaborado exclusivamente para</p>
        <h2 class="text-xl font-serif font-bold text-indigo-950 mb-3">${formattedName}</h2>
        <div class="text-[11px] text-slate-600 space-y-1 border-t border-slate-200/60 pt-3">
          <p><strong>Nascimento:</strong> ${birthDate} às ${birthTime}</p>
          <p><strong>Local:</strong> ${city}</p>
        </div>
      </div>

      <div class="mb-10 text-[10px] text-slate-400 tracking-wider">
        <p>Cálculos astronômicos de efemérides celestes de alta precisão.</p>
      </div>
    </div>

    <!-- PÁGINA 2: MANDALA E TODAS AS 7 COORDENADAS PLANETÁRIAS -->
    <div class="page-break-before pt-2 text-center">
      <h2 class="text-xl font-serif font-bold text-indigo-950 mb-0.5">Mandala Astrológica Natal</h2>
      <p class="text-[10px] text-slate-500 mb-3">Representação geométrica das esferas celestes no momento exato do nascimento</p>

      <div class="my-2 flex justify-center">
        ${mandalaSvg}
      </div>

      <!-- GRADE COMPLETA COM OS 7 PLANETAS -->
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4 text-left">
        <div class="p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg">
          <span class="text-[9px] text-amber-800 font-bold uppercase block">☉ Sol</span>
          <p class="text-xs font-bold text-amber-950">${chart.sun.sign}</p>
          <span class="text-[10px] text-amber-700 font-mono">${chart.sun.degree}</span>
        </div>
        <div class="p-2 bg-indigo-50/70 border border-indigo-200/80 rounded-lg">
          <span class="text-[9px] text-indigo-800 font-bold uppercase block">☽ Lua</span>
          <p class="text-xs font-bold text-indigo-950">${chart.moon.sign}</p>
          <span class="text-[10px] text-indigo-700 font-mono">${chart.moon.degree}</span>
        </div>
        <div class="p-2 bg-slate-100 border border-slate-300 rounded-lg">
          <span class="text-[9px] text-slate-700 font-bold uppercase block">☿ Mercúrio</span>
          <p class="text-xs font-bold text-slate-900">${chart.mercury.sign}</p>
          <span class="text-[10px] text-slate-600 font-mono">${chart.mercury.degree}</span>
        </div>
        <div class="p-2 bg-pink-50/70 border border-pink-200/80 rounded-lg">
          <span class="text-[9px] text-pink-800 font-bold uppercase block">♀ Vênus</span>
          <p class="text-xs font-bold text-pink-950">${chart.venus.sign}</p>
          <span class="text-[10px] text-pink-700 font-mono">${chart.venus.degree}</span>
        </div>
        <div class="p-2 bg-red-50/70 border border-red-200/80 rounded-lg">
          <span class="text-[9px] text-red-800 font-bold uppercase block">♂ Marte</span>
          <p class="text-xs font-bold text-red-950">${chart.mars.sign}</p>
          <span class="text-[10px] text-red-700 font-mono">${chart.mars.degree}</span>
        </div>
        <div class="p-2 bg-blue-50/70 border border-blue-200/80 rounded-lg">
          <span class="text-[9px] text-blue-800 font-bold uppercase block">♃ Júpiter</span>
          <p class="text-xs font-bold text-blue-950">${chart.jupiter.sign}</p>
          <span class="text-[10px] text-blue-700 font-mono">${chart.jupiter.degree}</span>
        </div>
        <div class="p-2 bg-purple-50/70 border border-purple-200/80 rounded-lg col-span-1 sm:col-span-2">
          <span class="text-[9px] text-purple-800 font-bold uppercase block">♄ Saturno</span>
          <p class="text-xs font-bold text-purple-950">${chart.saturn.sign}</p>
          <span class="text-[10px] text-purple-700 font-mono">${chart.saturn.degree}</span>
        </div>
      </div>
    </div>

    <!-- PÁGINA 3 EM DIANTE: LEITURA ARQUETÍPICA DOS 8 CAPÍTULOS -->
    <div class="mt-6">
      ${formattedAnalysis}
    </div>
  </body>
  </html>
  `;
}