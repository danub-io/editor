import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useProjectStore } from '../projectStore';

// Mock de fetch global
global.fetch = vi.fn() as any;

describe('projectStore', () => {
  beforeEach(() => {
    // Reset store before each test properly with Zustand
    useProjectStore.setState({ ...useProjectStore.getState(),
      projects: [{ id: "mock-project-1", title: "O Portal de Éfeso" } as any],
      chapters: [
        { id: "ch-1", projectId: "mock-project-1", title: "C1", number: 1 } as any,
        { id: "ch-2", projectId: "mock-project-1", title: "C2", number: 2 } as any
      ],
      deletedChapters: [],
      characters: [{ id: "char-1", projectId: "mock-project-1", name: "Dr." } as any],
      locations: [{ id: "loc-1", projectId: "mock-project-1", name: "Biblio" } as any],
      timelineEvents: [{ id: "evt-1", projectId: "mock-project-1", title: "Desc" } as any],
      activeProjectId: "mock-project-1",
      activeChapterId: "ch-1",
      sidebarOpen: false,
      focusMode: false,
      isLoading: false
    }, true); // Use replace mode to ensure a completely clean state
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve ter o estado inicial correto e fallbacks', () => {
    const state = useProjectStore.getState();
    expect(state.projects.length).toBeGreaterThan(0);
    expect(state.chapters.length).toBeGreaterThan(0);
    expect(state.characters.length).toBeGreaterThan(0);
    expect(state.locations.length).toBeGreaterThan(0);
    expect(state.timelineEvents.length).toBeGreaterThan(0);
    expect(state.activeProjectId).toBe('mock-project-1');
  });

  describe('UI Actions', () => {
    it('deve gerenciar o sidebar e focus mode', () => {
      useProjectStore.getState().setSidebarOpen(true);
      expect(useProjectStore.getState().sidebarOpen).toBe(true);

      useProjectStore.getState().toggleSidebar();
      expect(useProjectStore.getState().sidebarOpen).toBe(false);

      const initialFocus = useProjectStore.getState().focusMode;
      useProjectStore.getState().toggleFocusMode();
      expect(useProjectStore.getState().focusMode).toBe(!initialFocus);
    });

    it('deve definir active project e chapter', () => {
      useProjectStore.getState().setActiveProject('new-id');
      expect(useProjectStore.getState().activeProjectId).toBe('new-id');
      expect(useProjectStore.getState().activeChapterId).toBe(null);

      useProjectStore.getState().setActiveChapter('cap-1');
      expect(useProjectStore.getState().activeChapterId).toBe('cap-1');
    });
  });

  describe('Projects API', () => {
    it('fetchProjects em caso de sucesso', async () => {
      const mockProjects = [{ id: 'p1', title: 'P1' }];
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockProjects,
      });

      await useProjectStore.getState().fetchProjects();
      expect(useProjectStore.getState().projects).toEqual(mockProjects);
      expect(useProjectStore.getState().isLoading).toBe(false);
    });

    it('fetchProjects em caso de array vazio/invalido (usa fallback inicial)', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => [], // array vazio
      });

      await useProjectStore.getState().fetchProjects();
      expect(useProjectStore.getState().projects.length).toBeGreaterThan(0);
    });

    it('fetchProjects em caso de erro de rede', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
      await useProjectStore.getState().fetchProjects();
      expect(useProjectStore.getState().projects.length).toBeGreaterThan(0); // usa fallback
    });

    it('createProject e getProject', async () => {
      const newProj = { id: 'p2', title: 'New' };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => newProj,
      });

      const res = await useProjectStore.getState().createProject({ title: 'New' } as any);
      expect(res).toEqual(newProj);
      expect(useProjectStore.getState().projects).toContainEqual(newProj);
      expect(useProjectStore.getState().activeProjectId).toBe('p2');

      const found = useProjectStore.getState().getProject('p2');
      expect(found).toEqual(newProj);
    });

    it('updateProject', async () => {
      const mockProj = useProjectStore.getState().projects[0];
      (global.fetch as any).mockResolvedValueOnce({});

      await useProjectStore.getState().updateProject(mockProj.id, { title: 'Updated' });

      const updated = useProjectStore.getState().getProject(mockProj.id);
      expect(updated?.title).toBe('Updated');
    });

    it('deleteProject', async () => {
      const mockProj = useProjectStore.getState().projects[0];
      useProjectStore.getState().setActiveProject(mockProj.id);
      (global.fetch as any).mockResolvedValueOnce({});

      await useProjectStore.getState().deleteProject(mockProj.id);

      const found = useProjectStore.getState().getProject(mockProj.id);
      expect(found).toBeUndefined();
      expect(useProjectStore.getState().activeProjectId).toBeNull();
    });
  });

  describe('Chapters API', () => {
    it('fetchChapters em sucesso substitui dados do projeto atual mas mantem os outros', async () => {
      const newChap = { id: 'nc1', projectId: 'mock-project-1', title: 'NC1' };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => [newChap],
      });

      await useProjectStore.getState().fetchChapters('mock-project-1');
      const projChapters = useProjectStore.getState().getChaptersByProject('mock-project-1');
      expect(projChapters).toEqual([newChap]);
    });

    it('create, update, delete e get', async () => {
      const newChap = { id: 'c1', projectId: 'p1', title: 'C1', number: 1 };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => newChap,
      });

      await useProjectStore.getState().createChapter({ projectId: 'p1', title: 'C1' } as any);
      expect(useProjectStore.getState().getChapter('c1')).toEqual(newChap);

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().updateChapter('c1', { title: 'C1 Updated' });
      expect(useProjectStore.getState().getChapter('c1')?.title).toBe('C1 Updated');

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().deleteChapter('c1');
      expect(useProjectStore.getState().getChapter('c1')).toBeUndefined();
      expect(useProjectStore.getState().deletedChapters).toContainEqual(expect.objectContaining({ id: 'c1' }));
    });

    it('restoreChapter and permanentDeleteChapter', async () => {
      const mockChap = useProjectStore.getState().chapters[0];
      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().deleteChapter(mockChap.id);

      useProjectStore.getState().restoreChapter(mockChap.id);
      expect(useProjectStore.getState().getChapter(mockChap.id)).toBeDefined();
      expect(useProjectStore.getState().deletedChapters.find(c => c.id === mockChap.id)).toBeUndefined();

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().deleteChapter(mockChap.id);
      await useProjectStore.getState().permanentDeleteChapter(mockChap.id);
      expect(useProjectStore.getState().deletedChapters.find(c => c.id === mockChap.id)).toBeUndefined();
    });

    it('reorderChapters', () => {
      const chapters = useProjectStore.getState().getChaptersByProject('mock-project-1');
      expect(chapters.length).toBeGreaterThanOrEqual(2);
      const id1 = chapters[0].id;
      const id2 = chapters[1].id;

      useProjectStore.getState().reorderChapters('mock-project-1', [id2, id1]);

      const newChapters = useProjectStore.getState().getChaptersByProject('mock-project-1');
      expect(newChapters[0].id).toBe(id2);
      expect(newChapters[0].number).toBe(1);
      expect(newChapters[1].id).toBe(id1);
      expect(newChapters[1].number).toBe(2);
    });
  });

  describe('Characters API', () => {
    it('fetchCharacters fallback', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('fail'));
      await useProjectStore.getState().fetchCharacters('mock-project-1');
      expect(useProjectStore.getState().characters.length).toBeGreaterThan(0);
    });

    it('create, update, delete', async () => {
      const newChar = { id: 'char99', projectId: 'p1', name: 'Char' };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => newChar,
      });

      await useProjectStore.getState().createCharacter({ projectId: 'p1', name: 'Char' } as any);
      expect(useProjectStore.getState().getCharactersByProject('p1')).toContainEqual(newChar);

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().updateCharacter('char99', { name: 'Updated Char' });
      expect(useProjectStore.getState().getCharactersByProject('p1')[0].name).toBe('Updated Char');

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().deleteCharacter('char99');
      expect(useProjectStore.getState().getCharactersByProject('p1')).toHaveLength(0);
    });
  });

  describe('Locations API', () => {
    it('fetchLocations fallback', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('fail'));
      await useProjectStore.getState().fetchLocations('mock-project-1');
      expect(useProjectStore.getState().locations.length).toBeGreaterThan(0);
    });

    it('create, update, delete', async () => {
      const newLoc = { id: 'loc99', projectId: 'p1', name: 'Loc' };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => newLoc,
      });

      await useProjectStore.getState().createLocation({ projectId: 'p1', name: 'Loc' } as any);
      expect(useProjectStore.getState().getLocationsByProject('p1')).toContainEqual(newLoc);

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().updateLocation('loc99', { name: 'Updated Loc' });
      expect(useProjectStore.getState().getLocationsByProject('p1')[0].name).toBe('Updated Loc');

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().deleteLocation('loc99');
      expect(useProjectStore.getState().getLocationsByProject('p1')).toHaveLength(0);
    });
  });

  describe('Timeline API', () => {
    it('fetchTimeline fallback', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('fail'));
      await useProjectStore.getState().fetchTimeline('mock-project-1');
      expect(useProjectStore.getState().timelineEvents.length).toBeGreaterThan(0);
    });

    it('create, update, delete', async () => {
      const newEvt = { id: 'evt99', projectId: 'p1', title: 'Evt', order: 1 };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => newEvt,
      });

      await useProjectStore.getState().createTimelineEvent({ projectId: 'p1', title: 'Evt' } as any);
      expect(useProjectStore.getState().getTimelineByProject('p1')).toContainEqual(newEvt);

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().updateTimelineEvent('evt99', { title: 'Updated Evt' });
      expect(useProjectStore.getState().getTimelineByProject('p1')[0].title).toBe('Updated Evt');

      (global.fetch as any).mockResolvedValueOnce({});
      await useProjectStore.getState().deleteTimelineEvent('evt99');
      expect(useProjectStore.getState().getTimelineByProject('p1')).toHaveLength(0);
    });
  });
});
