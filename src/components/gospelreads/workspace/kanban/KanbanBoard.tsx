import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCard } from './SortableCard';
import { DroppableSection } from './DroppableSection';
import { useEditorStore } from '@/stores/editorStore';
import { Plus, X, Trash2, Pin } from 'lucide-react';

export function KanbanBoard({
  onAddCard,
  onRenameSection,
  onDeleteSection,
  onAddSection,
  onCardClick
}: {
  onAddCard: (colId: string) => void;
  onRenameSection: (id: string, name: string) => void;
  onDeleteSection: (id: string) => void;
  onAddSection: () => void;
  onCardClick: (id: string) => void;
}) {
  const { planningSections, planningCards, setPlanningCards, pinnedCardsList, setPinnedCardsList, setDeletedPlanningCards } = useEditorStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Sort logic within the same column or across columns will require deeper refactoring in dnd-kit.
    // To save time, if they drop it over a column, we change the column id.
    const activeId = active.id as string;
    const overId = over.id as string;

    const overSection = planningSections.find(s => s.id === overId);

    if (overSection) {
      setPlanningCards(prev => prev.map(c => c.id === activeId ? { ...c, column: overSection.id } : c));
    }
  };

  const togglePinCard = (id: string) => {
    setPinnedCardsList(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      return [...prev, id];
    });
  };

  const deletePlanningCard = (id: string) => {
    const card = planningCards.find(c => c.id === id);
    if (card) {
      setDeletedPlanningCards(prev => [...prev, card]);
      setPlanningCards(prev => prev.filter(c => c.id !== id));
      setPinnedCardsList(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-y-auto p-8 bg-surface dark:bg-surface text-neutral-800 dark:text-on-surface space-y-10 select-none">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-outline-variant pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <h2 className="text-xl font-bold font-serif text-neutral-900 dark:text-white tracking-wide">Planning</h2>
          </div>
          <button
            onClick={onAddSection}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            Nova Seção <Plus size={14} />
          </button>
        </div>

        <div className="space-y-8 text-left">
          {planningSections.map(section => (
            <div key={section.id} id={section.id} className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-outline-variant pb-2">
                <div className="flex items-center gap-2 select-none">
                  <span
                    onClick={() => onRenameSection(section.id, section.name)}
                    className="text-lg font-bold text-neutral-800 dark:text-on-surface font-serif cursor-pointer hover:text-indigo-600"
                  >
                    {section.name}
                  </span>
                  {planningSections.length > 1 && (
                    <button
                      onClick={() => onDeleteSection(section.id)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer ml-2"
                      title="Excluir Seção"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onAddCard(section.id)}
                  className="bg-neutral-50 dark:bg-surface-container-lowest hover:bg-neutral-100 dark:hover:bg-neutral-850 text-indigo-600 dark:text-indigo-400 border border-neutral-200 dark:border-outline-variant text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  Add <Plus size={12} />
                </button>
              </div>

              <DroppableSection id={section.id} className="flex flex-wrap gap-4 min-h-[150px] p-2 -m-2">
                {planningCards.filter(c => c.column === section.id).map(card => {
                  const isPinned = pinnedCardsList.includes(card.id);
                  return (
                    <SortableCard
                      key={card.id}
                      card={card}
                      isPinned={isPinned}
                      onTogglePin={() => togglePinCard(card.id)}
                      onDelete={() => deletePlanningCard(card.id)}
                      onClick={() => onCardClick(card.id)}
                    />
                  );
                })}
                {planningCards.filter(c => c.column === section.id).length === 0 && (
                  <div className="text-on-surface-variant dark:text-neutral-600 text-xs italic font-sans py-2 select-none">Sem cards nesta seção. Clique em "Add +" para criar.</div>
                )}
              </DroppableSection>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
