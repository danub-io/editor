"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { Editor } from "@/components/editor/Editor";
import { BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Concluído",
    className: "bg-primary/15 text-primary border-primary/20",
  },
  review: {
    label: "Revisão",
    className: "bg-secondary/15 text-secondary-foreground border-secondary/20",
  },
  draft: {
    label: "Rascunho",
    className: "bg-surface-container text-on-surface-variant border-outline-variant",
  },
};

export default function ProjectPage() {
  const {
    activeChapterId,
    activeProjectId,
    projects,
    getChaptersByProject,
    fetchChapters,
    setActiveChapter,
    createChapter,
  } = useProjectStore();

  useEffect(() => {
    if (activeProjectId) {
      fetchChapters(activeProjectId);
    }
  }, [activeProjectId, fetchChapters]);

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const chapters = activeProjectId
    ? getChaptersByProject(activeProjectId)
    : [];

  const completedCount = chapters.filter(
    (c) => c.status === "completed"
  ).length;
  const totalWords = chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const targetWords = activeProject?.targetWordCount || 50000;

  const statusProgress = chapters.length > 0
    ? Math.round((completedCount / chapters.length) * 100)
    : 0;

  const wordProgress = Math.min(Math.round((totalWords / targetWords) * 100), 100);

  // Show editor when a chapter is selected
  if (activeChapterId) {
    return <Editor chapterId={activeChapterId} />;
  }

  // Writing-focused welcome view
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">
              {activeProject?.title || "Projeto"}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {activeProject?.author || "Autor"} · {chapters.length} {chapters.length === 1 ? "capítulo" : "capítulos"} · {totalWords.toLocaleString("pt-BR")} palavras
            </p>
          </div>
          {activeProjectId && (
            <a
              href={`/projects/${activeProjectId}/settings`}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              title="Configurações"
            >
              <Settings className="h-5 w-5" />
            </a>
          )}
        </div>

        {/* Empty state */}
        {chapters.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant p-12 text-center">
            <BookOpen className="h-12 w-12 text-on-surface-variant/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-on-surface mb-2">
              Seu manuscrito está vazio
            </h2>
            <p className="text-on-surface-variant mb-6">
              Crie o primeiro capítulo para começar a escrever.
            </p>
            <button
              onClick={async () => {
                if (!activeProjectId) return;
                await createChapter({
                  projectId: activeProjectId,
                  type: "chapter",
                  title: "Capítulo 1",
                  content: "",
                  number: 1,
                  status: "draft",
                  wordCount: 0,
                  tags: [],
                });
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-label-md uppercase tracking-widest hover:bg-surface-tint transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <BookOpen className="h-4 w-4" />
              Criar Primeiro Capítulo
            </button>
          </div>
        ) : (
          <>
            {/* CTA */}
            <div className="bg-surface-container-lowest border border-outline-variant p-8 text-center">
              <p className="text-on-surface-variant text-lg">
                Clique em um capítulo na barra lateral para começar a escrever
              </p>
            </div>

            {/* Progress / Word Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Status dos Capítulos
                  </h3>
                  <span className="text-xs text-on-surface-variant font-medium">{statusProgress}%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500 rounded-full"
                    style={{ width: `${statusProgress}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Meta de Palavras do Projeto
                  </h3>
                  <span className="text-xs text-on-surface-variant font-medium">{totalWords.toLocaleString("pt-BR")} / {targetWords.toLocaleString("pt-BR")}</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden relative">
                  <div
                    className="bg-[#00a2ed] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${wordProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Chapter list */}
            <div>
              <h3 className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-3">
                Capítulos
              </h3>
              <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
                <ul className="divide-y divide-outline-variant">
                  {chapters.map((chapter, i) => {
                    const status = chapter.status || "draft";
                    const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS["draft"];
                    return (
                      <li
                        key={chapter.id}
                        onClick={() => setActiveChapter(chapter.id)}
                        className="px-5 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:z-10"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm text-on-surface-variant tabular-nums w-6 shrink-0">
                            {i + 1}.
                          </span>
                          <span className="text-sm font-medium text-on-surface truncate">
                            {chapter.title}
                          </span>
                          <span className="text-xs text-on-surface-variant shrink-0">
                            {(chapter.wordCount || 0).toLocaleString("pt-BR")} pal
                          </span>
                        </div>
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-none text-[11px] font-medium border shrink-0",
                            statusInfo.className
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
