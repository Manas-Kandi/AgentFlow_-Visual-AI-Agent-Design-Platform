"use client";

import React from "react";
import { Project } from "@/types";
import DashboardLeftSidebar from "@/components/projectsDashboard/Dashboard-Left-Sidebar";

interface ProjectDashboardProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (id: string) => void;
}

export default function ProjectDashboard(props: ProjectDashboardProps) {
  // Route legacy project/folder management through the new left sidebar wrapper
  // DashboardLeftSidebar internally renders ModularDashboard and FolderTree
  return <DashboardLeftSidebar {...props} />;
}
