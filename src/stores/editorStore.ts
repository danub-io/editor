import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, Chapter, AuthorProfile, WritingSettings, PlanningSection, PlanningCard, PlanningBoard, PlanningBlock, VersionSnapshot, Footnote } from '@/components/gospelreads/types';
import { INITIAL_BOOKS, INITIAL_CHAPTERS } from '@/components/gospelreads/data';

interface EditorState {
  books: Book[];
  chapters: Chapter[];
  activeChapterId: string;
  profile: AuthorProfile;
  settings: WritingSettings;
  rightTab: string | null;

  // New States from Phase 1
  planningSections: PlanningSection[];
  planningCards: PlanningCard[];
  pinnedCardsList: string[];
  deletedPlanningCards: PlanningCard[];
  planningBoards: PlanningBoard[];
  planningBlocks: PlanningBlock[];
  pinnedNotes: string;
  snapshots: VersionSnapshot[];
  footnotes: Record<string, Footnote[]>;
  deletedChapters: Chapter[];

  setBooks: (books: Book[]) => void;
  setChapters: (chapters: Chapter[] | ((prev: Chapter[]) => Chapter[])) => void;
  setActiveChapterId: (id: string) => void;
  setProfile: (profile: AuthorProfile | ((prev: AuthorProfile) => AuthorProfile)) => void;
  setSettings: (settings: WritingSettings | ((prev: WritingSettings) => WritingSettings)) => void;
  setRightTab: (tab: string | null) => void;

  setPlanningSections: (updater: PlanningSection[] | ((prev: PlanningSection[]) => PlanningSection[])) => void;
  setPlanningCards: (updater: PlanningCard[] | ((prev: PlanningCard[]) => PlanningCard[])) => void;
  setPinnedCardsList: (updater: string[] | ((prev: string[]) => string[])) => void;
  setDeletedPlanningCards: (updater: PlanningCard[] | ((prev: PlanningCard[]) => PlanningCard[])) => void;
  setPlanningBoards: (updater: PlanningBoard[] | ((prev: PlanningBoard[]) => PlanningBoard[])) => void;
  setPlanningBlocks: (updater: PlanningBlock[] | ((prev: PlanningBlock[]) => PlanningBlock[])) => void;
  setPinnedNotes: (notes: string) => void;
  setSnapshots: (updater: VersionSnapshot[] | ((prev: VersionSnapshot[]) => VersionSnapshot[])) => void;
  setFootnotes: (updater: Record<string, Footnote[]> | ((prev: Record<string, Footnote[]>) => Record<string, Footnote[]>)) => void;
  setDeletedChapters: (updater: Chapter[] | ((prev: Chapter[]) => Chapter[])) => void;
}

const defaultPlanningSections: PlanningSection[] = [
  { id: 'planning', name: 'Planejamento' },
  { id: 'ato1', name: 'Ato I: Partida' },
  { id: 'ato2', name: 'Ato II: Iniciação' },
  { id: 'ato3', name: 'Ato III: Retorno' }
];

const defaultPlanningCards: PlanningCard[] = [
  { id: 'pc-0', column: 'planning', title: 'Get started', content: 'Use boards to plan, organize, or research anything.', tag: 'Geral' },
  { id: 'pc-0b', column: 'planning', title: 'Hero\'s Journey Example', content: 'Learn about the Hero\'s Journey.', tag: 'Estrutura' },
  { id: 'pc-1', column: 'ato1', title: 'Mundo Comum', content: 'Apresentar a vida corriqueira do protagonista e seus conflitos internos.', tag: 'Estrutura' },
  { id: 'pc-2', column: 'ato1', title: 'O Chamado para Escrita', content: 'Incentivo externo que desencadeia a necessidade de mudança.', tag: 'Trama' },
  { id: 'pc-3', column: 'ato2', title: 'Travessia do Limiar', content: 'O herói assume o compromisso e adentra o mundo especial do editor.', tag: 'Estrutura' },
  { id: 'pc-4', column: 'ato2', title: 'Novos Aliados', content: 'Aparecimento de personagens que ajudam na estruturação e estilo do texto.', tag: 'Personagem' },
  { id: 'pc-5', column: 'ato3', title: 'A Provação Suprema', content: 'Resolução das tensões acumuladas em um clímax emocionante.', tag: 'Trama' },
  { id: 'pc-6', column: 'ato3', title: 'Retorno com o Elixir', content: 'O livro é exportado e distribuído no marketplace com glória.', tag: 'Cenário' }
];

const defaultPlanningBoards: PlanningBoard[] = [
  { id: 'pb-1', name: 'Personagens', emoji: '🎭', description: 'Fichas detalhadas dos protagonistas, antagonistas e secundários.' },
  { id: 'pb-2', name: 'Locais', emoji: '🗺️', description: 'Pontos importantes do mundo, reinos, cidades e salas.' },
  { id: 'pb-3', name: 'Eventos da Trama', emoji: '⏳', description: 'Acontecimentos marcantes da narrativa e marcos cronológicos.' }
];

const defaultPlanningBlocks: PlanningBlock[] = [
  { id: 'pbl-1', boardId: 'pb-1', title: 'Luana Costa', type: 'character', content: 'Protagonista. Escritora que descobre que suas palavras moldam o espaço sideral.', emoji: '✍️' },
  { id: 'pbl-2', boardId: 'pb-2', title: 'Biblioteca de Alexandria II', type: 'location', content: 'Grande acervo localizado na órbita de Netuno.', emoji: '🚀' },
  { id: 'pbl-3', boardId: 'pb-3', title: 'O Grande Alinhamento', type: 'event', content: 'Evento astronômico que conecta todas as dimensões literárias.', emoji: '🪐' }
];

const defaultSnapshots: VersionSnapshot[] = [
  { id: 'snap-1', timestamp: '29/06/2026, 14:32', title: 'Rascunho Inicial do Cap 1', charCount: 820 },
  { id: 'snap-2', timestamp: '29/06/2026, 18:15', title: 'Revisão Ortográfica Geral', charCount: 1150 }
];

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      books: INITIAL_BOOKS,
      chapters: INITIAL_CHAPTERS,
      activeChapterId: INITIAL_CHAPTERS.length > 0 ? INITIAL_CHAPTERS[0].id : '',
      profile: {
        name: 'Luana Costa',
        penName: 'Luana Costa',
        bio: 'Escrevo desde a infância, fascinada pela imensidão das galáxias e os mistérios insondáveis da poeira cósmica. Meus romances buscam conciliar ficção científica de alta precisão técnica e sentimentos humanos puros, oferecendo aos leitores uma âncora lírica no desconhecido.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        website: 'https://luanacosta.gospelreads.com',
        twitter: 'https://twitter.com/luanacosta',
        instagram: 'https://instagram.com/luanacosta',
        featuredBookIds: ['1', '2']
      },
      settings: {
        dailyGoal: 500,
        preferredFont: 'serif',
        fontSize: 'md',
        marginSize: 'normal',
        paperFormat: 'trade',
        showPageNumbers: true
      },
      rightTab: null,

      planningSections: defaultPlanningSections,
      planningCards: defaultPlanningCards,
      pinnedCardsList: [],
      deletedPlanningCards: [],
      planningBoards: defaultPlanningBoards,
      planningBlocks: defaultPlanningBlocks,
      pinnedNotes: 'Use este bloco de notas fixado para rascunhar ideias rápidas, nomes de personagens importantes, datas marcantes ou lembretes literários que precisam ficar à vista.',
      snapshots: defaultSnapshots,
      footnotes: {},
      deletedChapters: [],

      setBooks: (books) => set({ books }),
      setChapters: (updater) => set((state) => ({ chapters: typeof updater === 'function' ? updater(state.chapters) : updater })),
      setActiveChapterId: (activeChapterId) => set({ activeChapterId }),
      setProfile: (updater) => set((state) => ({ profile: typeof updater === 'function' ? updater(state.profile) : updater })),
      setSettings: (updater) => set((state) => ({ settings: typeof updater === 'function' ? updater(state.settings) : updater })),
      setRightTab: (rightTab) => set({ rightTab }),

      setPlanningSections: (updater) => set((state) => ({ planningSections: typeof updater === 'function' ? updater(state.planningSections) : updater })),
      setPlanningCards: (updater) => set((state) => ({ planningCards: typeof updater === 'function' ? updater(state.planningCards) : updater })),
      setPinnedCardsList: (updater) => set((state) => ({ pinnedCardsList: typeof updater === 'function' ? updater(state.pinnedCardsList) : updater })),
      setDeletedPlanningCards: (updater) => set((state) => ({ deletedPlanningCards: typeof updater === 'function' ? updater(state.deletedPlanningCards) : updater })),
      setPlanningBoards: (updater) => set((state) => ({ planningBoards: typeof updater === 'function' ? updater(state.planningBoards) : updater })),
      setPlanningBlocks: (updater) => set((state) => ({ planningBlocks: typeof updater === 'function' ? updater(state.planningBlocks) : updater })),
      setPinnedNotes: (pinnedNotes) => set({ pinnedNotes }),
      setSnapshots: (updater) => set((state) => ({ snapshots: typeof updater === 'function' ? updater(state.snapshots) : updater })),
      setFootnotes: (updater) => set((state) => ({ footnotes: typeof updater === 'function' ? updater(state.footnotes) : updater })),
      setDeletedChapters: (updater) => set((state) => ({ deletedChapters: typeof updater === 'function' ? updater(state.deletedChapters) : updater })),
    }),
    {
      name: 'gospelreads-storage',
      partialize: (state) => ({
        books: state.books,
        chapters: state.chapters,
        activeChapterId: state.activeChapterId,
        profile: state.profile,
        settings: state.settings,
        planningSections: state.planningSections,
        planningCards: state.planningCards,
        pinnedCardsList: state.pinnedCardsList,
        deletedPlanningCards: state.deletedPlanningCards,
        planningBoards: state.planningBoards,
        planningBlocks: state.planningBlocks,
        pinnedNotes: state.pinnedNotes,
        snapshots: state.snapshots,
        footnotes: state.footnotes,
        deletedChapters: state.deletedChapters
      }),
    }
  )
);
