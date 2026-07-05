import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { X, Trash2 } from 'lucide-react';
import { Chapter, PlanningCard } from '@/components/gospelreads/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// Use the same customConfirm signature we had before
export function TrashModal({ trashOpen, setTrashOpen, customConfirm }: any) {
  const {
    deletedChapters,
    setDeletedChapters,
    chapters,
    setChapters,
    deletedPlanningCards,
    setDeletedPlanningCards,
    planningCards,
    setPlanningCards
  } = useEditorStore();

  return (
    <Dialog open={trashOpen} onOpenChange={(open) => !open && setTrashOpen(false)}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col overflow-hidden bg-surface dark:bg-[#0c0c0e] border-neutral-200 dark:border-outline-variant p-0 gap-0 font-sans">

        {/* Header */}
        <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center select-none shrink-0">
          <h3 className="font-sans font-bold text-base uppercase tracking-wider flex items-center gap-2">
            <Trash2 size={16} /> Lixeira do Livro
          </h3>
          <button
            onClick={() => setTrashOpen(false)}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          {/* Deleted Chapters / Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-450 dark:text-on-surface-variant uppercase tracking-widest">Capítulos Excluídos</h4>
            {deletedChapters.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-neutral-300 dark:border-outline-variant text-neutral-450 dark:text-neutral-550 text-xs rounded-xl font-sans italic">
                Nenhum capítulo na lixeira.
              </div>
            ) : (
              <div className="space-y-2">
                {deletedChapters.map((chap: Chapter) => (
                  <div key={chap.id} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant p-3.5 rounded-xl flex justify-between items-center text-sm shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-750">
                    <div className="overflow-hidden mr-2">
                      <h5 className="font-serif font-bold text-neutral-900 dark:text-white truncate">{chap.title}</h5>
                      <p className="text-[10px] text-on-surface-variant dark:text-on-surface-variant font-mono mt-0.5">Ordem de escrita: {chap.order}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setChapters((prev: Chapter[]) => [...prev, chap].sort((a, b) => a.order - b.order));
                          setDeletedChapters((prev: Chapter[]) => prev.filter(c => c.id !== chap.id));
                        }}
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-sans"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={async () => {
                          const confirm = await customConfirm("Excluir Capítulo", `Deseja realmente apagar o capítulo "${chap.title}" permanentemente? Esta ação não pode ser desfeita.`);
                          if (confirm) {
                            setDeletedChapters((prev: Chapter[]) => prev.filter(c => c.id !== chap.id));
                          }
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-sans"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deleted Planning Cards */}
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-outline-variant">
            <h4 className="text-xs font-bold text-neutral-450 dark:text-on-surface-variant uppercase tracking-widest font-sans">Cards de Planejamento</h4>
            {deletedPlanningCards.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-neutral-300 dark:border-outline-variant text-neutral-450 dark:text-neutral-550 text-xs rounded-xl font-sans italic">
                Nenhum card na lixeira.
              </div>
            ) : (
              <div className="space-y-2">
                {deletedPlanningCards.map((card: PlanningCard) => (
                  <div key={card.id} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant p-3.5 rounded-xl flex justify-between items-center text-sm shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-750">
                    <div className="overflow-hidden mr-2 flex-1">
                      <h5 className="font-serif font-bold text-neutral-900 dark:text-white truncate">{card.title}</h5>
                      <p className="text-xs text-on-surface-variant dark:text-on-surface-variant truncate mt-0.5 max-w-[240px]">{card.content}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setPlanningCards((prev: PlanningCard[]) => [...prev, card]);
                          setDeletedPlanningCards((prev: PlanningCard[]) => prev.filter(c => c.id !== card.id));
                        }}
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-sans"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={async () => {
                          const confirm = await customConfirm("Excluir Card", `Deseja realmente apagar o card "${card.title}" permanentemente? Esta ação não pode ser desfeita.`);
                          if (confirm) {
                            setDeletedPlanningCards((prev: PlanningCard[]) => prev.filter(c => c.id !== card.id));
                          }
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-sans"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
