import { NextRequest, NextResponse } from "next/server";
import { getCityCoordinatesAndTimezone } from "@/lib/opencage";
import { calculateBirthChart } from "@/lib/astronomy";
import { generatePdfHtml } from "@/lib/pdf-template";

export const maxDuration = 60;

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
Você é um estrategista comportamental, mentor de autogestão e terapeuta arquetípico.
Sua missão é decodificar o mapa de nascimento de ${name} e transformá-lo no documento oficial: "CÓDIGO ASTRAL: DOSSIÊ DE ENGENHARIA COMPORTAMENTAL EM 4 TRILHAS".

DADOS DE ENTRADA:
- Nome: ${name}
- Nascimento: ${birthDate} às ${birthTime}
- Local: ${geo.formattedCity} (Fuso: UTC ${geo.timezoneOffsetHours >= 0 ? `+${geo.timezoneOffsetHours}` : geo.timezoneOffsetHours})

COORDENADAS CELESTES CONFIRMADAS:
- Sol: ${chart.sun.sign} (${chart.sun.degree})
- Lua: ${chart.moon.sign} (${chart.moon.degree})
- Mercúrio: ${chart.mercury.sign} (${chart.mercury.degree})
- Vênus: ${chart.venus.sign} (${chart.venus.degree})
- Marte: ${chart.mars.sign} (${chart.mars.degree})
- Júpiter: ${chart.jupiter.sign} (${chart.jupiter.degree})
- Saturno: ${chart.saturn.sign} (${chart.saturn.degree})

DIRETRIZES DE COMUNICAÇÃO:
- Tom de voz: Analítico, empático, direto ("você"), pragmático e sem enrolação.
- Linguagem: ZERO jargão esotérico. Os graus servem apenas como referência de precisão nos títulos. Traduza tudo para tomada de decisões na vida real (carreira, dinheiro, relações e rotina).
- Foco em alavancas: Aponte onde ${name} possui vantagem competitiva inata e o que deve parar de fazer imediatamente para não queimar energia.
- RITMO DE LEITURA & PARÁGRAFOS CURTOS (REGRA MANDATÓRIA): NUNCA escreva blocos densos ou paredes de texto. Cada parágrafo DEVE TER NO MÁXIMO DE 3 A 4 LINHAS seguidas antes de quebrar com uma linha em branco. Use frases de impacto, entrelinhas arejadas e ritmo dinâmico para garantir uma leitura agradável e sem cansaço, especialmente em telas de celular.

ESTRUTURA OBRIGATÓRIA DE ENTREGA:

### SEÇÃO INICIAL: O RAIO-X EXECUTIVO DO SEU CÓDIGO (LEITURA EM 10 MINUTOS)
Escreva um sumário narrativo de 8 a 10 parágrafos CURTOS (máximo de 3 a 4 linhas cada) dando o panorama geral de quem é ${name}, sua matriz de forças, suas principais vulnerabilidades e como navegar no mundo com menos atrito e mais retorno.

---

### AS 4 TRILHAS ESTRATÉGICAS (USE OBRIGATORIAMENTE "## " NOS TÍTULOS):

## TRILHA 1: Mapeamento de Potência Financeira & Vocação
(Analise a combinação de Sol em ${chart.sun.sign}, Mercúrio em ${chart.mercury.sign} e Júpiter em ${chart.jupiter.sign}. Escreva 3 a 4 parágrafos curtos de até 3-4 linhas cada sobre onde o dinheiro flui com mais naturalidade, seu ambiente ideal de trabalho — bastidor vs. palco —, e qual é a sua alavanca real de agregação de valor).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [Sua principal força de monetização e geração de valor]
- **🌑 O Ponto de Atenção:** [A armadilha ou escassez que costuma limitar seus ganhos]
- **🧭 Ação Prática:** [Uma decisão clara e imediata para aplicar na carreira/finanças]

## TRILHA 2: Diagnóstico de Bloqueios & Padrões Cegos
(Analise a combinação de Lua em ${chart.moon.sign}, Saturno em ${chart.saturn.sign} e Marte em ${chart.mars.sign}. Escreva 3 a 4 parágrafos curtos de até 3-4 linhas cada sobre o mecanismo inconsciente de autossabotagem, o medo de falhar ou de se expor, e por que ${name} às vezes trava na hora de executar).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [Seu dom natural de resiliência e autopreservação]
- **🌑 O Ponto de Atenção:** [O ponto cego exato onde você costuma se sabotar quando está perto de crescer]
- **🧭 Ação Prática:** [O que parar de fazer imediatamente para destravar a maré]

## TRILHA 3: Matriz Relacional & Comunicação
(Analise a combinação de Vênus em ${chart.venus.sign}, Lua em ${chart.moon.sign} e Mercúrio em ${chart.mercury.sign}. Escreva 3 a 4 parágrafos curtos de até 3-4 linhas cada sobre a dinâmica de convivência, estilo autêntico de persuasão, como lida com cobranças e como blindar sua energia contra atritos com parceiros, sócios e família).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [Sua maior força de conexão e lealdade nas relações]
- **🌑 O Ponto de Atenção:** [O padrão que gera desgaste, mágoa ou afastamento com quem você convive]
- **🧭 Ação Prática:** [A regra de ouro de comunicação para praticar no dia a dia]

## TRILHA 4: Radar de Ciclos dos Próximos 12 Meses
(Analise o momento atual e projete estrategicamente os próximos 12 meses em 4 fases trimestrais de desenvolvimento. Escreva 3 a 4 parágrafos curtos de até 3-4 linhas cada apontando os momentos do ano propícios para expansão, negociações e iniciativas, e os períodos que exigem cautela e consolidação).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [A maior janela de oportunidade dos seus próximos 12 meses]
- **🌑 O Ponto de Atenção:** [O período ou comportamento que vai exigir mais vigilância e limites]
- **🧭 Ação Prática:** [Sua prioridade estratégica número 1 para este ciclo anual]

## SÍNTESE ESTRATÉGICA: O Seu Manual de Decisão Diária
(Escreva uma conclusão calorosa em 3 a 4 parágrafos curtos de até 3-4 linhas cada, integrando as 4 Trilhas em um manifesto de poder pessoal para ${name}. Enfatize que o Código Astral é um ponto de partida para viver com mais leveza, autoridade e prosperidade).
`;

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

    // 4. Monta o HTML completo (sem converter em PDF ainda)
    const fullHtml = generatePdfHtml({
      name,
      birthDate,
      birthTime,
      city: geo.formattedCity,
      chart,
      analysisText,
    });

    // 5. Devolve o HTML e o nome para o frontend
    return NextResponse.json({
      success: true,
      name,
      html: fullHtml,
    });

  } catch (error: any) {
    console.error("Erro no pipeline:", error);
    const msg = error.name === "AbortError" 
      ? "Tempo de resposta da IA excedido." 
      : (error.message || "Erro interno do servidor");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}