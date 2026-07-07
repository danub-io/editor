"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";

function formatDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function LoadingSkeleton() {
  return (
    <div className="flex-1 px-edge-margin-desktop py-12 animate-pulse">
      <div className="max-w-container-max mx-auto space-y-section-gap">
        <div className="border-b border-outline-variant pb-6 mb-12">
          <div className="h-12 w-64 bg-surface-dim mb-2" />
          <div className="h-6 w-96 bg-surface-dim" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-gutter gap-y-12">
          <div className="lg:col-span-8">
            <div className="h-[280px] bg-surface-dim" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-[280px] bg-surface-dim" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductionTimelinePage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const { projects, fetchChapters, getChaptersByProject } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!projectId) return;
    fetchChapters(projectId).finally(() => setIsLoading(false));
  }, [projectId, fetchChapters]);

  const chapters = getChaptersByProject(projectId);

  const sortedChapters = useMemo(
    () => [...chapters].sort((a, b) => a.number - b.number),
    [chapters]
  );

  const { totalWords, draftCount, reviewCount, completedCount } = useMemo(() => {
    let words = 0;
    let draft = 0;
    let review = 0;
    let completed = 0;

    for (let i = 0; i < chapters.length; i++) {
      const c = chapters[i];
      words += c.wordCount || 0;
      if (c.status === "draft") draft++;
      else if (c.status === "review") review++;
      else if (c.status === "completed") completed++;
    }

    return {
      totalWords: words,
      draftCount: draft,
      reviewCount: review,
      completedCount: completed
    };
  }, [chapters]);

  const totalChapters = chapters.length;

  const maxWordCount = useMemo(
    () => Math.max(1, ...sortedChapters.map((c) => c.wordCount || 0)),
    [sortedChapters]
  );

  // Activity map: YYYY-MM-DD → chapter titles
  const activityMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const ch of chapters) {
      const created = formatDateKey(ch.createdAt);
      const updated = formatDateKey(ch.updatedAt);
      if (!map.has(created)) map.set(created, []);
      map.get(created)!.push(ch.title);
      if (updated !== created) {
        if (!map.has(updated)) map.set(updated, []);
        map.get(updated)!.push(ch.title);
      }
    }
    return map;
  }, [chapters]);

  // Calendar generation
  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const startDate = new Date(year, month, 1 - firstDayOfWeek);

    const days: {
      date: Date;
      key: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      hasActivity: boolean;
      activityTitles: string[];
    }[] = [];

    for (let i = 0; i < 35; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = formatDateKey(d);
      days.push({
        date: d,
        key,
        isCurrentMonth: d.getMonth() === month,
        isToday: key === formatDateKey(today),
        hasActivity: activityMap.has(key),
        activityTitles: activityMap.get(key) || [],
      });
    }
    return days;
  }, [activityMap]);

  const monthName = new Date().toLocaleString("pt-BR", { month: "long" });

  // Roadmap stage logic
  const roadmapStages = useMemo(() => {
    const stages: {
      id: string;
      label: string;
      title: string;
      description: string;
      state: "completed" | "active" | "upcoming";
      reviewChapters?: typeof chapters;
    }[] = [];

    // Rascunho
    let rascunhoState: "completed" | "active" | "upcoming" = "upcoming";
    if (totalChapters > 0) {
      if (draftCount === 0) rascunhoState = "completed";
      else rascunhoState = "active";
    }
    stages.push({
      id: "draft",
      label: "Fase 1",
      title: "Rascunho",
      description: `${draftCount} de ${totalChapters} capítulos em rascunho — ${totalWords.toLocaleString("pt-BR")} palavras escritas.`,
      state: rascunhoState,
    });

    // Revisão
    let revisaoState: "completed" | "active" | "upcoming" = "upcoming";
    if (totalChapters > 0) {
      if (reviewCount === 0 && draftCount === 0) revisaoState = "completed";
      else if (reviewCount > 0 || (draftCount === 0 && totalChapters > 0))
        revisaoState = "active";
    }
    stages.push({
      id: "review",
      label: "Fase 2",
      title: "Revisão",
      description: `${reviewCount} capítulos em revisão editorial.`,
      state: revisaoState,
      reviewChapters: chapters.filter(
        (c) => c.status === "review" || c.status === "completed"
      ),
    });

    // Revisão Final
    let revisaoFinalState: "completed" | "active" | "upcoming" = "upcoming";
    if (totalChapters > 0) {
      if (completedCount === totalChapters) revisaoFinalState = "completed";
      else if (completedCount > 0 && (draftCount > 0 || reviewCount > 0))
        revisaoFinalState = "active";
    }
    stages.push({
      id: "final_review",
      label: "Fase 3",
      title: "Revisão Final",
      description: `${completedCount} de ${totalChapters} capítulos finalizados.`,
      state: revisaoFinalState,
    });

    // Publicação
    stages.push({
      id: "publication",
      label: "Fase 4",
      title: "Publicação",
      description:
        "Pronto para formatação final, exportação e distribuição.",
      state: "upcoming" as const,
    });

    return stages;
  }, [
    totalChapters,
    draftCount,
    reviewCount,
    completedCount,
    totalWords,
    chapters,
  ]);

  const barColor = (status?: string) => {
    if (status === "completed") return "bg-primary";
    if (status === "review") return "bg-outline";
    return "bg-surface-dim";
  };

  const xAxisLabels = useMemo(() => {
    if (sortedChapters.length <= 4)
      return sortedChapters.map((c) => c.title || `Cap. ${c.number}`);
    return [
      sortedChapters[0]?.title || `Cap. ${sortedChapters[0]?.number}`,
      "…",
      sortedChapters[Math.floor(sortedChapters.length / 2)]?.title || "…",
      sortedChapters[sortedChapters.length - 1]?.title ||
        `Cap. ${sortedChapters[sortedChapters.length - 1]?.number}`,
    ];
  }, [sortedChapters]);

  if (isLoading) {
    return (
      <ArchiveLayout
        projectId={projectId}
        projectTitle={project?.title || "Projeto"}
        sectionTitle="Produção"
        sectionLabel="Produção"
      >
        <LoadingSkeleton />
      </ArchiveLayout>
    );
  }

  if (!projectId) {
    return (
      <ArchiveLayout
        projectId=""
        projectTitle="Projeto não encontrado"
        sectionTitle="Produção"
        sectionLabel="Produção"
      >
        <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
          <div className="max-w-container-max mx-auto">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Projeto não encontrado.
            </p>
          </div>
        </main>
      </ArchiveLayout>
    );
  }

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Produção"
      sectionLabel="Produção"
    >
      <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
        <div className="max-w-container-max mx-auto space-y-section-gap">
          {/* Header */}
          <section className="border-b border-primary pb-6 mb-12">
            <h2 className="font-display-lg text-display-lg text-on-background mb-2">
              Produção
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Acompanhe o progresso do seu manuscrito, atividade recente e
              marcos da publicação.
            </p>
          </section>

          {/* Bento Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-gutter gap-y-12">
            {/* Section A: Writing Progress bar chart */}
            <div className="lg:col-span-8">
              <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-6">
                <h2 className="font-headline-md text-headline-md text-on-background">
                  Progresso de Escrita
                </h2>
                <span className="font-label-md uppercase tracking-widest text-on-surface-variant">
                  Total: {totalWords.toLocaleString("pt-BR")} palavras
                </span>
              </div>

              {sortedChapters.length === 0 ? (
                <div className="flex items-center justify-center h-[280px] border border-outline-variant">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Sem capítulos ainda
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex-1 min-h-[240px] flex flex-col justify-end relative mt-4">
                    {/* Y-axis grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-t border-outline-variant w-full h-0" />
                      <div className="border-t border-surface-dim w-full h-0" />
                      <div className="border-t border-surface-dim w-full h-0" />
                      <div className="border-t border-surface-dim w-full h-0" />
                    </div>

                    {/* Bars */}
                    <div className="relative z-10 flex items-end justify-between h-[200px] gap-2 md:gap-4 px-2 pb-[1px]">
                      {sortedChapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="w-full max-w-[32px] group relative cursor-crosshair transition-colors"
                          style={{
                            height: `${Math.max(5, (chapter.wordCount || 0) / maxWordCount * 100)}%`,
                          }}
                        >
                          <div
                            className={`w-full h-full ${barColor(chapter.status)} ${chapter.status !== "completed" ? "hover:bg-primary" : ""} transition-colors`}
                          />
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-caption text-caption px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                            {chapter.title}
                            <br />
                            {(chapter.wordCount || 0).toLocaleString("pt-BR")}{" "}
                            palavras
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-4 text-on-surface-variant font-caption text-caption uppercase tracking-widest px-2">
                      {xAxisLabels.map((label, i) => (
                        <span
                          key={i}
                          className="truncate max-w-[60px] text-center"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section B: Activity Calendar */}
            <div className="lg:col-span-4">
              <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-6">
                <h2 className="font-headline-md text-headline-md text-on-background">
                  Atividade
                </h2>
                <span className="font-label-md uppercase tracking-widest text-on-surface-variant">
                  {monthName}
                </span>
              </div>

              <div className="grid grid-cols-7 border-t border-l border-outline-variant text-center bg-surface">
                {/* Day headers */}
                {DAY_LABELS.map((day, i) => (
                  <div
                    key={i}
                    className="py-2 border-b border-r border-outline-variant font-caption text-caption text-on-surface-variant"
                  >
                    {day}
                  </div>
                ))}

                {/* Day cells */}
                {calendarDays.map((day, i) => {
                  let cellClass =
                    "py-1 px-1 border-b border-r border-outline-variant flex flex-col items-start justify-start min-h-[36px] group";
                  if (!day.isCurrentMonth)
                    cellClass += " text-on-surface-variant opacity-30";
                  else cellClass += " text-primary";
                  if (day.hasActivity)
                    cellClass +=
                      " bg-surface-container-low relative cursor-pointer";
                  if (day.isToday) cellClass += " font-bold";

                  return (
                    <div key={i} className={cellClass}>
                      {day.isToday ? (
                        <span className="relative inline-flex items-center justify-center w-6 h-6 border border-primary">
                          {day.date.getDate()}
                        </span>
                      ) : (
                        <span className="font-body-md">
                          {day.date.getDate()}
                        </span>
                      )}
                      {day.hasActivity && (
                        <>
                          <span className="absolute bottom-1 right-1 w-2 h-2 bg-primary" />
                          {day.activityTitles.length > 0 && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-primary text-on-primary font-caption text-caption px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                              {day.activityTitles.join(", ")}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section C: Publication Roadmap */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-background border-b border-outline-variant pb-2 mb-8">
              Roteiro de Publicação
            </h2>

            <div className="relative ml-4 pl-8 border-l border-outline py-4 space-y-12">
              {roadmapStages.map((stage) => {
                let nodeClass =
                  "absolute -left-[37px] top-1.5 w-3 h-3 outline outline-4 outline-surface";
                let gridClass = "grid grid-cols-1 md:grid-cols-4 gap-4";
                let labelClass =
                  "font-label-md uppercase tracking-widest block mb-1";
                let titleClass = "font-headline-md text-headline-md";

                if (stage.state === "completed") {
                  nodeClass += " bg-primary";
                  titleClass += " line-through opacity-60";
                  gridClass += " opacity-60";
                } else if (stage.state === "active") {
                  nodeClass += " bg-surface border-2 border-primary";
                  labelClass += " text-primary font-bold";
                } else {
                  nodeClass += " bg-surface border border-outline";
                  gridClass += " opacity-50";
                }

                return (
                  <div key={stage.id} className="relative">
                    <div className={nodeClass} />
                    <div className={gridClass}>
                      <div className="col-span-1">
                        <span className={labelClass}>
                          {stage.state === "active" && (
                            <span className="inline-block w-1.5 h-1.5 bg-primary animate-pulse mr-1 align-middle" />
                          )}
                          {stage.label}
                        </span>
                        <h3 className={titleClass}>{stage.title}</h3>
                      </div>
                      <div className="col-span-3">
                        <p
                          className={`font-body-md text-body-md ${stage.state === "upcoming" ? "text-on-surface-variant" : "text-on-background"}`}
                        >
                          {stage.description}
                        </p>

                        {/* Review checkboxes for Revisão stage */}
                        {stage.id === "review" &&
                          stage.state === "active" &&
                          stage.reviewChapters &&
                          stage.reviewChapters.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {stage.reviewChapters.map((ch) => (
                                <label
                                  key={ch.id}
                                  className="flex items-center gap-3 group cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    defaultChecked={ch.status === "completed"}
                                    className="h-4 w-4 text-primary bg-surface border-outline focus:ring-0 cursor-pointer"
                                  />
                                  <span className="font-label-md uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
                                    {ch.title}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </ArchiveLayout>
  );
}
