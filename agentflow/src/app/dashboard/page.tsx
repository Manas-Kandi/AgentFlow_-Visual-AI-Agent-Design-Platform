"use client";

import React from "react";
import { Project } from "@/types";
import ProjectDashboard from "@/components/ProjectDashboard";

export default function DashboardPage() {
  // Import ProjectDashboard and provide props
  // TODO: Replace mockProjects with real data from your backend/service
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "Sample Agent Project",
      description: "A demo agent workflow.",
      status: "deployed",
      nodeCount: 5,
      lastModified: new Date("2025-08-01T12:00:00Z"),
    },
    {
      id: "2",
      name: "Knowledge Base Bot",
      description: "Knowledge base agent.",
      status: "testing",
      nodeCount: 8,
      lastModified: new Date("2025-08-02T12:00:00Z"),
    },
  ];

  const handleCreateProject = () => {
    // TODO: Implement create project logic
    alert("Create Project clicked");
  };

  const handleOpenProject = (id: string) => {
    // TODO: Implement open project logic (e.g., navigate to project detail)
    alert(`Open Project ${id}`);
  };

  return (
    <ProjectDashboard
      projects={mockProjects}
      onCreateProject={handleCreateProject}
      onOpenProject={handleOpenProject}
    />
  );
}
