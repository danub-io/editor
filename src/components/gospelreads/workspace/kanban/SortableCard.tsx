import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PlanningCard } from '@/components/gospelreads/types';
import { Pin, Trash2 } from 'lucide-react';

export function SortableCard({ card, isPinned, onTogglePin, onDelete, onClick }: {
  card: PlanningCard;
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { type: 'PlanningCard' }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // Prevent default draggable behavior from blocking click if not dragging
        onClick();
      }}
      className="w-[245px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant p-4 rounded-xl text-sm relative group space-y-2 cursor-grab active:cursor-grabbing hover:border-neutral-300 dark:hover:border-neutral-750 transition-all shadow-sm text-left flex flex-col justify-between min-h-[135px]"
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <span className="font-serif font-bold text-neutral-850 dark:text-white line-clamp-1">{card.title}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onPointerDown={(e) => { e.stopPropagation(); onTogglePin(); }}
              className="text-on-surface-variant hover:text-indigo-500 cursor-pointer transition-colors"
              title={isPinned ? "Desafixar" : "Fixar nas notas"}
            >
              <Pin size={11} className={isPinned ? "fill-indigo-500 text-indigo-500" : ""} />
            </button>
            <span className="text-neutral-350 dark:text-neutral-700 cursor-grab">⋮⋮</span>
          </div>
        </div>
        {card.images && card.images.length > 0 && (
          <img
            src={card.images[0]}
            alt="Card Preview"
            className="w-full h-20 object-cover rounded-lg border border-neutral-200 dark:border-outline-variant my-1"
          />
        )}
        <p className="text-on-surface-variant dark:text-on-surface-variant text-sm leading-relaxed font-sans mt-1.5 line-clamp-3">{card.content}</p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-outline-variant mt-2">
        <span className="text-[9px] bg-neutral-100 dark:bg-surface-container-lowest text-on-surface-variant dark:text-on-surface-variant px-2 py-0.5 rounded font-mono uppercase font-bold">{card.tag || 'Geral'}</span>
        <button
          onPointerDown={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity cursor-pointer"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}
