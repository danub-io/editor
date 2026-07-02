"use client";

import { useState, useEffect, useRef } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// window.find is a legacy DOM API available in all browsers but not in TS lib types
declare global {
  interface Window {
    find(
      searchString: string,
      caseSensitive?: boolean,
      backwards?: boolean,
      wrapAround?: boolean,
      wholeWord?: boolean,
      searchInFrames?: boolean,
      showDialog?: boolean,
    ): boolean;
  }
}

interface FindReplaceBarProps {
  open: boolean;
  onClose: () => void;
}

export function FindReplaceBar({ open, onClose }: FindReplaceBarProps) {
  const { activeChapterId, getChapter, updateChapter } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [searchOnlyThisChapter, setSearchOnlyThisChapter] = useState(true);
  const findInputRef = useRef<HTMLInputElement>(null);

  // Focus find input when bar opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => findInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleFind = () => {
    if (!searchQuery.trim()) return;
    const found = window.find(
      searchQuery,
      false, // caseSensitive
      false, // backwards
      true,  // wrapAround
      false, // wholeWord
      false, // searchInFrames
      false, // showDialog
    );
    if (!found) {
      toast.info("Nenhuma ocorrência encontrada.");
    }
  };

  const handleReplace = () => {
    if (!searchQuery.trim()) return;
    const chapter = activeChapterId ? getChapter(activeChapterId) : null;
    if (!chapter) {
      toast.info("Nenhum capítulo ativo para substituir.");
      return;
    }
    const newContent = chapter.content.replaceAll(searchQuery, replaceQuery);
    if (newContent === chapter.content) {
      toast.info("Nenhuma ocorrência para substituir.");
      return;
    }
    updateChapter(activeChapterId!, { content: newContent });
    toast.success("Substituição concluída.");
  };

  const handleReplaceAll = () => {
    if (!searchQuery.trim()) return;
    const chapter = activeChapterId ? getChapter(activeChapterId) : null;
    if (!chapter) {
      toast.info("Nenhum capítulo ativo.");
      return;
    }
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const count = (chapter.content.match(new RegExp(escaped, "g")) || []).length;
    if (count === 0) {
      toast.info("Nenhuma ocorrência encontrada.");
      return;
    }
    const newContent = chapter.content.replaceAll(searchQuery, replaceQuery);
    updateChapter(activeChapterId!, { content: newContent });
    toast.success(`${count} ocorrência(s) substituída(s).`);
  };

  // Enter in find field triggers find
  const handleFindKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFind();
    }
  };

  if (!open) return null;

  return (
    <div className="bg-surface-container-lowest border-b border-outline-variant px-4 py-3 flex items-center gap-3 shrink-0">
      <input
        ref={findInputRef}
        type="text"
        placeholder="Localizar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleFindKeyDown}
        className="w-48 bg-surface-container border border-outline-variant px-3 py-1.5 text-[13px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary placeholder:text-on-surface-variant"
      />
      <input
        type="text"
        placeholder="Substituir..."
        value={replaceQuery}
        onChange={(e) => setReplaceQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleReplace();
          }
        }}
        className="w-48 bg-surface-container border border-outline-variant px-3 py-1.5 text-[13px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary placeholder:text-on-surface-variant"
      />

      {/* Toggle: search only this chapter */}
      <button
        onClick={() => setSearchOnlyThisChapter(!searchOnlyThisChapter)}
        className="flex items-center gap-1.5 text-[12px] text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
        title={searchOnlyThisChapter ? "Buscando apenas neste capítulo" : "Buscando em todo o manuscrito"}
      >
        <span
          className={cn(
            "w-8 h-[18px] rounded-full relative transition-colors duration-200 inline-block",
            searchOnlyThisChapter ? "bg-primary" : "bg-surface-container-high"
          )}
        >
          <span
            className={cn(
              "w-3.5 h-3.5 bg-surface rounded-full absolute top-[2px] shadow-sm transition-transform duration-200",
              searchOnlyThisChapter ? "translate-x-4 left-[1px]" : "left-[2px]"
            )}
          />
        </span>
        Este cap.
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={handleFind}
          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Localizar
        </button>
        <button
          onClick={handleReplace}
          className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-lowest text-[12px] font-medium text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Substituir
        </button>
        <button
          onClick={handleReplaceAll}
          className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-lowest text-[12px] font-medium text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Tudo
        </button>
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        title="Fechar (Esc)"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
