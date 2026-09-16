import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinatesAndTimezone } from "@/lib/opencage";
import { calculateBirthChart } from "@/lib/astronomy";
import { generatePdfHtml } from "@/lib/pdf-template";

export const maxDuration = 60; // Timeout estendido na Vercel

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate, birthTime, city } = await req.json();

    if (!name || !birthDate || !birthTime || !city) {
      return NextResponse.json({ error: "Dados incompletos informados." }, { status: 400 });
    }

    // 1. Coordenadas e Fuso Horário (com fallback automático para UTC-3)
    const geo = await getCityCoordinatesAndTimezone(city);

    // 2. Cálculo Astronômico exato
    const chart = calculateBirthChart(birthDate, birthTime, geo.timezoneOffsetHours);

    // 3. Seleção dinâmica do modelo de IA via variável de ambiente
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY não configurada na Vercel." }, { status: 500 });
    }

    // Se você definir AI_MODEL na Vercel, ele usa o que você escolher; caso contrário, usa o Claude 3.5 Haiku
    const selectedModel = process.env.AI_MODEL || "anthropic/claude-3.5-haiku";

    const prompt = `
Você é um astrólogo renomado especializado em psicologia arquetípica.
Elabore um livro completo de Mapa Astral Natal para:

Nome: ${name}
Nascimento: ${birthDate} às ${birthTime}
Local: ${geo.formattedCity} (Fuso: UTC ${geo.timezoneOffsetHours >= 0 ? `+${geo.timezoneOffsetHours}` : geo.timezoneOffsetHours})

Posicionamentos celestes:
- Sol: ${chart.sun.sign} a ${chart.sun.degree}
- Lua: ${chart.moon.sign} a ${chart.moon.degree}
- Mercúrio: ${chart.mercury.sign} a ${chart.mercury.degree}
- Vênus: ${chart.venus.sign} a ${chart.venus.degree}
- Marte: ${chart.mars.sign} a ${chart.mars.degree}
- Júpiter: ${chart.jupiter.sign} a ${chart.jupiter.degree}
- Saturno: ${chart.saturn.sign} a ${chart.saturn.degree}

Estruture a resposta com rigor em exatamente 8 capítulos (use "## " nos títulos para permitir quebra de página automática):
## Capítulo 1: O Propósito Solar e a Consciência (Sol em ${chart.sun.sign})
## Capítulo 2: As Raízes da Alma e a Segurança Afetiva (Lua em ${chart.moon.sign})
## Capítulo 3: A Mente Racional e os Processos Cognitivos (Mercúrio em ${chart.mercury.sign})
## Capítulo 4: A Linguagem do Amor, Afeto e Valores (Vênus em ${chart.venus.sign})
## Capítulo 5: O Impulso Vital, Ambição e Coragem (Marte em ${chart.mars.sign})
## Capítulo 6: O Caminho da Expansão e Sabedoria (Júpiter em ${chart.jupiter.sign})
## Capítulo 7: Os Limites Estruturantes e Maestria (Saturno em ${chart.saturn.sign})
## Capítulo 8: Síntese Arquetípica e Recomendações Práticas
`;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com",
        "X-Title": "Gerador de Mapa Astral Pro",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
		reasoning: {
          effort: "none",
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Erro OpenRouter (${selectedModel}): ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0]?.message?.content || "Análise indisponível.";

    // 4. Compilação do PDF com a Mandala SVG no PDFShift
    const pdfShiftApiKey = process.env.PDFSHIFT_API_KEY;
    if (!pdfShiftApiKey) {
      return NextResponse.json({ error: "PDFSHIFT_API_KEY não configurada na Vercel." }, { status: 500 });
    }

    const fullHtml = generatePdfHtml({
      name,
      birthDate,
      birthTime,
      city: geo.formattedCity,
      chart,
      analysisText,
    });

    const pdfResponse = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`api:${pdfShiftApiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: fullHtml,
        format: "A4",
        margin: "0px",
      }),
    });

    if (!pdfResponse.ok) {
      const pdfError = await pdfResponse.text();
      throw new Error(`Erro PDFShift: ${pdfError}`);
    }

    // 5. Download direto do PDF no navegador
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Mapa-Astral-${encodeURIComponent(name)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Erro no pipeline:", error);
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
  }
}