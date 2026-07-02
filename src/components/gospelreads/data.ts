/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Chapter } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'O Guardião das Estrelas',
    author: 'Luana Costa',
    genre: 'Fantasia',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyAIxAGZEPl9CVBFa5WCdpwBAIb2fXExDVoPqkP96n1WTY-jfUMCN9tai8HHTRYkqMknL8Y-cEbSdICaYTDOEOic0-tuCK_nQrvA1NgQg2KFO7lEze7NrWbZ7gMMwgeEgsk4suZ381B-pzUZS2-eGw7o8AZiyi4D1ZU-I1_H8vJVm5uF00t7VS1U--tXth2klMXstnyodnxMm4daoG3YIl_Ft87hWTt70BkSSOLBNfSaQvBAiCR4m7U_VQI0WleP1DS2Vltbw6UQw',
    description: 'Nas profundezas da nebulosa de Orion, um antigo farol espacial guarda as fronteiras do universo conhecido. Quando as luzes começam a piscar, um jovem cartógrafo estelar deve assumir o manto do guardião antes que a escuridão consuma tudo.',
    rating: 4.8,
    price: 24.90,
    reviewCount: 142,
    year: 2024,
    sampleText: 'Capítulo I: O Farol Inerte\n\nA poeira estelar batia suavemente contra as placas de titânio do Farol de Orion. Para Lucius, aquele som era o ritmo de sua própria respiração. Há três décadas, ele mantinha os filamentos de plasma em perfeita sintonia, mas naquela noite, as leituras de energia térmica caíram a níveis nunca antes vistos...\n\nEle sabia o que aquilo significava. O guardião anterior havia avisado que as estrelas frias despertariam um dia.',
    reviews: [
      { id: 'r1', authorName: 'Carlos M.', rating: 5, content: 'Uma fantasia espacial extraordinária! Os detalhes científicos misturados com magia me prenderam do início ao fim.', date: '2026-06-15' },
      { id: 'r2', authorName: 'Juliana S.', rating: 4, content: 'Excelente desenvolvimento de personagens e um final de tirar o fôlego. Recomendo muito!', date: '2026-06-20' }
    ]
  },
  {
    id: '2',
    title: 'Cidade de Vidro',
    author: 'Marcos Silva',
    genre: 'Ficção Científica',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQH1B0n8RDiaeGl9C-xrAi23FDW22RbXoml8X7Ng41P_Cs5pthWdEf3nPlo5RPSsDs0RRnuMkHHGSf3hJj4YK5lZYq8Mln9m05smqlJmluqZswOlu1WQUpynirnzTM8Rv4hIePlc6SoCOKHsAzDqiQ8VvPxE5aa4ocYDJTsoBOV2s_U8tN2ma_cqcFxRl8xXnAERrx8qHmzhzTczjQW4YDgXKb9VdaFP8R0nFO_EJMczSB1zXQFbG2QSd7VlpKNcDQjtYzWQRDq1E',
    description: 'Em uma metrópole onde todas as paredes são feitas de polímeros transparentes e a privacidade foi abolida por lei, uma arquiteta descobre uma conspiração que ameaça quebrar a própria infraestrutura física de sua realidade cristalina.',
    rating: 4.6,
    price: 19.90,
    reviewCount: 98,
    year: 2024,
    sampleText: 'Capítulo I: Sem Sombras\n\nNão havia onde esconder um segredo em Veridia. As paredes do quarto de Helena reluziam sob o sol da manhã, refratando o espectro de luz em tons lilás. Cada movimento seu era monitorado pelas lentes convexas integradas aos pilares.\n\nE no entanto, em sua mão direita, envolta por um pedaço de pano fosco de carbono, ela segurava o único objeto opaco que restava na cidade.',
    reviews: [
      { id: 'r3', authorName: 'Mariana Lima', rating: 5, content: 'Uma distopia incrível! A escrita de Marcos nos faz questionar os limites da tecnologia e da intimidade.', date: '2026-05-10' }
    ]
  },
  {
    id: '3',
    title: 'Amanhã Será Melhor',
    author: 'André Santos',
    genre: 'Desenvolvimento Pessoal',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwIRiVVB_J0g0IqN6tchCzC3iB8RErNySAR0UQDMiLOUUy0rYKp9P4Kj_RZtCYgIWdEOAEV-30ie6cY7GWiOFSL_ctVAAEXbBmfAFKglN0iuTL5z9vTR1wnFLSx6-bylpuITdxC2hJuIewd2vRhnnJGLRRiEC89oLwIxtjGIrq5r_QqSPRd2ogcTHLvPIecm-ggUAAP44FKQRUGWzBxEJ8tyCv-fKUzWepsgxCRTlJHD16EGLEpTKBgRRpg05Kc9_Zh1r4wDUCtIg',
    description: 'Um guia compassivo e prático sobre resiliência emocional, hábitos atômicos cotidianos e como encontrar esperança e estabilidade em tempos de rápidas transformações sociais e incertezas globais.',
    rating: 4.9,
    price: 29.90,
    reviewCount: 215,
    year: 2024,
    sampleText: 'Introdução: O Poder do Micro-Passo\n\nA grande ilusão da mudança reside na busca pelo salto heróico. Nós assistimos a filmes e lemos histórias onde heróis superam crises de um dia para o outro. Mas a vida real opera sob a lei dos juros compostos da atenção.\n\nEste livro não é sobre como revolucionar sua rotina amanhã, mas sobre como acolher a imperfeição de hoje.',
    reviews: [
      { id: 'r4', authorName: 'Patricia F.', rating: 5, content: 'Este livro mudou minha forma de encarar os fracassos diários. Leitura obrigatória e reconfortante.', date: '2026-06-01' }
    ]
  },
  {
    id: '4',
    title: 'Estratégia & Futuro',
    author: 'Aluroja Rrmer',
    genre: 'Negócios',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkmDOw9yWk-SCC0-sAk9V9rQZ0LKC5Gk7aNX1-LwincboNeZ5INgPfTphfX7VYdPgiJEoGnDN09vbpyOOCINmbYwFuUFGMhHpYm_19sK4oseFlavIN8HIQ5lxpjX0MBM54H4hDXJ2NHQvZWIM9pQrSopIhG2ISMO5t-BXEzaPeAUtZ_1Edrz0u3u49EnIK7b3CiHMrdWGCkLyAjLYLlXno5mIIi0GqbTKAz-RT2bAO75s5pvrPv-YWK-GijEAooQWrnpv90xCj45c',
    description: 'Análise profunda sobre a convergência da inteligência artificial aplicada, modelos de governança descentralizada e as estratégias organizacionais essenciais para prosperar na próxima revolução de mercado.',
    rating: 4.7,
    price: 34.90,
    reviewCount: 76,
    year: 2024,
    sampleText: 'Capítulo I: Descentralização Produtiva\n\nNo século passado, a vantagem competitiva pertencia à escala física e à centralização operacional. Hoje, a agilidade reside na capacidade de processamento de dados nas bordas. Organizações exponenciais não possuem ativos fixos pesados; elas orquestram fluxos de valor de forma orgânica e em tempo real.',
    reviews: [
      { id: 'r5', authorName: 'Gustavo T.', rating: 4, content: 'Visão pragmática e fundamentada do futuro do trabalho e da liderança tecnológica.', date: '2026-04-18' }
    ]
  },
  {
    id: '5',
    title: 'Amor ao Pôr do Sol',
    author: 'Ronvella Bremielz',
    genre: 'Romance',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJM9sOl6oSWUVXyK67ZjG7ED8Gmo0hMGZIKMZuxh5z4NhN_wVcxP7FCHT5cn1alExQ4HQFxkFK80EHpTdtxKi1B2HQcpbx759IOfV4OWhlGOolLuOIFaLPG0mL8H6g9cmnll1TF_KG-gMEt1LqXexCx_c2hSFzFUmj9fsFRdLwOdLJD4aqsBbKaUWUcPHJPUhHys1rv_V1i7mjiM5lehqqsQANPoOLzk54PQcx9atftikTZRc8LSSpt-0EDRSAka2nmoRiri7iOog',
    description: 'Nas falésias ensolaradas do Algarve, dois estranhos com passados marcados por perdas inesperadas compartilham um chalé à beira-mar, redescobrindo a beleza das pequenas conexões e a vulnerabilidade do recomeço.',
    rating: 4.5,
    price: 21.90,
    reviewCount: 112,
    year: 2024,
    sampleText: 'Capítulo I: O Som da Maré\n\nClarice puxou o xale sobre os ombros à medida que o sol mergulhava no Atlântico. O céu pintava-se de âmbar, rosa e dourado, uma tela efêmera que desapareceria em minutos. Na casa ao lado, o violoncelo que começara a tocar há três dias repetiu uma melodia suave, quase melancólica, como se estivesse conversando com as ondas.',
    reviews: [
      { id: 'r6', authorName: 'Beatriz G.', rating: 5, content: 'Poético, tocante e profundamente humano. Impossível ler sem se emocionar com a delicadeza dos sentimentos retratados.', date: '2026-06-25' }
    ]
  },
  {
    id: '6',
    title: 'O Segredo do Bosque',
    author: 'Aumicas Rrmer',
    genre: 'Suspense',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBECs9El78QTaQO8gldO3TybX7YeqHmb4Rk5B-EHYPfTHw6NUGUX6i_uUj2UHJJSvq5eXm9HbCI--9sLtDfoiYTc2WDLBgpLnsVvuYFLZxQ6Ye3bHffeCNHNUHJmShXELzZVo3q4ciN3AdBowVlLh8Qom9ot5uC2HpGuAqM54fSVCjcALWq1cPJwoXPnpirrdz9TVpkehDnu5yVgcRLL7kwWmuKW5WlJNzCLYKXj6hrtclm-4stMV2N5CHKw2HtfSAwt503VyMo-SU',
    description: 'Quando as neblinas de outono cobrem a pequena vila alpina de Solis, uma série de inscrições rúnicas misteriosas ressurge nos troncos dos pinheiros centenários, desenterrando lendas antigas e segredos de família que deveriam permanecer enterrados.',
    rating: 4.7,
    price: 23.50,
    reviewCount: 84,
    year: 2024,
    sampleText: 'Capítulo I: Símbolos na Casca\n\nA névoa estava tão densa que Thomas quase perdeu a curva para o bosque de pinheiros. Ele caminhava seguindo o som estridente das gralhas-pretas. Ao se apoiar em um pinheiro antigo para recuperar o fôlego, sentiu que a casca estava esculpida. Ao iluminar com a lanterna, viu a runa brilhando em seiva fresca.',
    reviews: [
      { id: 'r7', authorName: 'Vitor S.', rating: 5, content: 'Excelente suspense de atmosfera! O autor cria uma tensão crescente que mantém o leitor acordado até terminar o livro.', date: '2026-05-28' }
    ]
  }
];

export const GENRES = [
  'Todos',
  'Fantasia',
  'Ficção Científica',
  'Desenvolvimento Pessoal',
  'Romance',
  'Suspense',
  'Negócios'
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'ch-copyright',
    title: 'Copyright',
    content: '© 2026 GospelReads.\n\nTodos os direitos reservados. Nenhuma parte desta publicação pode ser reproduzida, distribuída ou transmitida por qualquer forma ou meio, incluindo fotocópia, gravação ou outros métodos eletrônicos ou mecânicos, sem a permissão prévia por escrito do editor.\n\nISBN: 978-0-00000-000-0',
    order: 0,
    section: 'front',
    type: 'copyright'
  },
  {
    id: 'ch-1',
    title: 'Capítulo I: A Penumbra do Crepúsculo',
    content: 'O sol despencava por trás das serras cinzentas do norte, arrastando consigo os últimos fios de ouro que insistiam em beijar o horizonte. Na pequena cabana do ateliê editorial, a luz fraca de um candeeiro a óleo era o único farol contra a escuridão que avançava rápida.\n\nEzequiel posicionou a ponta de sua caneta sobre a folha de papel pergaminho levemente áspera. Por um longo tempo, apenas o sussurro do vento nas frestas da janela de carvalho ousava quebrar o silêncio. A folha permanecia em branco, imaculada e assustadora. Cada palavra escrita seria um pacto selado com o tempo.\n\n"Escrever não é sobre colocar palavras no papel", pensou alto, limpando uma mancha invisível em sua mesa de jacarandá. "É sobre esculpir o silêncio."',
    order: 1,
    section: 'body',
    type: 'chapter'
  },
  {
    id: 'ch-2',
    title: 'Capítulo II: O Primeiro Pacto',
    content: 'Com a primeira frase finalmente talhada na madeira da memória, a tinta preta fluía com facilidade. Os sentimentos se alinhavam em orações ritmadas, equilibradas como o badalar de um relógio de parede antigo.\n\nO segredo, ele bem sabia, residia no espaço negativo. Entre uma frase e outra, o silêncio deve respirar. É ali que reside o leitor, preenchendo as entrelinhas com as próprias angústias e sonhos. Quando parou para contar, mais de setecentas palavras haviam sido confiadas à escuridão compassiva. Um progresso extraordinário para quem, há poucas horas, julgava-se deserto.',
    order: 2,
    section: 'body',
    type: 'chapter'
  },
  {
    id: 'ch-3',
    title: 'Capítulo III: Diálogo com a Sombra',
    content: 'No terceiro capítulo, uma nova voz exigia passagem. Ezequiel imaginou uma personagem caminhando sob o arco de videiras secas do pomar. O vento carregava o cheiro de terra molhada e folhas caídas, prenúncio de uma tempestade iminente.\n\n— Quem está aí? — ela perguntou ao nada, sabendo que as sombras raramente mentem, embora raramente digam a verdade inteira. A resposta veio sob a forma de um estalar de galhos secos, o passo sutil de alguém que compreende as artes da camuflagem estelar.',
    order: 3,
    section: 'body',
    type: 'chapter'
  },
  {
    id: 'ch-author',
    title: 'Sobre o Autor',
    content: 'Luana Costa é romancista literária, graduada em Astrofísica. Suas obras unem a ficção especulativa profunda com dilemas filosóficos intimistas, retratando o universo sob a lente poética da alma.',
    order: 4,
    section: 'back',
    type: 'author-bio'
  }
];
