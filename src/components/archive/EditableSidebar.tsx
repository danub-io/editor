"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  Users,
  Globe,
  Plus,
  Settings,
  BarChart3,
} from "lucide-react";

interface EditableSidebarProps {
  projectId: string;
}

const navItems = [
  { label: "Produção", icon: BarChart3, href: (id: string) => `/projects/${id}/producao`, segment: "producao" },
  { label: "Manuscritos", icon: FileText, href: (id: string) => `/projects/${id}/`, segment: "" },
  { label: "Personagens", icon: Users, href: (id: string) => `/projects/${id}/personagens`, segment: "personagens" },
  { label: "Mundo", icon: Globe, href: (id: string) => `/projects/${id}/mundo`, segment: "mundo" },
  { label: "Timeline", icon: BookOpen, href: (id: string) => `/projects/${id}/timeline`, segment: "timeline" },
  { label: "Locais", icon: Globe, href: (id: string) => `/projects/${id}/locais`, segment: "locais" },
];

export default function EditableSidebar({ projectId }: EditableSidebarProps) {
  const pathname = usePathname();

  const isActive = (segment: string) => {
    if (!segment) {
      // Manuscritos is default (exact match on /projects/[id]/ or /projects/[id])
      const pattern = new RegExp(`^/projects/[^/]+/?$`);
      return pattern.test(pathname);
    }
    return pathname.includes(`/${segment}`);
  };

  return (
    <nav className="fixed left-0 top-0 flex flex-col h-full z-50 overflow-y-auto bg-surface-container-lowest border-r border-outline-variant w-64 flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center text-on-surface shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-on-background tracking-tight">
            GospelReads.
          </h1>
        </div>
      </div>

      {/* CTA */}
      <div className="p-6">
        <Link
          href={`/projects/${projectId}/`}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-4 font-label-md text-label-md uppercase tracking-wider hover:bg-primary/90 transition-colors border border-primary inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus className="w-4 h-4" />
          Novo Manuscrito
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-2 px-3">
        {navItems.map((item) => {
          const active = isActive(item.segment);
          const href = item.href(projectId);
          const Icon = item.icon;

          return (
            <Link
              key={item.segment}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 mb-1 transition-colors",
                active
                  ? "bg-surface-container text-on-surface font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-label-lg text-label-lg">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-outline-variant p-3">
        <Link
          href={`/projects/${projectId}/settings`}
          className="flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors mb-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Settings className="w-5 h-5" />
          <span className="font-label-lg text-label-lg">Configurações</span>
        </Link>
      </div>
    </nav>
  );
}
