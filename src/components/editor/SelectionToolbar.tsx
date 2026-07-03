"use client";

import { type Editor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pilcrow,
  Heading1,
  AlignLeft,
  ListOrdered,
  List,
  Quote,
  Code,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  MessageSquare,
  ChevronDown,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionToolbarProps {
  editor: Editor;
  focusMode: boolean;
}

const GAP = 10;

type Dropdown = "heading" | "align" | "script" | null;

export function SelectionToolbar({ editor, focusMode }: SelectionToolbarProps) {
  const [toolbarState, setToolbarState] = useState<{
    show: boolean;
    left: number;
    top: number;
  }>({ show: false, left: 0, top: 0 });
  const [openDropdown, setOpenDropdown] = useState<Dropdown>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  const updatePosition = useCallback(() => {
    if (!editor.view) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      setToolbarState((s) => (s.show ? { show: false, left: 0, top: 0 } : s));
      return;
    }
    try {
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);
      const centerX = (start.left + end.left) / 2;
      let top = start.top - GAP;
      if (top < 90) {
        top = end.bottom + GAP;
      }
      setToolbarState({ show: true, left: centerX, top });
    } catch {
      setToolbarState((s) => (s.show ? { show: false, left: 0, top: 0 } : s));
    }
  }, [editor]);

  useEffect(() => {
    if (!editor || focusMode) return;
    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);
    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
    };
  }, [editor, focusMode, updatePosition]);

  useEffect(() => {
    if (!editor || focusMode) return;
    const handleScroll = () => updatePosition();
    const editorDom = editor.view.dom;
    editorDom.addEventListener("scroll", handleScroll);
    return () => editorDom.removeEventListener("scroll", handleScroll);
  }, [editor, focusMode, updatePosition]);

  useEffect(() => {
    if (!toolbarState.show) closeDropdown();
  }, [toolbarState.show, closeDropdown]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, closeDropdown]);

  if (!editor || focusMode || !toolbarState.show) return null;

  const toggleDropdown = (name: Dropdown) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const btn = (
    label: string,
    icon: React.ReactNode,
    isActive: boolean,
    onClick: () => void,
  ) => (
    <button
      key={label}
      onClick={onClick}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center transition-all focus:outline-none rounded-md",
        isActive
          ? "text-[#00a2ed] dark:text-[#38bdf8] bg-sky-500/10 after:absolute after:bottom-0 after:left-1 after:right-1 after:h-[2px] after:bg-[#00a2ed] dark:after:bg-[#38bdf8]"
          : "text-slate-650 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80",
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );

  const dropdownMenu = (
    items: { label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void }[],
  ) => (
    <div className="absolute left-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] p-1 rounded-xl shadow-xl animate-fade-in">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.onClick();
            closeDropdown();
          }}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors rounded-lg",
            item.isActive
              ? "bg-[#00a2ed]/10 text-[#00a2ed] dark:text-[#38bdf8]"
              : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60",
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );

  const isPara = !editor.isActive("heading") && !editor.isActive("codeBlock") && !editor.isActive("blockquote");
  const isH1 = editor.isActive("heading", { level: 1 });
  const isH2 = editor.isActive("heading", { level: 2 });
  const isH3 = editor.isActive("heading", { level: 3 });

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 -translate-x-1/2"
      style={{ left: toolbarState.left, top: toolbarState.top }}
    >
      <div className="flex flex-col overflow-hidden border border-slate-200 dark:border-slate-850 bg-white dark:bg-[#1f2937] p-1.5 rounded-xl shadow-2xl space-y-1">
        {/* Top row — Block / Structure */}
        <div className="flex items-center gap-1">
          {btn("Parágrafo", <Pilcrow className="h-4 w-4" />, isPara, () => {
            editor.chain().focus().setParagraph().run();
            closeDropdown();
          })}

          <div className="relative">
            {btn(
              "Cabeçalho",
              <Heading1 className="h-4 w-4" />,
              isH1 || isH2 || isH3,
              () => toggleDropdown("heading"),
            )}
            {openDropdown === "heading" &&
              dropdownMenu([
                { label: "H1", icon: <Heading1 className="h-4 w-4" />, isActive: isH1, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
                { label: "H2", icon: <span className="text-[10px] font-bold">H2</span>, isActive: isH2, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                { label: "H3", icon: <span className="text-[10px] font-bold">H3</span>, isActive: isH3, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
              ])}
          </div>

          <div className="relative">
            {btn(
              "Alinhamento",
              <AlignLeft className="h-4 w-4" />,
              editor.isActive({ textAlign: "left" }) ||
                editor.isActive({ textAlign: "center" }) ||
                editor.isActive({ textAlign: "right" }) ||
                editor.isActive({ textAlign: "justify" }),
              () => toggleDropdown("align"),
            )}
            {openDropdown === "align" &&
              dropdownMenu([
                { label: "Esquerda", icon: <AlignLeft className="h-4 w-4" />, isActive: !!editor.isActive({ textAlign: "left" }), onClick: () => editor.chain().focus().setTextAlign("left").run() },
                { label: "Centro", icon: <AlignCenter className="h-4 w-4" />, isActive: !!editor.isActive({ textAlign: "center" }), onClick: () => editor.chain().focus().setTextAlign("center").run() },
                { label: "Direita", icon: <AlignRight className="h-4 w-4" />, isActive: !!editor.isActive({ textAlign: "right" }), onClick: () => editor.chain().focus().setTextAlign("right").run() },
                { label: "Justificar", icon: <AlignJustify className="h-4 w-4" />, isActive: !!editor.isActive({ textAlign: "justify" }), onClick: () => editor.chain().focus().setTextAlign("justify").run() },
              ])}
          </div>

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {btn("Lista Numerada", <ListOrdered className="h-4 w-4" />, editor.isActive("orderedList"), () => {
            editor.chain().focus().toggleOrderedList().run();
            closeDropdown();
          })}
          {btn("Lista com Marcadores", <List className="h-4 w-4" />, editor.isActive("bulletList"), () => {
            editor.chain().focus().toggleBulletList().run();
            closeDropdown();
          })}

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {btn("Citação", <Quote className="h-4 w-4" />, editor.isActive("blockquote"), () => {
            editor.chain().focus().toggleBlockquote().run();
            closeDropdown();
          })}
          {btn("Código", <Code className="h-4 w-4" />, editor.isActive("code"), () => {
            editor.chain().focus().toggleCode().run();
            closeDropdown();
          })}
        </div>

        {/* Bottom row — Character formatting / Inserts */}
        <div className="flex items-center gap-1">
          {btn("Negrito", <Bold className="h-4 w-4" />, editor.isActive("bold"), () => {
            editor.chain().focus().toggleBold().run();
          })}
          {btn("Itálico", <Italic className="h-4 w-4" />, editor.isActive("italic"), () => {
            editor.chain().focus().toggleItalic().run();
          })}
          {btn("Sublinhado", <Underline className="h-4 w-4" />, editor.isActive("underline"), () => {
            editor.chain().focus().toggleUnderline().run();
          })}
          {btn("Tachado", <Strikethrough className="h-4 w-4" />, editor.isActive("strike"), () => {
            editor.chain().focus().toggleStrike().run();
          })}

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="relative">
            {btn(
              "Sobrescrito",
              <span className="text-[11px] font-semibold leading-none">
                X<sup>a</sup>
              </span>,
              editor.isActive("superscript") || editor.isActive("subscript"),
              () => toggleDropdown("script"),
            )}
            {openDropdown === "script" &&
              dropdownMenu([
                { label: "Sobrescrito", icon: <span className="text-[11px] font-semibold leading-none">X<sup>a</sup></span>, isActive: !!editor.isActive("superscript"), onClick: () => editor.chain().focus().toggleSuperscript().run() },
                { label: "Subscrito", icon: <span className="text-[11px] font-semibold leading-none">X<sub>a</sub></span>, isActive: !!editor.isActive("subscript"), onClick: () => editor.chain().focus().toggleSubscript().run() },
              ])}
          </div>

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {btn("Link", <Link className="h-4 w-4" />, editor.isActive("link"), () => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              const url = window.prompt("URL do link:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }
            closeDropdown();
          })}
          {btn("Comentário", <MessageSquare className="h-4 w-4" />, false, () => {
            const comment = window.prompt("Adicionar comentário ao trecho selecionado:");
            if (comment) {
              editor.chain().focus().run();
            }
            closeDropdown();
          })}
        </div>
      </div>
    </div>
  );
}
