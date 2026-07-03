import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Project,
  Chapter,
  Character,
  Location,
  TimelineEvent,
} from "@/types";

interface ProjectStore {
  // Data
  projects: Project[];
  chapters: Chapter[];
  deletedChapters: Chapter[];
  characters: Character[];
  locations: Location[];
  timelineEvents: TimelineEvent[];

  // UI State
  activeProjectId: string | null;
  activeChapterId: string | null;
  sidebarOpen: boolean;
  focusMode: boolean;
  isLoading: boolean;

  // Data actions (API-backed)
  fetchProjects: () => Promise<void>;
  createProject: (
    data: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;

  fetchChapters: (projectId: string) => Promise<void>;
  createChapter: (
    data: Omit<Chapter, "id" | "createdAt" | "updatedAt">
  ) => Promise<Chapter>;
  updateChapter: (id: string, updates: Partial<Chapter>) => Promise<void>;
  deleteChapter: (id: string) => Promise<void>;
  restoreChapter: (id: string) => void;
  permanentDeleteChapter: (id: string) => Promise<void>;
  getChapter: (id: string) => Chapter | undefined;
  getChaptersByProject: (projectId: string) => Chapter[];
  getDeletedChaptersByProject: (projectId: string) => Chapter[];
  reorderChapters: (projectId: string, newOrder: string[]) => void;

  fetchCharacters: (projectId: string) => Promise<void>;
  createCharacter: (
    data: Omit<Character, "id" | "createdAt" | "updatedAt">
  ) => Promise<Character>;
  updateCharacter: (id: string, updates: Partial<Character>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  getCharactersByProject: (projectId: string) => Character[];

  fetchLocations: (projectId: string) => Promise<void>;
  createLocation: (
    data: Omit<Location, "id" | "createdAt" | "updatedAt">
  ) => Promise<Location>;
  deleteLocation: (id: string) => Promise<void>;
  updateLocation: (id: string, updates: Partial<Location>) => Promise<void>;
  getLocationsByProject: (projectId: string) => Location[];

  fetchTimeline: (projectId: string) => Promise<void>;
  createTimelineEvent: (
    data: Omit<TimelineEvent, "id" | "createdAt" | "updatedAt">
  ) => Promise<TimelineEvent>;
  deleteTimelineEvent: (id: string) => Promise<void>;
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => Promise<void>;
  getTimelineByProject: (projectId: string) => TimelineEvent[];

  // UI actions
  setActiveProject: (id: string | null) => void;
  setActiveChapter: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleFocusMode: () => void;
}

// ── Mock Data Fallbacks ──
const now = new Date();
const date5DaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
const date3DaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
const dateYesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

const initialProjects: Project[] = [
  {
    id: "mock-project-1",
    title: "O Portal de Éfeso",
    author: "Sara Ribeiro",
    description: "Uma investigação arqueológica e histórica sobre manuscritos perdidos na Ásia Menor.",
    language: "pt-BR",
    categories: ["Ficção", "Histórico"],
    keywords: ["arqueologia", "manuscritos", "turquia"],
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    settings: {
      pageFormat: "6x9",
      fontFamily: "Lora",
      fontSize: 11,
      lineHeight: 1.4,
      margins: {
        top: "2cm",
        bottom: "2cm",
        inner: "2.5cm",
        outer: "2cm",
      },
      theme: "light",
    },
    createdAt: date5DaysAgo,
    updatedAt: now,
  }
];

const initialChapters: Chapter[] = [
  {
    id: "ch-1",
    projectId: "mock-project-1",
    type: "chapter",
    number: 1,
    title: "O Manuscrito Oculto",
    content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac ante eget arcu imperdiet ultrices. Phasellus scelerisque tempor urna, ut lacinia tellus elementum sit amet. Aliquam id massa sed diam accumsan hendrerit.</p><p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed vitae tristique purus. Vivamus lobortis scelerisque elit, id pretium quam vulputate eget.</p>",
    wordCount: 2500,
    tags: [],
    status: "completed",
    createdAt: date5DaysAgo,
    updatedAt: date5DaysAgo,
  },
  {
    id: "ch-2",
    projectId: "mock-project-1",
    type: "chapter",
    number: 2,
    title: "A Viagem para a Turquia",
    content: "<p>Donec bibendum augue lorem, nec placerat mi sollicitudin vel. Maecenas a rhoncus urna. Integer elementum elit at tellus facilisis hendrerit. Duis efficitur scelerisque est, in congue turpis dictum a.</p><p>Proin quis congue nulla, id bibendum magna. Ut accumsan facilisis est, vitae congue massa lacinia a. Morbi dictum convallis urna quis consequat.</p>",
    wordCount: 3100,
    tags: [],
    status: "review",
    createdAt: date3DaysAgo,
    updatedAt: date3DaysAgo,
  },
  {
    id: "ch-3",
    projectId: "mock-project-1",
    type: "chapter",
    number: 3,
    title: "O Labirinto Debaixo da Cidade",
    content: "<p>Sed ac neque at nulla interdum vestibulum ac tempor sapien. Etiam dictum egestas purus, convallis sodales lorem facilisis quis. In hac habitasse platea dictumst.</p>",
    wordCount: 1800,
    tags: [],
    status: "draft",
    createdAt: dateYesterday,
    updatedAt: now,
  },
];

const initialCharacters: Character[] = [
  {
    id: "char-1",
    projectId: "mock-project-1",
    name: "Dr. Henrique Vasconcelos",
    description: "Professor sênior de Arqueologia, pragmático e obstinado pela busca de manuscritos perdidos.",
    personality: "Intelectual / Arqueólogo",
    relationships: [],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    createdAt: date5DaysAgo,
    updatedAt: now,
  },
  {
    id: "char-2",
    projectId: "mock-project-1",
    name: "Evelyn Carter",
    description: "Tradutora e linguista especialista em grego antigo. Perspicaz, cética e extremamente focada nos fatos.",
    personality: "Linguista / Cética",
    relationships: [],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    createdAt: date5DaysAgo,
    updatedAt: now,
  },
  {
    id: "char-3",
    projectId: "mock-project-1",
    name: "Yusuf Demir",
    description: "Guia local nas ruínas de Éfeso. Conhece passagens subterrâneas secretas e lendas locais não documentadas.",
    personality: "Guia / Misterioso",
    relationships: [],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    createdAt: date5DaysAgo,
    updatedAt: now,
  },
];

const initialLocations: Location[] = [
  {
    id: "loc-1",
    projectId: "mock-project-1",
    name: "Biblioteca de Celso",
    description: "As ruínas da antiga biblioteca romana em Éfeso, local do primeiro manuscrito descoberto.",
    type: "city",
    createdAt: date5DaysAgo,
    updatedAt: now,
  },
  {
    id: "loc-2",
    projectId: "mock-project-1",
    name: "Cidade Subterrânea de Derinkuyu",
    description: "Uma caverna profunda e complexo habitacional antigo com túneis estreitos e passagens seladas.",
    type: "fantasy",
    createdAt: date5DaysAgo,
    updatedAt: now,
  },
  {
    id: "loc-3",
    projectId: "mock-project-1",
    name: "Laboratório de Restauro",
    description: "Sala limpa climatizada com mesas de luz, reagentes químicos e pincéis macios para manuseio de pergaminhos.",
    type: "indoor",
    createdAt: date5DaysAgo,
    updatedAt: now,
  },
];

const initialTimeline: TimelineEvent[] = [
  {
    id: "evt-1",
    projectId: "mock-project-1",
    title: "Descoberta do Primeiro Fragmento",
    description: "Dr. Henrique encontra um pergaminho escondido atrás de um bloco de mármore na Biblioteca de Celso.",
    date: "Dia 1",
    characterIds: ["char-1"],
    locationId: "loc-1",
    order: 1,
    createdAt: date5DaysAgo,
    updatedAt: date5DaysAgo,
  },
  {
    id: "evt-2",
    projectId: "mock-project-1",
    title: "Chegada de Evelyn Carter",
    description: "Evelyn pousa em Istambul e se junta ao projeto para iniciar a tradução das inscrições gregas antigas.",
    date: "Dia 3",
    characterIds: ["char-1", "char-2"],
    locationId: "loc-3",
    order: 2,
    createdAt: date3DaysAgo,
    updatedAt: date3DaysAgo,
  },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state with fallback mock values
      projects: initialProjects,
      chapters: initialChapters,
      deletedChapters: [],
      characters: initialCharacters,
      locations: initialLocations,
      timelineEvents: initialTimeline,
      activeProjectId: "mock-project-1",
      activeChapterId: "ch-1",
      sidebarOpen: false,
      focusMode: false,
      isLoading: false,

      // ── Projects ──
      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const headers: Record<string, string> = {};
          if (process.env.NEXT_PUBLIC_API_SECRET) {
            headers["x-api-key"] = process.env.NEXT_PUBLIC_API_SECRET;
          }
          const res = await fetch("/api/projects", { headers });
          const data = (await res.json()) as any;
          if (Array.isArray(data) && data.length > 0) {
            set({ projects: data, isLoading: false });
          } else {
            set({ projects: initialProjects, isLoading: false });
          }
        } catch {
          set({ projects: initialProjects, isLoading: false });
        }
      },

      createProject: async (projectData) => {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (process.env.NEXT_PUBLIC_API_SECRET) {
          headers["x-api-key"] = process.env.NEXT_PUBLIC_API_SECRET;
        }
        const res = await fetch("/api/projects", {
          method: "POST",
          headers,
          body: JSON.stringify(projectData),
        });
        const project = (await res.json()) as any;
        set((s) => ({
          projects: [...s.projects, project],
          activeProjectId: project.id,
        }));
        return project;
      },

      updateProject: async (id, updates) => {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (process.env.NEXT_PUBLIC_API_SECRET) {
          headers["x-api-key"] = process.env.NEXT_PUBLIC_API_SECRET;
        }
        await fetch(`/api/projects/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(updates),
        });
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));
      },

      deleteProject: async (id) => {
        const headers: Record<string, string> = {};
        if (process.env.NEXT_PUBLIC_API_SECRET) {
          headers["x-api-key"] = process.env.NEXT_PUBLIC_API_SECRET;
        }
        await fetch(`/api/projects/${id}`, { method: "DELETE", headers });
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          chapters: s.chapters.filter((c) => c.projectId !== id),
          deletedChapters: s.deletedChapters.filter((c) => c.projectId !== id),
          characters: s.characters.filter((c) => c.projectId !== id),
          locations: s.locations.filter((l) => l.projectId !== id),
          timelineEvents: s.timelineEvents.filter((e) => e.projectId !== id),
          activeProjectId:
            s.activeProjectId === id ? null : s.activeProjectId,
          activeChapterId: null,
        }));
      },

      getProject: (id) => get().projects.find((p) => p.id === id),

      // ── Chapters ──
      fetchChapters: async (projectId) => {
        try {
          const res = await fetch(`/api/projects/${projectId}/chapters`);
          const data = (await res.json()) as any;
          if (Array.isArray(data) && data.length > 0) {
            set((s) => ({
              chapters: [
                ...s.chapters.filter((c) => c.projectId !== projectId),
                ...data,
              ],
            }));
          } else {
            set((s) => ({
              chapters: [
                ...s.chapters.filter((c) => c.projectId !== projectId),
                ...initialChapters.filter((c) => c.projectId === projectId),
              ],
            }));
          }
        } catch {
          set((s) => ({
            chapters: [
              ...s.chapters.filter((c) => c.projectId !== projectId),
              ...initialChapters.filter((c) => c.projectId === projectId),
            ],
          }));
        }
      },

      createChapter: async (chapterData) => {
        const res = await fetch(
          `/api/projects/${chapterData.projectId}/chapters`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chapterData),
          }
        );
        const chapter = (await res.json()) as any;
        set((s) => ({
          chapters: [...s.chapters, chapter],
          activeChapterId: chapter.id,
        }));
        return chapter;
      },

      updateChapter: async (id, updates) => {
        set((s) => ({
          chapters: s.chapters.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
        await fetch(`/api/chapters/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
      },

      deleteChapter: async (id) => {
        // Soft-delete: move to deletedChapters instead of removing
        const chapter = get().chapters.find((c) => c.id === id);
        if (!chapter) return;
        await fetch(`/api/chapters/${id}`, { method: "DELETE" });
        set((s) => ({
          chapters: s.chapters.filter((c) => c.id !== id),
          deletedChapters: [...s.deletedChapters, { ...chapter, deletedAt: new Date() }],
          activeChapterId:
            s.activeChapterId === id ? null : s.activeChapterId,
        }));
      },

      restoreChapter: (id) => {
        const chapter = get().deletedChapters.find((c) => c.id === id);
        if (!chapter) return;
        set((s) => ({
          deletedChapters: s.deletedChapters.filter((c) => c.id !== id),
          chapters: [...s.chapters, chapter].sort((a, b) => a.number - b.number),
        }));
      },

      permanentDeleteChapter: async (id) => {
        set((s) => ({
          deletedChapters: s.deletedChapters.filter((c) => c.id !== id),
        }));
      },

      getChapter: (id) => get().chapters.find((c) => c.id === id),

      getDeletedChaptersByProject: (projectId) =>
        get()
          .deletedChapters.filter((c) => c.projectId === projectId)
          .sort((a, b) => a.number - b.number),

      getChaptersByProject: (projectId) =>
        get()
          .chapters.filter((c) => c.projectId === projectId)
          .sort((a, b) => a.number - b.number),

      setActiveChapter: (id) => set({ activeChapterId: id }),

      reorderChapters: (projectId, newOrder) => {
        const updated = get().chapters.map((c) => {
          if (c.projectId !== projectId) return c;
          const idx = newOrder.indexOf(c.id);
          if (idx !== -1) {
            const newNum = idx + 1;
            fetch(`/api/chapters/${c.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ number: newNum }),
            });
            return { ...c, number: newNum };
          }
          return c;
        });
        set({ chapters: updated });
      },

      // ── Characters ──
      fetchCharacters: async (projectId) => {
        try {
          const res = await fetch(`/api/projects/${projectId}/characters`);
          const data = (await res.json()) as any;
          if (Array.isArray(data) && data.length > 0) {
            set((s) => ({
              characters: [
                ...s.characters.filter((c) => c.projectId !== projectId),
                ...data,
              ],
            }));
          } else {
            set((s) => ({
              characters: [
                ...s.characters.filter((c) => c.projectId !== projectId),
                ...initialCharacters.filter((c) => c.projectId === projectId),
              ],
            }));
          }
        } catch {
          set((s) => ({
            characters: [
              ...s.characters.filter((c) => c.projectId !== projectId),
              ...initialCharacters.filter((c) => c.projectId === projectId),
            ],
          }));
        }
      },

      createCharacter: async (charData) => {
        const res = await fetch(
          `/api/projects/${charData.projectId}/characters`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(charData),
          }
        );
        const character = (await res.json()) as any;
        set((s) => ({ characters: [...s.characters, character] }));
        return character;
      },

      updateCharacter: async (id, updates) => {
        await fetch(`/api/characters/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
      },

      deleteCharacter: async (id) => {
        await fetch(`/api/characters/${id}`, { method: "DELETE" });
        set((s) => ({
          characters: s.characters.filter((c) => c.id !== id),
        }));
      },

      getCharactersByProject: (projectId) =>
        get().characters.filter((c) => c.projectId === projectId),

      // ── Locations ──
      fetchLocations: async (projectId) => {
        try {
          const res = await fetch(`/api/projects/${projectId}/locations`);
          const data = (await res.json()) as any;
          if (Array.isArray(data) && data.length > 0) {
            set((s) => ({
              locations: [
                ...s.locations.filter((l) => l.projectId !== projectId),
                ...data,
              ],
            }));
          } else {
            set((s) => ({
              locations: [
                ...s.locations.filter((l) => l.projectId !== projectId),
                ...initialLocations.filter((l) => l.projectId === projectId),
              ],
            }));
          }
        } catch {
          set((s) => ({
            locations: [
              ...s.locations.filter((l) => l.projectId !== projectId),
              ...initialLocations.filter((l) => l.projectId === projectId),
            ],
          }));
        }
      },

      createLocation: async (locData) => {
        const res = await fetch(
          `/api/projects/${locData.projectId}/locations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(locData),
          }
        );
        const location = (await res.json()) as any;
        set((s) => ({ locations: [...s.locations, location] }));
        return location;
      },

      deleteLocation: async (id) => {
        await fetch(`/api/locations/${id}`, { method: "DELETE" });
        set((s) => ({ locations: s.locations.filter((l) => l.id !== id) }));
      },

      updateLocation: async (id, updates) => {
        await fetch(`/api/locations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        set((s) => ({
          locations: s.locations.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l
          ),
        }));
      },

      getLocationsByProject: (projectId) =>
        get().locations.filter((l) => l.projectId === projectId),

      // ── Timeline ──
      fetchTimeline: async (projectId) => {
        try {
          const res = await fetch(`/api/projects/${projectId}/timeline`);
          const data = (await res.json()) as any;
          if (Array.isArray(data) && data.length > 0) {
            set((s) => ({
              timelineEvents: [
                ...s.timelineEvents.filter((e) => e.projectId !== projectId),
                ...data,
              ],
            }));
          } else {
            set((s) => ({
              timelineEvents: [
                ...s.timelineEvents.filter((e) => e.projectId !== projectId),
                ...initialTimeline.filter((e) => e.projectId === projectId),
              ],
            }));
          }
        } catch {
          set((s) => ({
            timelineEvents: [
              ...s.timelineEvents.filter((e) => e.projectId !== projectId),
              ...initialTimeline.filter((e) => e.projectId === projectId),
            ],
          }));
        }
      },

      createTimelineEvent: async (eventData) => {
        const res = await fetch(
          `/api/projects/${eventData.projectId}/timeline`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          }
        );
        const event = (await res.json()) as any;
        set((s) => ({ timelineEvents: [...s.timelineEvents, event] }));
        return event;
      },

      deleteTimelineEvent: async (id) => {
        await fetch(`/api/timeline/${id}`, { method: "DELETE" });
        set((s) => ({
          timelineEvents: s.timelineEvents.filter((e) => e.id !== id),
        }));
      },

      updateTimelineEvent: async (id, updates) => {
        await fetch(`/api/timeline/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        set((s) => ({
          timelineEvents: s.timelineEvents.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
          ),
        }));
      },

      getTimelineByProject: (projectId) =>
        get()
          .timelineEvents.filter((e) => e.projectId === projectId)
          .sort((a, b) => a.order - b.order),

      // ── UI ──
      setActiveProject: (id) =>
        set({ activeProjectId: id, activeChapterId: null }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
    }),
    {
      name: "editora-storage",
      version: 1,
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
        focusMode: state.focusMode,
      }),
    }
  )
);