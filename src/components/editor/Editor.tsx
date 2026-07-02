"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect, useRef, useCallback, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { SelectionToolbar } from "./SelectionToolbar";
import { FindReplaceBar } from "./FindReplaceBar";
import { cn } from "@/lib/utils";
import { Check, Loader2, AlertCircle, Minimize2 } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function Editor({ chapterId }: { chapterId: string }) {
  const { getChapter, updateChapter, focusMode, toggleFocusMode } = useProjectStore();
  const chapter = getChapter(chapterId);
  const saveTimerRef = useRef<number | undefined>(undefined);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(chapter?.title || "");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [findBarOpen, setFindBarOpen] = useState(false);

  // Sync editTitle when chapter changes
  useEffect(() => {
    setEditTitle(chapter?.title || "");
  }, [chapter?.title]);

  const handleSaveTitle = useCallback(async () => {
    if (editTitle.trim() && editTitle !== chapter?.title) {
      await updateChapter(chapterId, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  }, [editTitle, chapter?.title, chapterId, updateChapter]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setEditTitle(chapter?.title || "");
      setIsEditingTitle(false);
    }
  }, [handleSaveTitle, chapter?.title]);

  // Debounced save to API (800ms after stop typing)
  const debouncedSave = useCallback(
    (html: string, wordCount: number) => {
      clearTimeout(saveTimerRef.current);

      setSaveStatus("saving");

      saveTimerRef.current = window.setTimeout(async () => {
        try {
          await updateChapter(chapterId, { content: html, wordCount });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("error");
        }
      }, 800);
    },
    [chapterId, updateChapter]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Comece a escrever seu capítulo...",
      }),
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
      }),
    ],
    content: chapter?.content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      debouncedSave(html, wordCount);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none font-serif text-lg md:text-xl leading-relaxed text-gray-800 dark:text-zinc-200 min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    if (editor && chapter && editor.getHTML() !== chapter.content) {
      editor.commands.setContent(chapter.content || "");
    }
  }, [chapterId, editor, chapter]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(saveTimerRef.current);
  }, []);

  // Ctrl+H / Cmd+H to toggle Find & Replace bar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setFindBarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-[#fbf9f5] dark:bg-[#09090b] transition-colors duration-150">
      <FindReplaceBar open={findBarOpen} onClose={() => setFindBarOpen(false)} />
      <SelectionToolbar editor={editor} focusMode={focusMode} />

      {/* Exit focus mode button */}
      {focusMode && (
        <button
          onClick={toggleFocusMode}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          title="Sair do modo foco"
          aria-label="Sair do modo foco"
        >
          <Minimize2 className="h-5 w-5" />
        </button>
      )}

      <div className={cn("flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 flex justify-center", focusMode ? "pb-32 pt-20 lg:pt-32" : "pb-32 pt-16")}>
        <div 
          className={cn(
            "w-full transition-all duration-300 bg-white dark:bg-[#121214] border border-gray-200 dark:border-zinc-800 rounded-lg p-6 sm:p-10 md:p-16 shadow-sm",
            focusMode ? "max-w-2xl" : "max-w-3xl"
          )}
        >
          <article>
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleTitleKeyDown}
                className={cn(
                  "w-full bg-transparent font-serif text-3xl font-bold text-gray-900 dark:text-zinc-100 outline-none pb-0.5 border-b border-indigo-500",
                  focusMode ? "mb-8 text-center" : "mb-6"
                )}
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className={cn(
                  "font-serif text-3xl font-bold text-gray-900 dark:text-zinc-100 outline-none cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors",
                  focusMode ? "mb-8 text-center" : "mb-6"
                )}
                title="Clique para editar o título"
              >
                {chapter?.title || "Sem Título"}
              </h1>
            )}
            <div className={cn("outline-none font-serif text-lg leading-relaxed text-gray-800 dark:text-zinc-200")}>
              <EditorContent editor={editor} />
            </div>
          </article>
        </div>
      </div>

      {/* Save status — floating pill at bottom-right */}
      {saveStatus !== "idle" && !focusMode && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1.5 border border-outline-variant">
          {saveStatus === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saveStatus === "saved" && <Check className="h-3.5 w-3.5 text-green-600" />}
          {saveStatus === "error" && <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
          <span>
            {saveStatus === "saving" && "Salvando..."}
            {saveStatus === "saved" && "Salvo"}
            {saveStatus === "error" && "Erro ao salvar"}
          </span>
        </div>
      )}
    </div>
  );
}
