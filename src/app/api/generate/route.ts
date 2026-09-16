import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinatesAndTimezone } from "@/lib/opencage";
import { calculateBirthChart } from "@/lib/astronomy";
import { generatePdfHtml } from "@/lib/pdf-template";
import { uploadPdfToR2 } from "@/lib/r2";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate, birthTime, city } = await req.json();

    if (!name || !birthDate || !birthTime || !city) {
      return NextResponse.json({ error: "Dados incompletos informados." }, { status: 400 });
    }

    // 1. OpenCage
    const geo = await getCityCoordinatesAndTimezone(city);

    // 2. Astronomy Engine
    const chart = calculateBirthChart(birthDate, birthTime, geo.timezoneOffsetHours);

    // 3. OpenRouter [Claude 3.5 Haiku]
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY ausente." }, { status: 500 });
    }

    const prompt = `
Você é um astrólogo renomado, com vasta experiência em psicologia analítica jungiana e arquétipos.
Elabore um livro completo e profundo de Mapa Astral Natal para:

Nome: ${name}
Nascimento: ${birthDate} às ${birthTime}
Local: ${geo.formattedCity} (Fuso horário calculado: UTC ${geo.timezoneOffsetHours >= 0 ? `+${geo.timezoneOffsetHours}` : geo.timezoneOffsetHours})

Posicionamentos celestes exatos:
- Sol: ${chart.sun.sign} a ${chart.sun.degree}
- Lua: ${chart.moon.sign} a ${chart.moon.degree}
- Mercúrio: ${chart.mercury.sign} a ${chart.mercury.degree}
- Vênus: ${chart.venus.sign} a ${chart.venus.degree}
- Marte: ${chart.mars.sign} a ${chart.mars.degree}
- Júpiter: ${chart.jupiter.sign} a ${chart.jupiter.degree}
- Saturno: ${chart.saturn.sign} a ${chart.saturn.degree}

Estruture a resposta com rigor, usando exatamente 8 capítulos detalhados (use "## " nos títulos para permitir quebra de página automática):

## Capítulo 1: O Propósito Solar e a Consciência (Sol em ${chart.sun.sign})
(Desenvolva a jornada do herói, o ego consciente e a missão de vida em 2 a 3 parágrafos densos)

## Capítulo 2: As Raízes da Alma e a Segurança Afetiva (Lua em ${chart.moon.sign})
(Aborde a nutrição emocional, os padrões de infância e o mundo subjetivo)

## Capítulo 3: A Mente Racional e os Processos Cognitivos (Mercúrio em ${chart.mercury.sign})
(Estilo de pensamento, aprendizado, comunicação e expressão intelectual)

## Capítulo 4: A Linguagem do Amor, Afeto e Valores (Vênus em ${chart.venus.sign})
(Como se relaciona, o que valoriza esteticamente e como atrai abundância e parcerias)

## Capítulo 5: O Impulso Vital, Ambição e Coragem (Marte em ${chart.mars.sign})
(Força de vontade, capacidade de conquista, tomada de ação e sexualidade)

## Capítulo 6: O Caminho da Expansão e Sabedoria (Júpiter em ${chart.jupiter.sign})
(Onde reside a sorte, as oportunidades de crescimento e a visão espiritual de mundo)

## Capítulo 7: Os Limites Estruturantes, Medos e Maestria (Saturno em ${chart.saturn.sign})
(As cobranças internas, o amadurecimento ao longo do tempo e os maiores aprendizados de disciplina)

## Capítulo 8: Síntese Arquetípica e Recomendações Práticas
(Integre as energias contraditórias em conselhos acionáveis de autodesenvolvimento)
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
        model: "anthropic/claude-3.5-haiku",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Erro OpenRouter: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0]?.message?.content || "Análise indisponível.";

    // 4. PDFShift
    const pdfShiftApiKey = process.env.PDFSHIFT_API_KEY;
    if (!pdfShiftApiKey) {
      return NextResponse.json({ error: "PDFSHIFT_API_KEY ausente." }, { status: 500 });
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

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // 5. Cloudflare R2
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const downloadUrl = await uploadPdfToR2(pdfBuffer, `mapa-${safeName}.pdf`);

    return NextResponse.json({
      success: true,
      downloadUrl,
      city: geo.formattedCity,
      timezone: geo.timezoneOffsetHours,
    });

  } catch (error: any) {
    console.error("Erro no pipeline:", error);
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 });
  }
}