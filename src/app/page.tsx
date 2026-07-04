"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkspaceEditor from '@/components/gospelreads/WorkspaceEditor';
import { useEditorStore } from '@/stores/editorStore';

function DashContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const { setRightTab } = useEditorStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const tabParam = searchParams.get('tab');
      if (tabParam) {
        setRightTab(tabParam);
      }
    }
  }, [searchParams, mounted, setRightTab]);

  if (!mounted) {
    return <div className="min-h-screen bg-surface dark:bg-surface"></div>;
  }

  return (
    <div className="h-screen max-h-screen bg-surface dark:bg-surface flex flex-col justify-between text-on-surface font-sans antialiased overflow-hidden">
      <main className="flex-1 flex flex-col min-h-0">
        <WorkspaceEditor />
      </main>
    </div>
  );
}

export default function Dash() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface"></div>}>
      <DashContent />
    </Suspense>
  );
}
