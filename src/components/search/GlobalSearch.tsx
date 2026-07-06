"use client";

import { useState, useEffect, useRef } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { Search, X, FileText, ChevronRight } from "lucide-react";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  type: "title" | "content";
  snippet: string;
  index: number;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const { activeProjectId, getChaptersByProject, setActiveChapter } =
    useProjectStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || !activeProjectId) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const chapters = getChaptersByProject(activeProjectId);
      const lowerQuery = query.toLowerCase();
      const newResults: SearchResult[] = [];

      chapters.forEach((chapter) => {
        // Search in title
        if (chapter.title.toLowerCase().includes(lowerQuery)) {
          newResults.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            type: "title",
            snippet: chapter.title,
            index: chapter.title.toLowerCase().indexOf(lowerQuery),
          });
        }

        // Search in content (strip HTML tags first for cleaner search)
        const plainContent = chapter.content
          ? chapter.content.replace(/<[^>]+>/g, "")
          : "";
        
        const lowerPlainContent = plainContent.toLowerCase();
        const index = lowerPlainContent.indexOf(lowerQuery);

        if (index !== -1) {
          const start = Math.max(0, index - 40);
          const end = Math.min(plainContent.length, index + query.length + 40);
          let snippet = plainContent.substring(start, end);
          
          if (start > 0) snippet = "..." + snippet;
          if (end < plainContent.length) snippet = snippet + "...";

          newResults.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            type: "content",
            snippet,
            index,
          });
        }
      });

      setResults(newResults);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [query, activeProjectId, getChaptersByProject]);

  const handleSelectResult = (chapterId: string) => {
    setActiveChapter(chapterId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-surface-container-lowest shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-200" role="dialog" aria-modal="true" aria-label="Buscar no manuscrito">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-outline-variant bg-surface-container">
          <Search className="h-5 w-5 text-on-surface-variant shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar em todo o manuscrito..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-base placeholder:text-on-surface-variant px-3 py-2 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              Nenhum resultado encontrado para "{query}"
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, i) => (
                <button
                  key={`${result.chapterId}-${result.type}-${i}`}
                  onClick={() => handleSelectResult(result.chapterId)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-container-high text-left transition-colors border-b border-outline-variant last:border-0"
                >
                  <div className="mt-0.5 p-1.5 bg-primary/10 text-primary shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-on-surface mb-1">
                      {result.chapterTitle}
                      <ChevronRight className="h-3 w-3 text-on-surface-variant" />
                      <span className="text-xs font-normal text-on-surface-variant">
                        {result.type === "title" ? "No Título" : "No Conteúdo"}
                      </span>
                    </div>
                    <div className="text-sm text-on-surface/70 truncate">
                      {result.type === "content" ? (
                        <>
                          {result.snippet.split(new RegExp(`(${query})`, "gi")).map((part, index) => 
                            part.toLowerCase() === query.toLowerCase() ? (
                              <span key={index} className="bg-yellow-200 text-yellow-900 font-medium px-0.5 rounded">
                                {part}
                              </span>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </>
                      ) : (
                        <span className="text-on-surface-variant italic">Corresponde ao título do capítulo</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="h-8 w-8 text-on-surface-variant mx-auto mb-3" />
              <p className="text-sm text-on-surface-variant">
                Digite para buscar em títulos e conteúdos de capítulos.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
                <span>Dica: Pressione</span>
                <kbd className="px-1.5 py-0.5 bg-surface-container-high border border-outline-variant font-mono">Esc</kbd>
                <span>para fechar</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
