"use client";

import { ReactNode } from "react";
import EditableSidebar from "./EditableSidebar";
import TopBar from "./TopBar";

interface ArchiveLayoutProps {
  children: ReactNode;
  projectId: string;
  projectTitle: string;
  sectionTitle: string;
  sectionLabel?: string;
}

export default function ArchiveLayout({
  children,
  projectId,
  projectTitle,
  sectionTitle,
  sectionLabel,
}: ArchiveLayoutProps) {
  return (
    <div className="flex">
      <EditableSidebar projectId={projectId} />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopBar
          projectTitle={projectTitle}
          sectionTitle={sectionTitle}
          sectionLabel={sectionLabel}
        />
        {children}
      </div>
    </div>
  );
}
