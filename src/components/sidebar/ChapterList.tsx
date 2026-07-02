"use client";

import { useProjectStore } from "@/stores/projectStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  FileText,
  BookOpen,
  ScrollText,
  BookMarked,
  ListOrdered,
  Quote,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Chapter } from "@/types";

const FRONT_MATTER_ICONS: Record<string, React.ElementType> = {
  copyright: ScrollText,
  dedication: BookMarked,
  toc: ListOrdered,
  epigraph: Quote,
  preface: Bookmark,
  introduction: FileText,
};

function SortableItem({
  chapter,
  showNumbers,
  isActive,
  bodyIndex,
  onSelect,
}: {
  chapter: Chapter;
  showNumbers: boolean;
  isActive: boolean;
  bodyIndex?: number;
  onSelect?: () => void;
}) {
  const { setActiveChapter, deleteChapter } = useProjectStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isPart = chapter.type === "part_header";
  const isFrontMatter = chapter.type === "front_matter";
  const FMIcon = isFrontMatter
    ? FRONT_MATTER_ICONS[chapter.subType || ""] || FileText
    : null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteChapter(chapter.id);
  };

  // Part header row
  if (isPart) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveChapter(chapter.id); onSelect?.(); } }}
        className={cn(
          "group flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          isActive
            ? "bg-surface-container-high text-on-surface"
            : "text-sidebar-fg/60 hover:bg-sidebar-muted hover:text-sidebar-fg",
          isDragging && "bg-surface-container-lowest z-10"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing shrink-0 outline-none"
        >
          <GripVertical className="h-3 w-3" />
        </div>
        <ChevronIcon />
        <span className="text-[11px] font-bold uppercase tracking-wider truncate flex-1">
          {chapter.title}
        </span>
        <button
          onClick={handleDelete}
          className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded text-sidebar-fg/40 hover:text-red-500 transition-all"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveChapter(chapter.id); onSelect?.(); } }}
      className={cn(
        "group flex items-center gap-1.5 pr-2 py-1.5 cursor-pointer transition-all duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isPart ? "pl-4" : "pl-4",
        isActive
          ? "bg-surface-container-high text-on-surface"
          : "text-sidebar-fg/70 hover:bg-sidebar-muted hover:text-sidebar-fg",
        isDragging && "bg-surface-container-lowest z-10"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing shrink-0 outline-none text-sidebar-fg/40"
      >
        <GripVertical className="h-3 w-3" />
      </div>

      {/* Number or icon */}
      {isFrontMatter && FMIcon ? (
        <span className="w-5 shrink-0 flex justify-center" />
      ) : showNumbers && bodyIndex !== undefined ? (
        <span
          className={cn(
            "text-[11px] w-5 text-right tabular-nums shrink-0",
            isActive ? "text-primary font-semibold" : "text-sidebar-fg/40"
          )}
        >
          {bodyIndex}
        </span>
      ) : null}

      {/* Title */}
      <span className="text-[13px] truncate flex-1 leading-tight">
        {chapter.title}
      </span>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded text-sidebar-fg/40 hover:text-red-500 transition-all"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-3 w-3 shrink-0"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="4,2 8,6 4,10" />
    </svg>
  );
}

export function ChapterList({
  chapters: inputChapters,
  showNumbers,
  section,
  onSelect,
}: {
  chapters: Chapter[];
  showNumbers: boolean;
  section: "front_matter" | "body";
  onSelect?: () => void;
}) {
  const {
    activeProjectId,
    reorderChapters,
    activeChapterId,
    chapters: storeChapters,
  } = useProjectStore();

  const [localChapters, setLocalChapters] = useState<Chapter[]>(inputChapters);

  useEffect(() => {
    setLocalChapters(inputChapters);
  }, [inputChapters, storeChapters]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && activeProjectId) {
      setLocalChapters((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        reorderChapters(
          activeProjectId,
          newItems.map((i) => i.id)
        );
        return newItems;
      });
    }
  };

  if (localChapters.length === 0) {
    return (
      <div className="px-5 py-3 text-[13px] text-on-surface-variant italic">
        {section === "front_matter"
          ? "Nenhuma página. Use Add para adicionar."
          : "Nenhum capítulo. Use Add para adicionar."}
      </div>
    );
  }

  // Track chapter numbering (skip part headers)
  let chapterCounter = 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localChapters.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {localChapters.map((chapter) => {
            let bodyIndex: number | undefined;
            if (chapter.type === "chapter") {
              chapterCounter++;
              bodyIndex = chapterCounter;
            }
            return (
              <SortableItem
                key={chapter.id}
                chapter={chapter}
                showNumbers={showNumbers}
                isActive={activeChapterId === chapter.id}
                bodyIndex={bodyIndex}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
