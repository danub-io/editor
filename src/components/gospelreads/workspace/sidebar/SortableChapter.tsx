import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Chapter } from '@/components/gospelreads/types';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export function SortableChapter({
  chapter,
  idx,
  arrLength,
  activeChapterId,
  setActiveChapterId,
  moveChapterInSection,
  deleteChapter
}: {
  chapter: Chapter;
  idx: number;
  arrLength: number;
  activeChapterId: string;
  setActiveChapterId: (id: string) => void;
  moveChapterInSection: (id: string, dir: 'up'|'down') => void;
  deleteChapter: (id: string, e: React.MouseEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: chapter.id,
    data: { type: 'Chapter', chapter }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setActiveChapterId(chapter.id)}
      className={`group flex items-center justify-between p-2.5 cursor-pointer border rounded-xl cursor-grab active:cursor-grabbing ${
        chapter.id === activeChapterId
          ? 'border-indigo-500 bg-indigo-500/10 font-medium text-indigo-300'
          : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-lowest/40 hover:text-on-surface'
      } transition-colors duration-150`}
    >
      <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
        <span className="text-[11px] font-mono text-on-surface-variant shrink-0">#{idx + 1}</span>
        <span className="text-sm truncate font-serif">{chapter.title || 'Sem título'}</span>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 z-10" onPointerDown={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => { e.stopPropagation(); moveChapterInSection(chapter.id, 'up'); }}
          disabled={idx === 0}
          className="p-0.5 hover:bg-neutral-800 text-on-surface-variant hover:text-on-surface rounded disabled:opacity-30 cursor-pointer"
          title="Subir"
        >
          <ChevronUp size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); moveChapterInSection(chapter.id, 'down'); }}
          disabled={idx === arrLength - 1}
          className="p-0.5 hover:bg-neutral-800 text-on-surface-variant hover:text-on-surface rounded disabled:opacity-30 cursor-pointer"
          title="Descer"
        >
          <ChevronDown size={12} />
        </button>
        <button
          onClick={(e) => deleteChapter(chapter.id, e)}
          className="p-0.5 hover:bg-red-950/40 text-red-400 rounded cursor-pointer"
          title="Excluir"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
