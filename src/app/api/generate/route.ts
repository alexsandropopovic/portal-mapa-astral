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
Você é um astrólogo de linhagem psicológica e arquetípica, profundamente versado na sabedoria de Carl Jung e nos mistérios da alma humana.
Sua missão é interpretar a tapeçaria celeste de ${name} e compor o seu documento prático: "CÓDIGO ASTRAL: O GUIA DAS 4 TRILHAS DA SUA JORNADA".

DADOS DE ENTRADA:
- Nome: ${name}
- Nascimento: ${birthDate} às ${birthTime}
- Local: ${geo.formattedCity} (Fuso: UTC ${geo.timezoneOffsetHours >= 0 ? `+${geo.timezoneOffsetHours}` : geo.timezoneOffsetHours})

AS COORDENADAS CELESTES NO INSTANTE DO SEU PRIMEIRO SUSPIRO:
- Sol: ${chart.sun.sign} (${chart.sun.degree})
- Lua: ${chart.moon.sign} (${chart.moon.degree})
- Mercúrio: ${chart.mercury.sign} (${chart.mercury.degree})
- Vênus: ${chart.venus.sign} (${chart.venus.degree})
- Marte: ${chart.mars.sign} (${chart.mars.degree})
- Júpiter: ${chart.jupiter.sign} (${chart.jupiter.degree})
- Saturno: ${chart.saturn.sign} (${chart.saturn.degree})

DIRETRIZES FUNDAMENTAIS DE ESCRITA:
- TOM DE VOZ: Profundo, empatico íntimo, acolhedor e revelador. Trate o mapa como um espelho da alma, onde o céu visível revela a paisagem invisível de quem ${name} nasceu para ser.
- VOCABULÁRIO PROIBIDO: NUNCA use jargões corporativos de coaching ou gestão de empresas (PROIBIDO usar palavras como "processos", "precificar", "entregas", "alta performance", "monetização", "RH", "alavancagem").Nem jargões técnicos. a linguagem deve simples, pois o leitor não tem conhecimentos de astrologia.
- VOCABULÁRIO ACOLHIDO: Fale de vocação, dons inatos, fertilidade, prosperidade, o chamado da alma, o templo das relações, a sabedoria do tempo, luz e sombra.
- RITMO DE LEITURA (OBRIGATÓRIO): Mantenha parágrafos respiráveis e escaneáveis (máximo de 3 a 4 linhas por parágrafo com quebra dupla de linha).

ESTRUTURA DE ENTREGA:

### SEÇÃO INICIAL: O RAIO-X DA SUA ALMA (LEITURA EM 10 MINUTOS)
Escreva um prelúdio emocionante de 8 a 10 parágrafos curtos (máximo de 3 a 4 linhas cada), acolhendo ${name} com reverência e ternura. Apresente a essência do seu ser: a dança entre sua mente, sua necessidade de segurança, seu modo de amar e o grande propósito de vida que sua alma veio cumprir neste mundo.

---

### AS 4 TRILHAS DA SUA JORNADA (USE OBRIGATORIAMENTE "## " NOS TÍTULOS):

## TRILHA 1: A Vocação Sagrada & A Rota da Abundância
(Entrelace as energias do Sol em ${chart.sun.sign}, de Mercúrio em ${chart.mercury.sign} e a bênção de Júpiter em ${chart.jupiter.sign}. Escreva 3 a 4 parágrafos curtos, objetivos e límpidos sobre a verdadeira vocação de ${name}, onde reside sua dignidade e realização no mundo, e como sua prosperidade floresce naturalmente quando seu trabalho reflete sua verdade interior).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [O dom sagrado e a força natural de manifestação que o céu lhe concedeu]
- **🌑 O Ponto de Atenção:** [A armadilha da escassez ou a dúvida que bloqueia o fluxo da sua prosperidade]
- **🧭 Ação Prática:** [Um passo simples e consciente para alinhar sua vocação no cotidiano]

## TRILHA 2: Os Mistérios da Sombra & O Ponto Cego Inconsciente
(Entrelace o mar emocional da Lua em ${chart.moon.sign}, a firmeza de Saturno em ${chart.saturn.sign} e a espada de Marte em ${chart.mars.sign}. Escreva 3 a 4 parágrafos tocantes sobre os medos ancestrais, o perfeccionismo ou a autoproteção excessiva que fazem ${name} recuar antes da vitória. Fale com verdade e compaixão).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [A resiliência de ouro forjada nas suas provações pessoais]
- **🌑 O Ponto de Atenção:** [A ferida da sombra onde você costuma se sabotar ou se esconder do mundo]
- **🧭 Ação Prática:** [O padrão que você deve desatar e soltar para recuperar sua paz de espírito]

## TRILHA 3: O Templo dos Afetos & A Dança das Conexões
(Entrelace a beleza de Vênus em ${chart.venus.sign}, as necessidades secretas da Lua em ${chart.moon.sign} e a ponte de Mercúrio em ${chart.mercury.sign}. Escreva 3 a 4 parágrafos profundos sobre como ${name} ama, o que seu coração exige para se abrir com confiança e como construir pontes afetivas sem anular sua própria individualidade).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [A nobreza do seu afeto e o que você desperta de mais belo nos outros]
- **🌑 O Ponto de Atenção:** [A exigência ou o silêncio que podem erguer muralhas nas suas relações]
- **🧭 Ação Prática:** [Um gesto diário de amor-próprio e diálogo verdadeiro com quem você ama]

## TRILHA 4: O Radar dos Ciclos & A Roda do Tempo (Próximos 12 Meses)
(Escreva sobre o fluxo das estações da sua vida nos próximos 12 meses, divididos em 4 portais trimestrais. Mostre que a vida tem primaveras de desabrochar iniciativas e invernos de silêncio e colheita. Escreva 3 a 4 parágrafos sobre quando ousar e quando confiar no ritmo do tempo).
OBRIGATÓRIO INCLUIR OS 3 CARDS:
- **🌟 O Seu Maior Talento:** [A estação mais luminosa e fértil do seu ano para expandir]
- **🌑 O Ponto de Atenção:** [O período que pedirá discernimento, paciência e recolhimento]
- **🧭 Ação Prática:** [O compromisso de alma que guiará todos os seus passos nos próximos 12 meses]

## SÍNTESE ESTRATÉGICA: O Manifesto da Sua Luz Pessoal
(Escreva um encerramento solene e inspirador em 3 parágrafos curtos integrando todas as forças celestes. Reafirme a ${name} que as estrelas inclinam, mas a consciência humana constrói o destino. Deixe uma bênção de coragem, clareza e paz).
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