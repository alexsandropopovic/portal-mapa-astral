import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinatesAndTimezone } from "@/lib/opencage";
import { calculateBirthChart } from "@/lib/astronomy";
import { generatePdfHtml } from "@/lib/pdf-template";

export const maxDuration = 60; // Timeout máximo da Vercel

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate, birthTime, city } = await req.json();

    if (!name || !birthDate || !birthTime || !city) {
      return NextResponse.json({ error: "Dados incompletos informados." }, { status: 400 });
    }

    // 1. Coordenadas e Fuso Horário
    const geo = await getCityCoordinatesAndTimezone(city);

    // 2. Cálculo Astronômico exato
    const chart = calculateBirthChart(birthDate, birthTime, geo.timezoneOffsetHours);

    // 3. Chamada ao OpenRouter
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY não configurada na Vercel." }, { status: 500 });
    }

    const selectedModel = process.env.AI_MODEL || "openai/gpt-4o-mini";

    const prompt = `
Você é um mentor de autoconhecimento empático, acolhedor e profundo. Sua missão é transformar dados astrológicos em um guia pessoal prático, transformador e fácil de entender para uma pessoa leiga.

DADOS DA PESSOA:
- Nome: ${name}
- Nascimento: ${birthDate} às ${birthTime}
- Cidade: ${geo.formattedCity} (UTC ${geo.timezoneOffsetHours >= 0 ? `+${geo.timezoneOffsetHours}` : geo.timezoneOffsetHours})

POSICIONAMENTOS:
- Sol: ${chart.sun.sign} a ${chart.sun.degree}
- Lua: ${chart.moon.sign} a ${chart.moon.degree}
- Mercúrio: ${chart.mercury.sign} a ${chart.mercury.degree}
- Vênus: ${chart.venus.sign} a ${chart.venus.degree}
- Marte: ${chart.mars.sign} a ${chart.mars.degree}
- Júpiter: ${chart.jupiter.sign} a ${chart.jupiter.degree}
- Saturno: ${chart.saturn.sign} a ${chart.saturn.degree}

DIRETRIZES DE COMUNICAÇÃO (OBRIGATÓRIO):
- Tom de voz: Acolhedor, intimista, direto ("você"), empático e encorajador.
- Linguagem: Zero jargão técnico. Mantenha os graus apenas como referência de precisão astronômica nos títulos/cabeçalhos, mas NUNCA gaste tempo explicando termos herméticos (como "quadraturas", "trígonos", "casas astrológicas", "orbe" ou latinismos).
- Foco na vida real: Traduza cada planeta para uma área prática do cotidiano (trabalho, relacionamentos, emoções, decisões e finanças).
- Conexão emocional: Valide as dores e os sentimentos do leitor antes de apontar caminhos de melhoria.

ESTRUTURA DE ENTREGA:

### SEÇÃO INICIAL: O RAIO-X COMPLETO DO SEU MAPA (LEITURA RÁPIDA)
Antes dos capítulos detalhados, escreva OBRIGATORIAMENTE um sumário narrativo de 8 a 10 parágrafos, projetado para que o cliente compreenda toda a sua jornada mesmo que não leia o livro todo. Cada parágrafo deve abordar diretamente uma área essencial do mapa:
1. Boas-vindas calorosas e visão geral sobre quem é ${name}.
2. Identidade e propósito central (Sol).
3. Emoções, carências e paz interior (Lua).
4. Padrão mental, tomada de decisões e comunicação (Mercúrio).
5. Vida afetiva, relacionamentos e o que valoriza (Vênus).
6. Garra diária, iniciativa e gestão de conflitos (Marte).
7. Caminho de expansão, oportunidades e abundância (Júpiter).
8. Desafios, limites, medos a superar e maturidade (Saturno).
9. O grande ponto cego / principal autossabotagem a vigiar.
10. Mensagem síntese de fechamento para aplicar imediatamente na rotina.

---

### CAPÍTULOS DETALHADOS (8 CAPÍTULOS INICIANDO COM "## ")

Para os Capítulos de 1 a 7, siga rigorosamente esta estrutura interna:
1. Dois parágrafos fluidos, empáticos e profundos explicando como essa energia se manifesta no comportamento, sentimentos e escolhas reais da pessoa.
2. Três seções obrigatórias em tópicos destacados:
   - **🌟 O Seu Maior Talento:** [O dom natural mais forte que ela carrega aqui, explicado de forma clara e inspiradora]
   - **🌑 O Ponto de Atenção:** [A armadilha ou autossabotagem comum do dia a dia, explicada com empatia, sem julgamentos]
   - **🧭 Ação Prática:** [Um exercício simples, hábito ou conselho imediato para aplicar na rotina]

TÍTULOS DOS CAPÍTULOS:
## Capítulo 1: Sua Identidade Essencial e Propósito de Vida (Sol em ${chart.sun.sign} a ${chart.sun.degree})
## Capítulo 2: O Seu Mundo Emocional e a Busca por Segurança (Lua em ${chart.moon.sign} a ${chart.moon.degree})
## Capítulo 3: O Seu Modo de Pensar, Aprender e se Comunicar (Mercúrio em ${chart.mercury.sign} a ${chart.mercury.degree})
## Capítulo 4: A Sua Maneira de Amar e o Que Você Realmente Valoriza (Vênus em ${chart.venus.sign} a ${chart.venus.degree})
## Capítulo 5: Sua Força de Ação, Coragem e Motivação Diária (Marte em ${chart.mars.sign} a ${chart.mars.degree})
## Capítulo 6: Onde a Vida Te Abre Portas e Traz Prosperidade (Júpiter em ${chart.jupiter.sign} a ${chart.jupiter.degree})
## Capítulo 7: Suas Responsabilidades, Amadurecimento e Segurança (Saturno em ${chart.saturn.sign} a ${chart.saturn.degree})
## Capítulo 8: A Sua Mensagem Final de Transformação
(No Capítulo 8, escreva uma conclusão calorosa integrando tudo o que foi dito. Reforce que o mapa é um ponto de partida para o crescimento e deixe uma mensagem inspiradora direcionada a ${name}).
`;

    // Timeout de 45s de proteção
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com",
        "X-Title": "Portal Astral Pro",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 3800,
        // DESABILITA O MODO REASONING / THINKING TOKENS NO OPENROUTER:
        reasoning: {
          effort: "none",
          exclude: true,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
        "Content-Disposition": `attachment; filename="Guia-Autoconhecimento-${encodeURIComponent(name)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Erro no pipeline:", error);
    const msg = error.name === "AbortError" 
      ? "Tempo de resposta da IA excedido." 
      : (error.message || "Erro interno do servidor");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}