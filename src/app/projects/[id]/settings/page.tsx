"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArchiveLayout from "@/components/archive/ArchiveLayout";
import { useProjectStore } from "@/stores/projectStore";
import { Save, Trash2, Sliders, Type, BookOpen, Globe } from "lucide-react";

export default function SettingsPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const { projects } = useProjectStore();
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <ArchiveLayout
      projectId={projectId}
      projectTitle={project?.title || "Projeto"}
      sectionTitle="Configurações"
      sectionLabel="Configurações"
    >
      {isLoading ? (
        <div className="animate-pulse flex-1 px-edge-margin-desktop py-12 space-y-6">
          <div className="h-10 w-48 bg-surface-container-high" />
          <div className="h-4 w-96 bg-surface-container-high" />
          <div className="h-64 bg-surface-container-high" />
        </div>
      ) : (
        <main id="main-content" className="flex-1 px-edge-margin-desktop py-12 max-w-4xl">
          {/* Page Header */}
          <div className="mb-12 border-b border-outline-variant pb-6">
            <h2 className="font-display-lg text-display-lg text-on-background mb-4">
              Configurações do Manuscrito
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Gerencie os metadados do seu livro, predefinições tipográficas e formatos de exportação.
            </p>
          </div>

          <div className="space-y-12">
            {/* Metadados Básicos */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-headline-md text-xl font-bold text-primary">Metadados da Obra</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Título do Livro
                  </label>
                  <input
                    id="title"
                    type="text"
                    defaultValue={project?.title || ""}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="author" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Autor / Pseudônimo
                  </label>
                  <input
                    id="author"
                    type="text"
                    defaultValue={project?.author || ""}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="desc" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Sinopse / Descrição Curta
                </label>
                <textarea
                  id="desc"
                  rows={3}
                  defaultValue={project?.description || ""}
                  className="border border-outline-variant bg-transparent p-3 focus:border-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                />
              </div>
            </section>

            {/* Layout e Tipografia */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
                <Type className="w-5 h-5 text-primary" />
                <h3 className="font-headline-md text-xl font-bold text-primary">Tipografia & Impressão</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="format" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Formato de Página (Refile)
                  </label>
                  <select
                    id="format"
                    defaultValue={project?.settings?.pageFormat || "6x9"}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  >
                    <option value="6x9">6x9 polegadas (Editorial)</option>
                    <option value="5x8">5x8 polegadas (Bolso)</option>
                    <option value="A5">A5 (Standard)</option>
                    <option value="A4">A4 (Revisão)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="font" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Fonte Principal (Serifa)
                  </label>
                  <select
                    id="font"
                    defaultValue={project?.settings?.fontFamily || "Lora"}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  >
                    <option value="Lora">Lora</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Garamond">Garamond</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="fontSize" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Tamanho do Corpo
                  </label>
                  <select
                    id="fontSize"
                    defaultValue={project?.settings?.fontSize || 11}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  >
                    <option value={10}>10 pt</option>
                    <option value={11}>11 pt</option>
                    <option value={12}>12 pt</option>
                    <option value={13}>13 pt</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Configurações de Idioma e Distribuição */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-headline-md text-xl font-bold text-primary">Idioma & Registro</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="lang" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Idioma da Obra
                  </label>
                  <select
                    id="lang"
                    defaultValue={project?.language || "pt-BR"}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">Inglês (Estados Unidos)</option>
                    <option value="es-ES">Espanhol (Espanha)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="isbn" className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                    Código ISBN
                  </label>
                  <input
                    id="isbn"
                    type="text"
                    placeholder="978-3-16-148410-0"
                    defaultValue={project?.isbn || ""}
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:border-b-primary focus:ring-0 focus:outline-none transition-colors font-body-md text-on-background w-full"
                  />
                </div>
              </div>
            </section>

            {/* Salvar & Ações Críticas */}
            <div className="pt-6 border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <button
                type="button"
                className="bg-primary text-primary-foreground font-label-md text-label-md uppercase tracking-widest px-8 py-3.5 hover:bg-surface-tint transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Salvar Configurações
              </button>

              <button
                type="button"
                className="border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-label-md text-label-md uppercase tracking-widest px-6 py-3.5 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Excluir Manuscrito
              </button>
            </div>
          </div>
        </main>
      )}
    </ArchiveLayout>
  );
}
