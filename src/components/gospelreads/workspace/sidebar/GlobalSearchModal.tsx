import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { X, Search } from 'lucide-react';
import { Chapter, PlanningCard, PlanningBoard } from '@/components/gospelreads/types';

export function GlobalSearchModal({
  globalSearchOpen,
  setGlobalSearchOpen,
  globalSearchQuery,
  setGlobalSearchQuery,
  setActiveChapterId,
  setLeftTab,
  setIsLeftPanelOpen,
  setActiveBoardId,
  setActiveRightTool
}: any) {
  const { chapters, planningCards, pinnedCardsList, planningBoards } = useEditorStore();
  const pinnedCardsSet = React.useMemo(() => new Set(pinnedCardsList || []), [pinnedCardsList]);

  if (!globalSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4"
      onClick={() => { setGlobalSearchOpen(false); setGlobalSearchQuery(''); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-surface dark:bg-[#0c0c0e] border border-neutral-200 dark:border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-outline-variant">
          <Search size={18} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            autoFocus
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Buscar capítulos, notas, quadros e mais..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="text-on-surface-variant hover:text-neutral-600 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
          {globalSearchQuery.trim() === '' ? (
            <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
              Digite para buscar em todo o seu projeto
            </div>
          ) : (() => {
            const q = globalSearchQuery.toLowerCase();

            const chapterResults = chapters.filter((ch: Chapter) =>
              ch.title.toLowerCase().includes(q) ||
              ch.content.toLowerCase().includes(q)
            );

            const noteResults = planningCards.filter((c: PlanningCard) =>
              pinnedCardsSet.has(c.id) &&
              (c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q))
            );

            const boardResults = planningBoards.filter((b: PlanningBoard) =>
              b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)
            );

            const total = chapterResults.length + noteResults.length + boardResults.length;

            if (total === 0) {
              return (
                <div className="px-4 py-8 text-center text-sm text-on-surface-variant italic">
                  Nenhum resultado para &quot;{globalSearchQuery}&quot;
                </div>
              );
            }

            return (
              <>
                {chapterResults.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-neutral-50 dark:bg-surface-container-lowest/50">
                      Capítulos
                    </div>
                    {chapterResults.map((ch: Chapter) => {
                      const idx = ch.content.toLowerCase().indexOf(q);
                      const snippet = idx >= 0
                        ? '...' + ch.content.slice(Math.max(0, idx - 30), idx + 60).replace(/\n/g, ' ') + '...'
                        : '';
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setActiveChapterId(ch.id);
                            setGlobalSearchOpen(false);
                            setGlobalSearchQuery('');
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                        >
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">{ch.title}</div>
                          {snippet && <div className="text-xs text-on-surface-variant mt-0.5 truncate">{snippet}</div>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {noteResults.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-neutral-50 dark:bg-surface-container-lowest/50">
                      Notas Fixadas
                    </div>
                    {noteResults.map((c: PlanningCard) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveRightTool('notes');
                          setGlobalSearchOpen(false);
                          setGlobalSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                      >
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{c.title}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5 truncate">{c.content}</div>
                      </button>
                    ))}
                  </div>
                )}

                {boardResults.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-neutral-50 dark:bg-surface-container-lowest/50">
                      Quadros
                    </div>
                    {boardResults.map((b: PlanningBoard) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setLeftTab('planning');
                          setIsLeftPanelOpen(true);
                          setActiveBoardId(b.id);
                          setGlobalSearchOpen(false);
                          setGlobalSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                      >
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{b.emoji} {b.name}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5 truncate">{b.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-neutral-200 dark:border-outline-variant flex gap-4 text-xs text-on-surface-variant">
          <span><kbd className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> para abrir</span>
          <span><kbd className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[10px]">Esc</kbd> para fechar</span>
        </div>
      </div>
    </div>
  );
}
