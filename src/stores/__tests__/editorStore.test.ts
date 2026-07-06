import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useEditorStore.setState({ ...useEditorStore.getState(),
      books: [{id: 'b1'} as any],
      chapters: [{id: 'c1'} as any],
      activeChapterId: 'c1',
      profile: { name: 'Luana Costa' } as any,
      settings: { dailyGoal: 500 } as any,
      rightTab: null,
      planningSections: [],
      planningCards: [],
      pinnedCardsList: [],
      deletedPlanningCards: [],
      planningBoards: [],
      planningBlocks: [],
      pinnedNotes: '',
      snapshots: [],
      footnotes: {},
      deletedChapters: []
    }, true);
    // Clear localStorage mock if we had one
    localStorage.clear();
  });

  it('deve ter o estado inicial correto', () => {
    const state = useEditorStore.getState();
    expect(state.books).toBeDefined();
    expect(state.chapters).toBeDefined();
    expect(state.settings).toBeDefined();
    expect(state.profile).toBeDefined();
    expect(state.planningSections).toBeDefined();
    expect(state.planningCards).toBeDefined();
    expect(state.pinnedCardsList).toEqual([]);
    expect(state.deletedPlanningCards).toEqual([]);
  });

  it('deve atualizar os livros', () => {
    const books = [{ id: '1', title: 'Livro de Teste', author: 'Autor', description: '', language: 'pt-BR', categories: [], keywords: [], status: 'draft', createdAt: new Date(), updatedAt: new Date(), coverImage: '' }];
    useEditorStore.getState().setBooks(books as any);
    expect(useEditorStore.getState().books).toEqual(books);
  });

  it('deve atualizar os capitulos usando funcao ou valor', () => {
    const newChapter = { id: 'c1', bookId: '1', title: 'C1', content: 'C1', order: 1, status: 'draft', createdAt: new Date(), updatedAt: new Date() };

    useEditorStore.getState().setChapters([newChapter as any]);
    expect(useEditorStore.getState().chapters).toEqual([newChapter]);

    useEditorStore.getState().setChapters((prev) => [...prev, newChapter as any]);
    expect(useEditorStore.getState().chapters.length).toBe(2);
  });

  it('deve atualizar id do capitulo ativo', () => {
    useEditorStore.getState().setActiveChapterId('capitulo-2');
    expect(useEditorStore.getState().activeChapterId).toBe('capitulo-2');
  });

  it('deve atualizar o profile', () => {
    const newProfile = { name: 'Novo Nome', penName: '', bio: '', avatarUrl: '', website: '', twitter: '', instagram: '', featuredBookIds: [] };
    useEditorStore.getState().setProfile(newProfile);
    expect(useEditorStore.getState().profile.name).toBe('Novo Nome');

    useEditorStore.getState().setProfile((prev) => ({ ...prev, name: 'Nome Atualizado' }));
    expect(useEditorStore.getState().profile.name).toBe('Nome Atualizado');
  });

  it('deve atualizar as settings', () => {
    useEditorStore.getState().setSettings({ dailyGoal: 1000 } as any);
    expect(useEditorStore.getState().settings.dailyGoal).toBe(1000);

    useEditorStore.getState().setSettings((prev) => ({ ...prev, dailyGoal: 2000 }));
    expect(useEditorStore.getState().settings.dailyGoal).toBe(2000);
  });

  it('deve atualizar as sections de planejamento', () => {
    const sections = [{ id: 's1', name: 'S1' }];
    useEditorStore.getState().setPlanningSections(sections);
    expect(useEditorStore.getState().planningSections).toEqual(sections);

    useEditorStore.getState().setPlanningSections((prev) => [...prev, { id: 's2', name: 'S2' }]);
    expect(useEditorStore.getState().planningSections.length).toBe(2);
  });

  it('deve atualizar cards de planejamento', () => {
    useEditorStore.getState().setPlanningCards([]);
    expect(useEditorStore.getState().planningCards).toEqual([]);

    useEditorStore.getState().setPlanningCards((prev) => [{ id: 'c1', column: 's1', title: 'T', content: 'C', tag: 'Geral' }]);
    expect(useEditorStore.getState().planningCards.length).toBe(1);
  });

  it('deve atualizar o rightTab', () => {
    useEditorStore.getState().setRightTab('settings');
    expect(useEditorStore.getState().rightTab).toBe('settings');
    useEditorStore.getState().setRightTab(null);
    expect(useEditorStore.getState().rightTab).toBe(null);
  });

  it('deve atualizar blocos, paineis, notas fixadas e lixeiras', () => {
    useEditorStore.getState().setPinnedNotes('Nota nova');
    expect(useEditorStore.getState().pinnedNotes).toBe('Nota nova');

    useEditorStore.getState().setPlanningBoards([]);
    expect(useEditorStore.getState().planningBoards).toEqual([]);
    useEditorStore.getState().setPlanningBoards((p) => p);

    useEditorStore.getState().setPlanningBlocks([]);
    expect(useEditorStore.getState().planningBlocks).toEqual([]);
    useEditorStore.getState().setPlanningBlocks((p) => p);

    useEditorStore.getState().setPinnedCardsList(['c1']);
    expect(useEditorStore.getState().pinnedCardsList).toEqual(['c1']);
    useEditorStore.getState().setPinnedCardsList((p) => p);

    useEditorStore.getState().setDeletedPlanningCards([]);
    expect(useEditorStore.getState().deletedPlanningCards).toEqual([]);
    useEditorStore.getState().setDeletedPlanningCards((p) => p);

    useEditorStore.getState().setSnapshots([]);
    expect(useEditorStore.getState().snapshots).toEqual([]);
    useEditorStore.getState().setSnapshots((p) => p);

    useEditorStore.getState().setFootnotes({});
    expect(useEditorStore.getState().footnotes).toEqual({});
    useEditorStore.getState().setFootnotes((p) => p);

    useEditorStore.getState().setDeletedChapters([]);
    expect(useEditorStore.getState().deletedChapters).toEqual([]);
    useEditorStore.getState().setDeletedChapters((p) => p);
  });
});
