export interface Project {
  id: string;
  title: string;
  author: string;
  description?: string;
  language: string;
  isbn?: string;
  categories: string[];
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  pageFormat: "A5" | "6x9" | "5x8" | "5.5x8.5";
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: {
    top: string;
    bottom: string;
    inner: string;
    outer: string;
  };
  theme: "light" | "dark" | "sepia";
}

export interface Chapter {
  id: string;
  projectId: string;
  type: "front_matter" | "chapter" | "part_header";
  subType?: "copyright" | "dedication" | "toc" | "epigraph" | "preface" | "introduction";
  partId?: string; // which part_header this chapter belongs to
  number: number;
  title: string;
  content: string;
  wordCount: number;
  tags: string[];
  status?: "draft" | "review" | "completed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  physicalTraits?: string;
  personality?: string;
  motivations?: string;
  relationships: CharacterRelationship[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterRelationship {
  characterId: string;
  type: string;
  description?: string;
}

export interface Location {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  type: "indoor" | "outdoor" | "city" | "fantasy" | "other";
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  date?: string;
  chapterId?: string;
  characterIds: string[];
  locationId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: "general" | "research" | "idea" | "todo";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorState {
  activeProjectId: string | null;
  activeChapterId: string | null;
  sidebarOpen: boolean;
  focusMode: boolean;
  darkMode: boolean;
}

export interface AIResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface EditSuggestion {
  original: string;
  edited: string;
  reason: string;
}

export interface ProofreadingError {
  original: string;
  correction: string;
  type: "gramática" | "ortografia" | "pontuação" | "concordância" | "digitação";
  explanation: string;
}

export interface ConsistencyIssue {
  type: "character" | "timeline" | "fact" | "tone";
  description: string;
  chapters?: number[];
  severity: "low" | "medium" | "high";
}