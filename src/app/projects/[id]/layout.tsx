"use client";

export const runtime = "edge";

import { useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/projectStore";
import { Sidebar, MobileSidebar } from "@/components/sidebar/Sidebar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params.id as string;
  const {
    getProject,
    setActiveProject,
    fetchProjects,
    fetchChapters,
    fetchCharacters,
    fetchLocations,
    fetchTimeline,
    projects,
    focusMode,
    sidebarOpen,
    setSidebarOpen,
  } = useProjectStore();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const project = projects.find((p) => p.id === id);

  const handleToggleLeft = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    // Ensure projects are loaded
    if (projects.length === 0) {
      fetchProjects().then(() => {
        const project = useProjectStore.getState().getProject(id);
        if (!project) {
          router.push("/");
        } else {
          setActiveProject(id);
        }
      });
    } else {
      const project = getProject(id);
      if (!project) {
        router.push("/");
      } else {
        setActiveProject(id);
      }
    }
  }, [id]);

  // Prefetch all project data
  useEffect(() => {
    if (id) {
      fetchChapters(id);
      fetchCharacters(id);
      fetchLocations(id);
      fetchTimeline(id);
    }
  }, [id, fetchChapters, fetchCharacters, fetchLocations, fetchTimeline]);

  return (
    <div ref={containerRef} className={cn("h-screen flex overflow-hidden", focusMode ? "bg-background text-foreground group relative" : "bg-surface text-on-surface")}>
      {/* Mobile: shadcn Sheet sidebar */}
      {!focusMode && (
        <div className="md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            {/*
              z-[60] must be > Sheet overlay z-50 (sheet.tsx) so the trigger
              remains clickable when the Sheet is open.
            */}
            {!sidebarOpen && (
              <SheetTrigger className="fixed left-0 top-0 z-[60] px-3 pt-4 pb-2 flex items-center justify-center transition-colors outline-none">
                <Menu className="h-5 w-5 text-on-surface-variant transition-colors hover:text-on-surface" />
              </SheetTrigger>
            )}
            <SheetContent
              side="left"
              showCloseButton={false}
              className="p-0 w-[312px] max-w-[312px] bg-sidebar [&_[data-slot=sheet-overlay]]:hidden"
            >
              <MobileSidebar onClose={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop: chevron trigger to toggle left sidebar */}
      {!focusMode && (
        <button
          onClick={handleToggleLeft}
          className={cn(
            "hidden md:flex fixed z-50 items-center justify-center w-10 h-10 top-1/2 -translate-y-1/2 bg-transparent cursor-pointer transition-[left,color] duration-200 text-on-surface-variant hover:text-on-surface",
            sidebarOpen ? "left-[264px]" : "left-1"
          )}
          title={sidebarOpen ? "Fechar painel" : "Abrir painel"}
        >
          <ChevronRight
            className={cn(
              "h-8 w-8 stroke-[2] transition-transform duration-200",
              sidebarOpen && "rotate-180"
            )}
          />
        </button>
      )}

      {/* Desktop: inline sidebar */}
      {!focusMode && (
        <div className="hidden md:block">
          <Sidebar isOpen={sidebarOpen} onClose={handleToggleLeft} />
        </div>
      )}
      <div className={cn("flex-1 flex flex-col h-screen min-w-0 transition-[margin-left] duration-200 ease-out bg-background", focusMode ? "bg-transparent" : (sidebarOpen ? "max-md:ml-0 md:ml-[264px]" : "max-md:ml-0 md:ml-0"))}>
        <main id="main-content" className={cn("flex-1 relative overflow-y-auto", focusMode ? "bg-background scroll-smooth flex justify-center" : "")}>
          {!focusMode && project && (
            <Breadcrumbs projectTitle={project.title || "Projeto"} projectId={id} />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
