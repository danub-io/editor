"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";
import { Trash2, RotateCcw, AlertTriangle, FileText } from "lucide-react";

export default function LixeiraPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const {
    projects,
    deletedChapters,
    restoreChapter,
    permanentDeleteChapter,
    fetchChapters,
  } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const deleted = deletedChapters.filter((c) => c.projectId === projectId);

  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    fetchChapters(projectId).finally(() => setIsLoading(false));
  }, [projectId, fetchChapters]);

  const handleRestore = (id: string) => {
    restoreChapter(id);
  };

  const handlePermanentDelete = (id: string) => {
    permanentDeleteChapter(id);
  };

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Lixeira"
      sectionLabel="Lixeira"
    >
      <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-background mb-4">
              Lixeira
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Capítulos excluídos permanecem aqui por tempo indeterminado.
              Você pode restaurá-los ou excluí-los permanentemente.
            </p>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : deleted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
            <div className="divide-y divide-outline-variant">
              {deleted.map((chapter) => (
                <div
                  key={chapter.id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="h-4 w-4 shrink-0 text-on-surface-variant/50" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {chapter.title}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {chapter.type === "chapter"
                          ? "Capítulo"
                          : chapter.type === "part_header"
                            ? "Parte / Seção"
                            : "Página Especial"}
                        {" · "}
                        {chapter.wordCount?.toLocaleString("pt-BR") || 0} palavras
                        {chapter.deletedAt &&
                          ` · Excluído em ${new Date(chapter.deletedAt).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRestore(chapter.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors rounded border border-primary/20"
                      title="Restaurar capítulo"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restaurar
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(chapter.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors rounded border border-red-200 dark:border-red-800"
                      title="Excluir permanentemente"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {deleted.length > 0 && (
          <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                A exclusão permanente é irreversível.
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Uma vez excluído permanentemente, o capítulo não poderá ser recuperado.
              </p>
            </div>
          </div>
        )}
      </main>
    </ArchiveLayout>
  );
}

function LoadingState() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-5 border-b border-outline-variant last:border-0 animate-pulse flex items-center gap-4"
        >
          <div className="h-4 w-4 bg-surface-container-high rounded" />
          <div className="flex-1">
            <div className="h-4 bg-surface-container-high rounded w-1/3 mb-2" />
            <div className="h-3 bg-surface-container-high rounded w-1/4" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-surface-container-high rounded" />
            <div className="h-8 w-20 bg-surface-container-high rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-outline-variant">
      <Trash2 className="w-12 h-12 text-on-surface-variant/40 mb-4" />
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
        A lixeira está vazia
      </p>
      <p className="font-body-md text-body-md text-on-surface-variant/70">
        Os capítulos excluídos aparecerão aqui.
      </p>
    </div>
  );
}
