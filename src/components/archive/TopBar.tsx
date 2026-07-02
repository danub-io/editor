"use client";

import { Bell } from "lucide-react";

interface TopBarProps {
  projectTitle: string;
  sectionTitle: string;
  sectionLabel?: string;
}

export default function TopBar({ projectTitle, sectionTitle, sectionLabel }: TopBarProps) {


  return (
    <header className="sticky top-0 right-0 w-full z-40 flex items-center justify-between px-edge-margin-desktop bg-surface/80 backdrop-blur-md h-20 border-b border-outline-variant">
      {/* Left Side Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {projectTitle}
        </span>
        <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        <h1 className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
          {sectionLabel || sectionTitle}
        </h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          className="text-on-surface-variant hover:text-on-surface transition-colors p-2 hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Notificações"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface font-headline-md text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          C
        </div>
      </div>
    </header>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12L10 8L6 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
