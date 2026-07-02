"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";
import type { Location } from "@/types";
import { ArrowRight, Users, Clock, MapPin } from "lucide-react";

const LOCATION_TYPE_LABELS: Record<Location["type"], string> = {
  indoor: "Interior",
  outdoor: "Exterior",
  city: "Cidade",
  fantasy: "Fantasia",
  other: "Outro",
};

export default function WorldPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const {
    projects,
    fetchCharacters,
    fetchTimeline,
    fetchLocations,
    getCharactersByProject,
    getTimelineByProject,
    getLocationsByProject,
  } = useProjectStore();

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    Promise.all([
      fetchCharacters(projectId),
      fetchTimeline(projectId),
      fetchLocations(projectId),
    ]).finally(() => setIsLoading(false));
  }, [projectId, fetchCharacters, fetchTimeline, fetchLocations]);

  const characters = getCharactersByProject(projectId);
  const events = getTimelineByProject(projectId);
  const locations = getLocationsByProject(projectId);

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Mundo"
      sectionLabel="Mundus"
    >
      <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
        {/* Page Header */}
        <div className="mb-12 border-b border-outline-variant pb-6">
          <h2 className="font-display-lg text-display-lg text-on-background mb-4">
            Mundus
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Uma visão geral do universo da sua narrativa — personagens, eventos e lugares.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-16">
            <SummarySectionSkeleton />
            <SummarySectionSkeleton />
            <SummarySectionSkeleton />
          </div>
        ) : (
          <div className="space-y-16">
            {/* Characters Section */}
            <SummarySection
              icon={Users}
              title="Personagens"
              count={characters.length}
              linkHref={`/projects/${projectId}/personagens`}
              linkLabel="Ver Personagens"
              items={characters.slice(0, 3).map((c) => ({
                id: c.id,
                subtitle: c.personality || "Personagem",
                title: c.name,
                description: c.description || "Sem descrição.",
              }))}
              emptyMessage="Nenhum personagem registrado ainda."
            />

            {/* Timeline Section */}
            <SummarySection
              icon={Clock}
              title="Cronologia"
              count={events.length}
              linkHref={`/projects/${projectId}/timeline`}
              linkLabel="Ver Cronologia"
              items={events.slice(0, 3).map((e) => ({
                id: e.id,
                subtitle: e.date || `Ordem: ${e.order}`,
                title: e.title,
                description: e.description || "Sem descrição.",
              }))}
              emptyMessage="Nenhum evento registrado ainda."
            />

            {/* Locations Section */}
            <SummarySection
              icon={MapPin}
              title="Locais"
              count={locations.length}
              linkHref={`/projects/${projectId}/locais`}
              linkLabel="Ver Locais"
              items={locations.slice(0, 3).map((l) => ({
                id: l.id,
                subtitle: LOCATION_TYPE_LABELS[l.type],
                title: l.name,
                description: l.description || "Sem descrição.",
              }))}
              emptyMessage="Nenhum local registrado ainda."
            />
          </div>
        )}
      </main>
    </ArchiveLayout>
  );
}

interface SummaryItem {
  id: string;
  subtitle: string;
  title: string;
  description: string;
}

function SummarySection({
  icon: Icon,
  title,
  count,
  linkHref,
  linkLabel,
  items,
  emptyMessage,
}: {
  icon: typeof Users;
  title: string;
  count: number;
  linkHref: string;
  linkLabel: string;
  items: SummaryItem[];
  emptyMessage: string;
}) {
  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-on-surface-variant" />
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {title}
          </h3>
          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-2 py-0.5 border border-outline-variant/50">
            {count}
          </span>
        </div>
        <Link
          href={linkHref}
          className="group flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors uppercase tracking-wider"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Cards */}
      {items.length === 0 ? (
        <div className="border border-dashed border-outline-variant p-12 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <SummaryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryCard({ item }: { item: SummaryItem }) {
  return (
    <div className="flex flex-col bg-surface-container-lowest border border-outline-variant p-6 transition-all duration-300">
      <div className="mb-3">
        <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant border-b border-on-surface-variant/30 pb-1">
          {item.subtitle}
        </span>
      </div>
      <h4 className="font-headline-md text-headline-md text-on-surface mb-3 line-clamp-1">
        {item.title}
      </h4>
      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
        {item.description}
      </p>
    </div>
  );
}

function SummarySectionSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-surface-container-high" />
          <div className="h-6 w-32 bg-surface-container-high" />
          <div className="h-6 w-8 bg-surface-container-high" />
        </div>
        <div className="h-4 w-28 bg-surface-container-high" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-6">
            <div className="h-4 bg-surface-container-high mb-3 w-1/2" />
            <div className="h-6 bg-surface-container-high mb-4 w-3/4" />
            <div className="h-4 bg-surface-container-high mb-2 w-full" />
            <div className="h-4 bg-surface-container-high mb-2 w-2/3" />
          </div>
        ))}
      </div>
    </section>
  );
}
