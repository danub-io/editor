/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  section?: 'front' | 'body' | 'back';
  type?: 'title-page' | 'copyright' | 'dedication' | 'foreword' | 'introduction' | 'chapter' | 'epilogue' | 'author-bio' | 'acknowledgments' | 'custom' | 'part';
  partId?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  description: string;
  rating: number;
  price: number;
  reviewCount: number;
  sampleText: string;
  year: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  date: string;
}

export interface AuthorProfile {
  name: string;
  penName: string;
  bio: string;
  avatarUrl: string;
  website: string;
  twitter: string;
  instagram: string;
  featuredBookIds: string[];
}

export interface WritingSettings {
  dailyGoal: number;
  preferredFont: 'serif' | 'sans' | 'mono';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  marginSize: 'tight' | 'normal' | 'wide';
  paperFormat: 'a5' | 'trade' | 'pocket';
  showPageNumbers: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  excerpt: string;
  content: string;
  readTime: string;
  authorName: string;
  date: string;
}


export interface PlanningCard {
  id: string;
  column: string;
  title: string;
  content: string;
  tag?: 'Estrutura' | 'Personagem' | 'Trama' | 'Cenário' | 'Geral';
  images?: string[];
}

export interface PlanningBoard {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface PlanningBlock {
  id: string;
  boardId: string;
  title: string;
  type: 'character' | 'location' | 'event' | 'note';
  content: string;
  emoji?: string;
}

export interface VersionSnapshot {
  id: string;
  chapterId?: string;
  content?: string;
  timestamp: string;
  title: string;
  charCount: number;
  isAuto?: boolean;
}

export interface PlanningSection {
  id: string;
  name: string;
}

export interface Footnote {
  id: string;
  num: number;
  text: string;
}
