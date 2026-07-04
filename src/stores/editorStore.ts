import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, Chapter, AuthorProfile, WritingSettings } from '@/components/gospelreads/types';
import { INITIAL_BOOKS, INITIAL_CHAPTERS } from '@/components/gospelreads/data';

interface EditorState {
  books: Book[];
  chapters: Chapter[];
  activeChapterId: string;
  profile: AuthorProfile;
  settings: WritingSettings;
  rightTab: string | null;

  setBooks: (books: Book[]) => void;
  setChapters: (chapters: Chapter[] | ((prev: Chapter[]) => Chapter[])) => void;
  setActiveChapterId: (id: string) => void;
  setProfile: (profile: AuthorProfile | ((prev: AuthorProfile) => AuthorProfile)) => void;
  setSettings: (settings: WritingSettings | ((prev: WritingSettings) => WritingSettings)) => void;
  setRightTab: (tab: string | null) => void;
}

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

      setBooks: (books) => set({ books }),
      setChapters: (updater) => set((state) => ({ chapters: typeof updater === 'function' ? updater(state.chapters) : updater })),
      setActiveChapterId: (activeChapterId) => set({ activeChapterId }),
      setProfile: (updater) => set((state) => ({ profile: typeof updater === 'function' ? updater(state.profile) : updater })),
      setSettings: (updater) => set((state) => ({ settings: typeof updater === 'function' ? updater(state.settings) : updater })),
      setRightTab: (rightTab) => set({ rightTab }),
    }),
    {
      name: 'gospelreads-storage',
      partialize: (state) => ({
        books: state.books,
        chapters: state.chapters,
        activeChapterId: state.activeChapterId,
        profile: state.profile,
        settings: state.settings
      }),
    }
  )
);
