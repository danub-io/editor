"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  producao: "Produção",
  mundo: "Mundo",
  personagens: "Personagens",
  characters: "Personagens",
  locais: "Locais",
  locations: "Locais",
  timeline: "Linha do Tempo",
  settings: "Configurações",
};

export function Breadcrumbs({
  projectTitle,
  projectId,
}: {
  projectTitle: string;
  projectId: string;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex px-6 py-3 border-b border-gray-200 dark:border-zinc-800 font-sans bg-white dark:bg-zinc-950" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* Step 1: Workspace/Home */}
        <li className="inline-flex items-center">
          <Link 
            href="/dash" 
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
            </svg>
            Workspace
          </Link>
        </li>

        {/* Step 2: Project Title */}
        <li>
          <div className="flex items-center space-x-1 md:space-x-2">
            <svg className="w-3.5 h-3.5 rtl:rotate-180 text-gray-400 dark:text-zinc-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
            </svg>
            <Link 
              href={`/projects/${projectId}`} 
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              {projectTitle}
            </Link>
          </div>
        </li>

        {/* Step 3: Specific Page Segment (Dynamic) */}
        {segments.length > 2 && (
          <li aria-current="page">
            <div className="flex items-center space-x-1 md:space-x-2">
              <svg className="w-3.5 h-3.5 rtl:rotate-180 text-gray-400 dark:text-zinc-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
              </svg>
              <span className="inline-flex items-center text-sm font-medium text-gray-400 dark:text-zinc-500">
                {LABELS[segments[2]] || segments[2]}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}
