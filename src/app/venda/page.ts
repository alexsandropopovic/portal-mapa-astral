import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Código Astral — Seu Manual de Instruções Pessoal",
  description: "Decodificação Comportamental & Manual Pessoal em 4 Trilhas.",
};

export default function PaginaVenda() {
  return (
    <div className="font-sans antialiased overflow-x-hidden bg-[#F3F4F6] text-[#1F2937]">
      
      {/* ================================================================= */}
      {/* TOPO: IDENTIFICADOR */}
      {/* ================================================================= */}
      <div className="w-full bg-white border-b border-slate-200 py-3 text-center">
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
          MANUAL PRÁTICO DO <span className="text-indigo-900 font-extrabold">CÓDIGO ASTRAL</span> •
        </span>
      </div>

      {/* ================================================================= */}
      {/* BLOCO 1: HERO & COMPARATIVO (ANTES E DEPOIS) */}
      {/* ================================================================= */}
      <section className="w-full bg-[#ECEEF2] py-10 sm:py-16 border-b border-slate-300/80">
        <div className="max-w-3xl mx-auto px-4 text-center">
          
          <p className="text-xs sm:text-sm font-bold text-rose-700 uppercase tracking-wide mb-2">
            Sente que se esforça o dobro dos outros para colher metade dos resultados?
          </p>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight sm:leading-snug mb-4">
            Descubra o seu <span className="text-indigo-900 underline decoration-indigo-300">Manual de Instruções Pessoal</span> para parar de remar contra a maré e tomar decisões com 100% de clareza na carreira e finanças!
          </h1>

          <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <span>⚡</span> Sem jargões em latim • Leitura prática em 15 minutos
          </div>

          {/* IMAGEM COMPARATIVA: ANTES vs. DEPOIS DO CÓDIGO ASTRAL */}
          <div className="max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md border border-slate-300 bg-white">
            <img 
              src="/antes-depois.jpg" 
              alt="Antes do Código Astral vs. Depois do Código Astral" 
              className="w-full h-auto block object-cover"
              loading="eager"
            />
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 2: PROVA / RESULTADOS REAIS */}
      {/* ================================================================= */}
      <section className="w-full bg-[#E5E7EB] py-12 sm:py-16 border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <h2 className="text-base sm:text-xl font-black text-indigo-950 max-w-xl mx-auto mb-8">
            Veja abaixo relatos reais de quem consultou o seu manual com o Código Astral:
          </h2>

          {/* PRINTS DE DEPOIMENTOS NO WHATSAPP */}
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-md">
            <img 
              src="/depoimentos-whatsapp.jpg" 
              alt="Depoimentos reais de alunos e clientes do Código Astral no WhatsApp" 
              className="w-full h-auto block object-cover"
              loading="lazy"
            />
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 3: RUMINAÇÃO & DOR VISCERAL */}
      {/* ================================================================= */}
      <section className="w-full bg-[#E2E8F0] py-14 sm:py-20 border-b border-slate-300">
        <div className="max-w-3xl mx-auto px-4 text-center">
          
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Eu sei... Você se esforça todo santo dia, consome conteúdos de alta performance, mas sente que <span className="text-rose-700 font-bold">continua patinando no mesmo lugar</span>, não é mesmo?
          </p>
          
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-6">
            E você sofre todo dia com pensamentos silenciosos como...
          </p>

          {/* IMAGEM DA PERSONA COM AS RUMINAÇÕES MENTAIS */}
          <div className="max-w-xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-md border border-slate-300 bg-white">
            <img 
              src="/ruminacoes-mentais.jpg" 
              alt="Pensamentos e ruminações diárias antes do Código Astral" 
              className="w-full h-auto block object-cover"
              loading="lazy"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-md mx-auto mb-8">
            Você não aguenta mais acordar cedo, se esforçar o dobro para colher metade e ver o tempo escorrer sem clareza...
          </p>

          {/* Caixa de Alerta Vermelha */}
          <div className="bg-[#7F1D1D] text-white p-6 sm:p-8 rounded-2xl text-left sm:text-center shadow-lg border-2 border-rose-500">
            <div className="text-3xl mb-2 text-center">⚠️</div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-amber-300 text-center mb-2">
              Agora eu te pergunto...
            </h3>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-lg mx-auto">
              Se você pudesse ter acesso a um <strong>manual completo da sua configuração de fábrica</strong> que aponta onde colocar sua energia e o que parar de fazer, você colocaria em prática?
            </p>
            <p className="text-xs sm:text-sm font-bold text-white mt-4 bg-rose-900/60 py-2 px-4 rounded-lg inline-block">
              Se a sua resposta for "SIM", o CÓDIGO ASTRAL é para você!
            </p>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 4: BENEFÍCIOS (GRID DE 6 CARDS) */}
      {/* ================================================================= */}
      <section className="w-full bg-[#ECEEF2] py-14 sm:py-20 border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4">
          
          <h2 className="font-black text-xl sm:text-2xl text-slate-900 text-center mb-10">
            Com o Código Astral você vai:
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🎯</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">Destravar sua potência financeira inata</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📋</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">Saber exatamente o que parar de fazer</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🛡️</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">Desarmar seu ponto cego de autossabotagem</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🚀</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">Tomar decisões com 100% de clareza</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🤝</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">Blindar suas relações contra atritos</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🗓️</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">Planejar seus próximos 12 meses</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 5: ENTREGÁVEIS (MOCKUPS INTERCALADOS) */}
      {/* ================================================================= */}
      <section className="w-full bg-[#E5E7EB] py-14 sm:py-20 border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <h2 className="font-black text-xl sm:text-2xl text-slate-900">
              Veja o que você vai receber no seu Código Astral:
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-52 h-36 bg-indigo-900 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold p-4 text-center shadow-md">
                [ MOCKUP: DOSSIÊ 4 TRILHAS ]
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-base sm:text-lg text-slate-900 mb-1">
                  Dossiê de Engenharia Comportamental (4 Trilhas)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O livro principal que traduz suas coordenadas astronômicas em um roteiro prático para tomada de decisão: vocação, dinheiro, relacionamentos e ciclos.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row-reverse items-center gap-6">
              <div className="w-full md:w-52 h-36 bg-amber-600 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold p-4 text-center shadow-md">
                [ MOCKUP: RAIO-X NARRATIVO ]
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-base sm:text-lg text-slate-900 mb-1">
                  Raio-X Executivo em 10 Minutos
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Um sumário de leitura rápida com 8 a 10 parágrafos condensados, projetado para você entender sua matriz mesmo que não tenha tempo de ler o livro todo no primeiro dia.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-52 h-36 bg-slate-800 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold p-4 text-center shadow-md">
                [ MOCKUP: MANDALA VETORIAL ]
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-base sm:text-lg text-slate-900 mb-1">
                  Mandala Astrológica Vetorial de Alta Resolução
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A fotografia exata do céu no instante em que você chegou ao mundo. Uma representação gráfica nítida com graus, casas e aspectos planetários.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row-reverse items-center gap-6">
              <div className="w-full md:w-52 h-36 bg-rose-700 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold p-4 text-center shadow-md">
                [ MOCKUP: LUZ VS. SOMBRA ]
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-base sm:text-lg text-slate-900 mb-1">
                  Matriz de Luz vs. Sombra em Cada Planeta
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para cada astro do seu mapa, duas caixas cirúrgicas: o seu <strong>Superpoder Inato</strong> e o seu <strong>Ponto de Atenção de Autossabotagem</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 6: BÔNUS EXCLUSIVOS */}
      {/* ================================================================= */}
      <section className="w-full bg-[#0284C7] py-12 sm:py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          
          <span className="text-xs font-black uppercase tracking-widest bg-white text-sky-900 px-3 py-1 rounded-full inline-block mb-3">
            Ainda Não Acabou!
          </span>
          
          <h2 className="font-black text-xl sm:text-2xl mb-8">
            Você também vai receber de bônus:
          </h2>

          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-6 text-left">
            <div className="w-full md:w-48 h-36 bg-sky-900 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold text-center p-2">
              [ MOCKUP: RADAR 12 MESES ]
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Bônus Especial</span>
              <h3 className="font-black text-base sm:text-lg text-slate-900 mt-0.5 mb-1">
                Radar Tático dos Próximos 12 Meses
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                O cronograma mês a mês para você planejar mudanças de carreira, novos projetos ou períodos de cautela este ano.
              </p>
              <div className="text-xs text-slate-400 font-semibold line-through">De: R$ 147,00</div>
              <div className="text-xs font-bold text-emerald-600">POR: GRÁTIS HOJE</div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 7: PARA QUEM SERVE */}
      {/* ================================================================= */}
      <section className="w-full bg-[#ECEEF2] py-14 sm:py-20 border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-52 h-44 bg-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-500 font-mono text-center p-4">
              [ Foto: Pessoa no computador ]
            </div>
            <div className="flex-1">
              <h2 className="font-black text-lg sm:text-xl text-slate-900 mb-4">
                O Código Astral é para você que:
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2"><span className="text-rose-600 font-black">●</span> Sente que trabalha o dobro para colher metade dos resultados</li>
                <li className="flex items-start gap-2"><span className="text-rose-600 font-black">●</span> Não aguenta mais métodos genéricos de produtividade que só te cansam</li>
                <li className="flex items-start gap-2"><span className="text-rose-600 font-black">●</span> Quer clareza profissional e não aceita mais papéis que drenam sua energia</li>
                <li className="flex items-start gap-2"><span className="text-rose-600 font-black">●</span> Quer um manual direto no celular para consultar em 15 minutos</li>
              </ul>
              <p className="text-xs font-bold text-indigo-950 mt-5 pt-3 border-t border-slate-100">
                Enfim... Se você quer parar de remar contra a maré, toque no botão abaixo!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 8: RECAPITULANDO (TABELA DE PREÇOS CORTADOS) */}
      {/* ================================================================= */}
      <section className="w-full bg-[#E5E7EB] py-12 sm:py-16 border-b border-slate-300">
        <div className="max-w-2xl mx-auto px-4 text-center">
          
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Recapitulando...</span>
          <h2 className="font-black text-lg sm:text-xl text-slate-900 mt-1 mb-6">
            Veja tudo o que você vai receber no Código Astral:
          </h2>

          <div className="bg-white rounded-xl border border-slate-300 shadow-sm divide-y divide-slate-100 text-xs text-left">
            <div className="p-3.5 flex justify-between items-center text-slate-700">
              <span>✔ Dossiê Código Astral (4 Trilhas)</span>
              <span className="font-bold text-rose-600 line-through">R$ 147,00</span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-slate-700">
              <span>✔ Raio-X Executivo em 10 Minutos</span>
              <span className="font-bold text-rose-600 line-through">R$ 75,00</span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-slate-700">
              <span>✔ Mandala Astrológica Vetorial</span>
              <span class="font-bold text-rose-600 line-through">R$ 64,00</span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-slate-700">
              <span>✔ Matriz de Luz vs. Sombra dos Planetas</span>
              <span className="font-bold text-rose-600 line-through">R$ 45,00</span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-slate-700">
              <span>✔ BÔNUS: Radar dos Próximos 12 Meses</span>
              <span className="font-bold text-rose-600 line-through">R$ 45,00</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Tudo isso deveria custar: <span className="font-black text-rose-600 line-through text-sm">R$ 376,00</span>
          </p>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 9: VALOR / CHECKOUT PRINCIPAL */}
      {/* ================================================================= */}
      <section id="oferta" className="w-full bg-[#0284C7] py-14 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          
          <p className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-6">
            Mas hoje você tem acesso ao Código Astral junto com todos os bônus por apenas:
          </p>

          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl shadow-card max-w-xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-48 h-44 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-xs font-mono text-slate-400 p-4 text-center">
              [ Mockup do Bundle ]
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">CÓDIGO ASTRAL</span>
              <div className="text-xs text-slate-500 line-through mt-1">De R$ 376,00 por:</div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 my-1">
                9x de 8,80
              </div>
              <p className="text-xs text-slate-500 font-semibold mb-4">ou 67,00 à vista</p>

              <a href="#checkout" className="block w-full bg-[#059669] hover:bg-[#047857] text-white font-black text-sm uppercase py-3.5 px-6 rounded-lg text-center shadow-md transition">
                QUERO MEU CÓDIGO ASTRAL
              </a>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-[10px] text-slate-400 font-medium">
                <span>🔒 Compra Segura</span>
                <span>•</span>
                <span>🛡️ Satisfação Garantida</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 10: COMO ACESSAR */}
      {/* ================================================================= */}
      <section className="w-full bg-white py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <h3 className="font-black text-base sm:text-lg text-slate-900 mb-8">
            Compre agora e receba seu acesso no e-mail imediatamente!
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-2xl mb-2">✉️</div>
              <h4 className="font-bold text-xs uppercase text-slate-900 mb-1">Faça sua compra</h4>
              <p className="text-xs text-slate-500">Assim que finalizar sua compra, você recebe seu acesso na hora por e-mail.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-2xl mb-2">📲</div>
              <h4 className="font-bold text-xs uppercase text-slate-900 mb-1">Acesse todo o material</h4>
              <p className="text-xs text-slate-500">Visualize direto no celular ou baixe o livro completo em PDF para ler quando quiser.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-bold text-xs uppercase text-slate-900 mb-1">Tudo pronto!</h4>
              <p className="text-xs text-slate-500">Agora é só consultar seu manual e tomar decisões com 100% de clareza e sem remar contra a maré.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 11: AUTORIDADE */}
      {/* ================================================================= */}
      <section className="w-full bg-[#161B26] py-14 sm:py-20 border-b border-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="bg-[#10141E] p-6 sm:p-10 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-md">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-800 border-2 border-amber-500/40 flex items-center justify-center shrink-0 text-3xl font-serif font-bold text-amber-400">
              CA
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Metodologia Exclusiva</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1 mb-2">Sobre o Método Código Astral</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                O Código Astral nasceu da inconformidade com relatórios genéricos que não ajudam na vida real. Combinando precisão astronômica matemática e psicologia arquetípica analítica, o método foi desenhado para quem precisa de clareza estratégica e não tem tempo a perder com misticismo vazio.
              </p>
              <p className="text-xs text-slate-400">Uma ponte entre a sabedoria milenar do céu e as decisões práticas do seu dia a dia.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 12: CONVERSA SÉRIA (DUAS OPÇÕES) */}
      {/* ================================================================= */}
      <section className="w-full bg-[#ECEEF2] py-14 sm:py-20 border-b border-slate-300">
        <div className="max-w-2xl mx-auto px-4 text-center">
          
          <h2 className="font-black text-xl sm:text-2xl text-slate-900 mb-6">
            Agora, você tem duas opções:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
            <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-xl">
              <span className="text-rose-600 font-black text-xs uppercase flex items-center gap-1 mb-1">
                <span>✕</span> Opção 1
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Continuar sofrendo com a sensação de estar sempre remando contra a maré, testando métodos que não combinam com você e operando no escuro.
              </p>
            </div>

            <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
              <span className="text-emerald-700 font-black text-xs uppercase flex items-center gap-1 mb-1">
                <span>✓</span> Opção 2
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Investir menos de R$ 70,00 e finalmente consultar sua configuração de fábrica para tomar decisões com 100% de clareza na carreira e finanças.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-4">
            Eu sei (e você também sabe): <strong>a opção 2 é a mais inteligente e é a que você mais precisa</strong>.
          </p>

          <a href="#oferta" className="inline-block bg-[#059669] hover:bg-[#047857] text-white font-black text-xs uppercase py-3.5 px-8 rounded-lg transition shadow-md">
            GARANTA SEU ACESSO AGORA!
          </a>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 13: VALOR (REPETIÇÃO) */}
      {/* ================================================================= */}
      <section className="w-full bg-[#0284C7] py-14 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl shadow-card max-w-xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-48 h-44 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-xs font-mono text-slate-400 p-4 text-center">
              [ Mockup do Bundle ]
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">CÓDIGO ASTRAL</span>
              <div className="text-xs text-slate-500 line-through mt-1">De R$ 376,00 por:</div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 my-1">
                9x de 8,80
              </div>
              <p className="text-xs text-slate-500 font-semibold mb-4">ou 67,00 à vista</p>

              <a href="#checkout" className="block w-full bg-[#059669] hover:bg-[#047857] text-white font-black text-sm uppercase py-3.5 px-6 rounded-lg text-center shadow-md transition">
                QUERO MEU CÓDIGO ASTRAL
              </a>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-[10px] text-slate-400 font-medium">
                <span>🔒 Compra Segura</span>
                <span>•</span>
                <span>🛡️ Satisfação Garantida</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 14: PERGUNTAS FREQUENTES (FAQ) */}
      {/* ================================================================= */}
      <section className="w-full bg-white py-14 sm:py-20 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4">
          
          <h2 className="font-black text-xl sm:text-2xl text-slate-900 text-center mb-8">
            Perguntas Frequentes
          </h2>

          <div className="space-y-3">
            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center list-none">
                <span>Preciso saber meu horário exato de nascimento?</span>
                <span className="text-indigo-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                O horário exato garante 100% de precisão no Ascendente e na Lua. Caso tenha apenas uma estimativa aproximada, as coordenadas dos planetas principais ainda entregam mais de 80% de todos os insights vocacionais e comportamentais.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center list-none">
                <span>Como e quando eu recebo o acesso?</span>
                <span className="text-indigo-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                O acesso é imediato! Assim que seu pagamento for aprovado, você é redirecionado na mesma hora para visualizar seu guia no navegador e também recebe o link para baixar o livro completo em PDF.
              </p>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer">
              <summary className="font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center list-none">
                <span>Como funciona a garantia de 7 dias?</span>
                <span className="text-indigo-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Você tem 7 dias para ler o material. Se achar que o conteúdo é vago ou não te trouxe clareza prática, basta solicitar o reembolso na plataforma com um clique para receber 100% do seu dinheiro de volta.
              </p>
            </details>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* BLOCO 15: RODAPÉ */}
      {/* ================================================================= */}
      <footer className="w-full bg-[#0F172A] py-10 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-bold text-slate-200">CÓDIGO ASTRAL • TODOS OS DIREITOS RESERVADOS</p>
          <p className="text-[11px] text-slate-400">Tem dúvidas? Entre em contato: suporte@codigoastral.com.br</p>
          <p className="max-w-md mx-auto text-[10px] leading-relaxed text-slate-500">
            Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site.
          </p>
          <div className="flex justify-center gap-4 text-[10px] pt-1 text-slate-400">
            <a href="#" className="hover:text-white transition">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Políticas de Privacidade</a>
          </div>
        </div>
      </footer>

    </div>
  );
}