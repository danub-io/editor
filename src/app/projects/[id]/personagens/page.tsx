"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";
import { Character } from "@/types";
import { Bookmark, Edit, BookOpen } from "lucide-react";

export default function CharactersPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const { projects, fetchCharacters, getCharactersByProject } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  const characters = getCharactersByProject(projectId);

  useEffect(() => {
    if (!projectId) return;
    setIsLoading(true);
    fetchCharacters(projectId).finally(() => setIsLoading(false));
  }, [projectId, fetchCharacters]);

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Personagens"
      sectionLabel="Personagens"
    >
      <main id="main-content" className="flex-1 px-edge-margin-desktop py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-background mb-4">
              Dramatis Personae
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Um registro de todos os indivíduos, nobres ou plebeus, que desempenham um papel nesta história.
            </p>
          </div>
        </div>

        {/* Characters Grid */}
        {isLoading ? (
          <LoadingGrid />
        ) : characters.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
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
      <BookOpen className="w-12 h-12 text-on-surface-variant/40 mb-4" />
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
        Nenhum personagem registrado ainda.
      </p>
      <p className="font-body-md text-body-md text-on-surface-variant/70">
        Comece criando o primeiro registro no dramatis personae.
      </p>
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="group relative flex flex-col bg-surface-container-lowest border border-outline-variant p-6 transition-all duration-300">
      {/* Hover Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
        <button
          className="p-2 bg-surface/90 hover:bg-surface-container text-on-surface transition-colors border border-outline-variant"
          title="Editar"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {/* Portrait */}
      <div className="w-full aspect-[3/4] bg-surface-container-high mb-6 border border-outline-variant/50 relative overflow-hidden flex items-center justify-center">
        {character.imageUrl ? (
          <img
            src={character.imageUrl}
            alt={character.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-80 grayscale"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-on-surface-variant/30">
            <BookOpen className="w-16 h-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest border-b border-on-surface-variant/30 pb-1">
            {character.personality || "Personagem"}
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-3 line-clamp-1">
          {character.name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-1">
          {character.description || "Sem descrição."}
        </p>
        <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center text-on-surface-variant">
          <span className="font-caption text-caption uppercase tracking-wider">
            Ref: {character.id.slice(0, 4)}
          </span>
          <Bookmark className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
