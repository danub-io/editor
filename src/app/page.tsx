"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkspaceEditor from '@/components/gospelreads/WorkspaceEditor';
import { Book, Chapter, AuthorProfile, WritingSettings } from '@/components/gospelreads/types';
import { INITIAL_BOOKS, INITIAL_CHAPTERS } from '@/components/gospelreads/data';

function DashContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [rightTab, setRightTab] = useState<string | null>(null);

  // States with LocalStorage Hydration
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [profile, setProfile] = useState<AuthorProfile>({
    name: 'Luana Costa',
    penName: 'Luana Costa',
    bio: 'Escrevo desde a infância, fascinada pela imensidão das galáxias e os mistérios insondáveis da poeira cósmica. Meus romances buscam conciliar ficção científica de alta precisão técnica e sentimentos humanos puros, oferecendo aos leitores uma âncora lírica no desconhecido.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    website: 'https://luanacosta.gospelreads.com',
    twitter: 'https://twitter.com/luanacosta',
    instagram: 'https://instagram.com/luanacosta',
    featuredBookIds: ['1', '2']
  });
  const [settings, setSettings] = useState<WritingSettings>({
    dailyGoal: 500,
    preferredFont: 'serif',
    fontSize: 'md',
    marginSize: 'normal',
    paperFormat: 'trade',
    showPageNumbers: true
  });

  useEffect(() => {
    setMounted(true);
    
    // Hydrate
    const savedBooks = localStorage.getItem('gospelreads_books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));

    const savedChapters = localStorage.getItem('gospelreads_chapters');
    if (savedChapters) setChapters(JSON.parse(savedChapters));

    const savedActiveChapterId = localStorage.getItem('gospelreads_active_chapter_id');
    if (savedActiveChapterId) {
      setActiveChapterId(savedActiveChapterId);
    } else if (INITIAL_CHAPTERS.length > 0) {
      setActiveChapterId(INITIAL_CHAPTERS[0].id);
    }

    const savedProfile = localStorage.getItem('gospelreads_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedSettings = localStorage.getItem('gospelreads_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Update tab parameter from URL query if present
  useEffect(() => {
    if (mounted) {
      const tabParam = searchParams.get('tab');
      if (tabParam) {
        setRightTab(tabParam);
      }
    }
  }, [searchParams, mounted]);

  // Persist States to LocalStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gospelreads_books', JSON.stringify(books));
    }
  }, [books, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gospelreads_chapters', JSON.stringify(chapters));
    }
  }, [chapters, mounted]);

  useEffect(() => {
    if (mounted && activeChapterId) {
      localStorage.setItem('gospelreads_active_chapter_id', activeChapterId);
    }
  }, [activeChapterId, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gospelreads_profile', JSON.stringify(profile));
    }
  }, [profile, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gospelreads_settings', JSON.stringify(settings));
    }
  }, [settings, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-surface dark:bg-[#09090b]"></div>;
  }

  return (
    <div className="h-screen max-h-screen bg-[#f4f3ef] dark:bg-[#09090b] flex flex-col justify-between text-neutral-100 font-sans antialiased overflow-hidden">
      <main className="flex-1 flex flex-col min-h-0">
        <WorkspaceEditor 
          books={books}
          chapters={chapters}
          setChapters={setChapters}
          activeChapterId={activeChapterId}
          setActiveChapterId={setActiveChapterId}
          settings={settings}
          setSettings={setSettings}
          profile={profile}
          setProfile={setProfile}
          rightTab={rightTab}
          setRightTab={setRightTab}
        />
      </main>
    </div>
  );
}

export default function Dash() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]"></div>}>
      <DashContent />
    </Suspense>
  );
}
