"use client";

import { useCallback, useEffect, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { ChapterList } from "./ChapterList";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Users,
  Map,
  Clock,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileText,
  BookMarked,
  ListOrdered,
  Quote,
  ScrollText,
  Bookmark,
  Settings,
  Sun,
  Moon,
  Search,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type FrontMatterSubType = "copyright" | "dedication" | "toc" | "epigraph" | "preface" | "introduction";

const FRONT_MATTER_OPTIONS: { subType: FrontMatterSubType; title: string; icon: React.ElementType }[] = [
  { subType: "copyright", title: "Copyright", icon: ScrollText },
  { subType: "dedication", title: "Dedicatória", icon: BookMarked },
  { subType: "toc", title: "Sumário", icon: ListOrdered },
  { subType: "epigraph", title: "Epígrafe", icon: Quote },
  { subType: "preface", title: "Prefácio", icon: Bookmark },
  { subType: "introduction", title: "Introdução", icon: FileText },
];

/* ──────────────────────────────────────────────────────────────
 * SidebarContent — the actual sidebar UI, no overlay/positioning
 * ────────────────────────────────────────────────────────────── */
function SidebarContent({ onClose }: { onClose: () => void }) {
  const {
    activeProjectId,
    createChapter,
    fetchChapters,
    getChaptersByProject,
  } = useProjectStore();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const handleChapterSelect = useCallback(() => {
    if (activeProjectId) router.push(`/projects/${activeProjectId}`);
    onClose();
  }, [activeProjectId, router, onClose]);
  const [frontMatterExpanded, setFrontMatterExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  useEffect(() => {
    if (activeProjectId) fetchChapters(activeProjectId);
  }, [activeProjectId, fetchChapters]);

  // Hydration guard for theme toggle
  useEffect(() => setMounted(true), []);

  const allChapters = activeProjectId
    ? getChaptersByProject(activeProjectId)
    : [];

  const frontMatterPages = allChapters.filter((c) => c.type === "front_matter");
  const bodyChapters = allChapters.filter(
    (c) => c.type === "chapter" || c.type === "part_header"
  );
  const totalWords = allChapters.reduce(
    (acc, c) => acc + (c.wordCount || 0),
    0
  );

  const handleAddChapter = async () => {
    if (!activeProjectId) return;
    const bodyOnly = allChapters.filter((c) => c.type === "chapter");
    await createChapter({
      projectId: activeProjectId,
      type: "chapter",
      title: `Capítulo ${bodyOnly.length + 1}`,
      content: "",
      number: allChapters.length + 1,
      status: "draft",
      wordCount: 0,
      tags: [],
    });
    setAddMenuOpen(false);
  };

  const handleAddPart = async () => {
    if (!activeProjectId) return;
    const parts = allChapters.filter((c) => c.type === "part_header");
    await createChapter({
      projectId: activeProjectId,
      type: "part_header",
      title: `Parte ${parts.length + 1}`,
      content: "",
      number: allChapters.length + 1,
      status: "draft",
      wordCount: 0,
      tags: [],
    });
    setAddMenuOpen(false);
  };

  const handleAddFrontMatter = async (
    subType: FrontMatterSubType,
    title: string
  ) => {
    if (!activeProjectId) return;
    // Check if already exists
    const exists = frontMatterPages.some((c) => c.subType === subType);
    if (exists) {
      setAddMenuOpen(false);
      return;
    }
    await createChapter({
      projectId: activeProjectId,
      type: "front_matter",
      subType,
      title,
      content: "",
      number: frontMatterPages.length + 1,
      status: "draft",
      wordCount: 0,
      tags: [],
    });
    setAddMenuOpen(false);
  };

  if (!activeProjectId) return null;

  const isActive = (path: string) => pathname === path;

  const ThemeIcon = mounted ? (resolvedTheme === "dark" ? Sun : Moon) : null;

  return (
    <>
      {/* ── Sidebar main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href={`/projects/${activeProjectId}`}
            className="text-[15px] font-semibold text-sidebar-fg"
          >
            Manuscrito
          </Link>
          <div className="relative">
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded hover:bg-sidebar-muted"
            >
              Adicionar
              <Plus className="h-4 w-4" />
            </button>

            {/* Add Dropdown */}
            {addMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAddMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-0 z-50 w-52 bg-surface-container-lowest border border-outline-variant py-1 text-[13px]">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-semibold">
                    Corpo
                  </div>
                  <button
                    onClick={handleAddChapter}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <FileText className="h-4 w-4 text-on-surface-variant" />
                    Capítulo
                  </button>
                  <button
                    onClick={handleAddPart}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <BookOpen className="h-4 w-4 text-on-surface-variant" />
                    Parte / Seção
                  </button>

                  <div className="my-1" />

                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-semibold">
                    Páginas Especiais
                  </div>
                  {FRONT_MATTER_OPTIONS.map((opt) => {
                    const exists = frontMatterPages.some(
                      (c) => c.subType === opt.subType
                    );
                    return (
                      <button
                        key={opt.subType}
                        onClick={() =>
                          handleAddFrontMatter(opt.subType, opt.title)
                        }
                        disabled={exists}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          exists
                            ? "text-on-surface-variant cursor-not-allowed"
                            : "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                        )}
                      >
                        <opt.icon className="h-4 w-4 text-on-surface-variant" />
                        {opt.title}
                        {exists && (
                          <span className="ml-auto text-[10px] text-on-surface-variant">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Front Matter Section */}
          <div>
            <button
              onClick={() => setFrontMatterExpanded(!frontMatterExpanded)}
              className="w-full flex items-center justify-between px-5 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-sidebar-fg/60 hover:text-sidebar-fg transition-colors"
            >
              <span className="flex items-center gap-1.5">
                {frontMatterExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Páginas Iniciais
              </span>
            </button>
            {frontMatterExpanded && (
              <div className="pb-1">
                <ChapterList
                  chapters={frontMatterPages}
                  showNumbers={false}
                  section="front_matter"
                  onSelect={handleChapterSelect}
                />
              </div>
            )}
          </div>

          {/* Body Section */}
          <div>
            <button
              onClick={() => setBodyExpanded(!bodyExpanded)}
              className="w-full flex items-center justify-between px-5 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-sidebar-fg/60 hover:text-sidebar-fg transition-colors"
            >
              <span className="flex items-center gap-1.5">
                {bodyExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Conteúdo Principal
              </span>
            </button>
            {bodyExpanded && (
              <div className="pb-1">
                <ChapterList
                  chapters={bodyChapters}
                  showNumbers={true}
                  section="body"
                  onSelect={handleChapterSelect}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div>
          {/* Word count */}
          <div className="px-5 py-3 text-[13px] text-sidebar-fg/60 tabular-nums">
            {totalWords.toLocaleString("pt-BR")} palavras
          </div>

          {/* Navigation */}
          <div className="px-3 py-3 space-y-1">
            <FooterNavItem
              icon={Users}
              label="Personagens"
              href={`/projects/${activeProjectId}/personagens`}
              active={isActive(`/projects/${activeProjectId}/personagens`)}
            />
            <FooterNavItem
              icon={Map}
              label="Locais"
              href={`/projects/${activeProjectId}/locais`}
              active={isActive(`/projects/${activeProjectId}/locais`)}
            />
            <FooterNavItem
              icon={Clock}
              label="Timeline"
              href={`/projects/${activeProjectId}/timeline`}
              active={isActive(`/projects/${activeProjectId}/timeline`)}
            />
            <FooterNavItem
              icon={Settings}
              label="Configurações"
              href={`/projects/${activeProjectId}/settings`}
              active={isActive(`/projects/${activeProjectId}/settings`)}
            />
            {/* Search button */}
            <button
              onClick={() => {
                const event = new CustomEvent("open-global-search");
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-sidebar-fg/70 hover:text-sidebar-fg hover:bg-sidebar-muted transition-colors w-full"
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-sidebar-fg/40" />
              Pesquisar
            </button>
            {/* Lixeira */}
            <FooterNavItem
              icon={Trash2}
              label="Lixeira"
              href={`/projects/${activeProjectId}/lixeira`}
              active={isActive(`/projects/${activeProjectId}/lixeira`)}
            />
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] text-sidebar-fg/70 hover:text-sidebar-fg hover:bg-sidebar-muted transition-colors w-full"
            >
              {ThemeIcon ? <ThemeIcon className="h-3.5 w-3.5 shrink-0 text-sidebar-fg/40" /> : <span className="h-3.5 w-3.5 shrink-0" />}
              {mounted ? (resolvedTheme === "dark" ? "Tema Claro" : "Tema Escuro") : "Tema"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Desktop Sidebar — fixed positioning, CSS transform (no overlay)
 * ────────────────────────────────────────────────────────────── */
export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { activeProjectId } = useProjectStore();
  if (!activeProjectId) return null;

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 flex h-full z-30 bg-sidebar text-sidebar-fg select-none transition-transform duration-200 ease-out flex-col w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarContent onClose={onClose} />
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Mobile Sidebar Content — for use inside shadcn Sheet
 * ────────────────────────────────────────────────────────────── */
export function MobileSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  const { activeProjectId } = useProjectStore();
  if (!activeProjectId) return null;

  return (
    <div className="flex h-full flex-row bg-sidebar text-sidebar-fg select-none relative">
      {/* Close chevron — always visible above sidebar content */}
      <button
        onClick={onClose}
        className="absolute left-3 top-4 z-50 flex items-center justify-center w-8 h-8 transition-colors text-on-surface-variant hover:text-on-surface hover:bg-sidebar-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Fechar painel"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <SidebarContent onClose={onClose} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────── */

function FooterNavItem({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] transition-all duration-150",
            active
              ? "text-sidebar-fg bg-sidebar-muted"
              : "text-sidebar-fg/70 hover:text-sidebar-fg hover:bg-sidebar-muted"
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0 text-sidebar-fg/40" />
          {label}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
