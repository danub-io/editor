"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";
import type { Location } from "@/types";
import { MapPin, Home, Trees, Building, Landmark } from "lucide-react";

const LOCATION_TYPE_ICONS: Record<Location["type"], typeof MapPin> = {
  indoor: Home,
  outdoor: Trees,
  city: Building,
  fantasy: Landmark,
  other: MapPin,
};

const LOCATION_TYPE_LABELS: Record<Location["type"], string> = {
  indoor: "Interior",
  outdoor: "Exterior",
  city: "Cidade",
  fantasy: "Fantasia",
  other: "Outro",
};

export default function LocationsPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const { projects, fetchLocations, getLocationsByProject } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const locations = getLocationsByProject(projectId);

  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    fetchLocations(projectId).finally(() => setIsLoading(false));
  }, [projectId, fetchLocations]);

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Locais"
      sectionLabel="Geographia"
    >
      <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-background mb-4">
              Geographia
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Um atlas dos lugares que dão forma à sua narrativa.
            </p>
          </div>
        </div>

        {/* Locations Grid */}
        {isLoading ? (
          <LoadingGrid />
        ) : locations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </main>
    </ArchiveLayout>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest border border-outline-variant p-6 animate-pulse">
          <div className="w-full aspect-[3/4] bg-surface-container-high mb-6" />
          <div className="h-4 bg-surface-container-high mb-3 w-1/2" />
          <div className="h-6 bg-surface-container-high mb-4 w-3/4" />
          <div className="h-4 bg-surface-container-high mb-2 w-full" />
          <div className="h-4 bg-surface-container-high mb-2 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-outline-variant">
      <MapPin className="w-12 h-12 text-on-surface-variant/40 mb-4" />
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
        Nenhum local registrado ainda.
      </p>
      <p className="font-body-md text-body-md text-on-surface-variant/70">
        Comece mapeando os lugares da sua história.
      </p>
    </div>
  );
}

function LocationCard({ location }: { location: Location }) {
  const TypeIcon = LOCATION_TYPE_ICONS[location.type] || MapPin;

  return (
    <div className="group relative flex flex-col bg-surface-container-lowest border border-outline-variant p-6 transition-all duration-300">
      {/* Type Icon Placeholder */}
      <div className="w-full aspect-[3/4] bg-surface-container-high mb-6 border border-outline-variant/50 flex items-center justify-center">
        <TypeIcon className="w-16 h-16 text-on-surface-variant/30" />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Type Tag */}
        <div className="mb-3">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest border-b border-on-surface-variant/30 pb-1">
            {LOCATION_TYPE_LABELS[location.type]}
          </span>
        </div>

        <h3 className="font-headline-md text-headline-md text-on-surface mb-3 line-clamp-1">
          {location.name}
        </h3>

        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-1">
          {location.description || "Sem descrição."}
        </p>

        <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center text-on-surface-variant">
          <span className="font-caption text-caption uppercase tracking-wider">
            Ref: {location.id.slice(0, 4)}
          </span>
          <MapPin className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
