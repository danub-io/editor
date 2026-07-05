import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function DroppableSection({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className || ''} ${isOver ? 'bg-indigo-50/10 dark:bg-indigo-900/10 rounded-xl' : ''}`}
    >
      {children}
    </div>
  );
}
