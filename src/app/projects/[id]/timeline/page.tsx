"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";
import { Plus, Calendar, Users } from "lucide-react";

export default function TimelinePage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const { projects, fetchTimeline, getTimelineByProject } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const events = getTimelineByProject(projectId);

  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    fetchTimeline(projectId).finally(() => setIsLoading(false));
  }, [projectId, fetchTimeline]);

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Timeline"
      sectionLabel="Cronologia"
    >
      <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-background mb-4">
              Cronologia
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              A linha do tempo da sua narrativa, evento por evento.
            </p>
          </div>
        </div>

        {/* Timeline Body */}
        {isLoading ? (
          <TimelineSkeleton />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 border-l border-outline-variant" />

            <div className="space-y-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

              {/* Add Event CTA */}
              <div className="relative pl-14">
                <button className="w-full group flex flex-col items-center justify-center bg-transparent border border-dashed border-outline-variant p-8 hover:border-on-surface hover:bg-surface-container-lowest transition-all duration-300">
                  <div className="w-12 h-12 border border-outline-variant text-on-surface-variant flex items-center justify-center mb-4 group-hover:border-on-surface group-hover:text-on-surface transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Adicionar Evento
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ArchiveLayout>
  );
}

function TimelineSkeleton() {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="absolute left-6 top-0 bottom-0 border-l border-outline-variant" />
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative pl-14">
            <div className="bg-surface-container-lowest border border-outline-variant p-8 animate-pulse">
              <div className="h-4 bg-surface-container-high mb-3 w-1/3" />
              <div className="h-6 bg-surface-container-high mb-4 w-2/3" />
              <div className="h-4 bg-surface-container-high mb-2 w-full" />
              <div className="h-4 bg-surface-container-high mb-2 w-3/4" />
              <div className="mt-6 pt-4 border-t border-outline-variant/50">
                <div className="h-3 bg-surface-container-high w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-outline-variant">
      <Calendar className="w-12 h-12 text-on-surface-variant/40 mb-4" />
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
        Nenhum evento registrado ainda.
      </p>
      <p className="font-body-md text-body-md text-on-surface-variant/70">
        Comece mapeando a cronologia da sua história.
      </p>
    </div>
  );
}

function EventCard({ event }: { event: { id: string; title: string; description?: string; date?: string; characterIds: string[]; order: number } }) {
  return (
    <div className="relative pl-14">
      {/* Dot on the timeline */}
      <div className="absolute left-[22px] top-8 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest" />

      <div className="bg-surface-container-lowest border border-outline-variant p-8">
        {/* Date */}
        {event.date && (
          <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
            {event.date}
          </span>
        )}

        {/* Title */}
        <h3 className="font-headline-md text-headline-md text-on-surface mt-2 mb-3">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">
            {event.description}
          </p>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center text-on-surface-variant">
          <span className="font-caption text-caption uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            {event.characterIds.length} {event.characterIds.length === 1 ? "personagem" : "personagens"}
          </span>
          <span className="font-caption text-caption uppercase tracking-wider">
            Ordem: {event.order}
          </span>
        </div>
      </div>
    </div>
  );
}
