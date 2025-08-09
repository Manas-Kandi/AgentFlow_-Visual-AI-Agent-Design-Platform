"use client";

import React, { useState, useEffect } from "react";
import FolderTree from "@/components/FolderTree"; // adjust path to your existing FolderTree
import ModularDashboard from "./ModularDashboard";
import "./dashboard-left-sidebar.css";

interface DashboardLeftSidebarProps {
  projects: any[];
  folders?: Folder[];
  onCreateProject?: () => void;
  onOpenProject?: (id: string) => void;
  onCreateFolder?: () => void;
  onSelectFolder?: (folderId: string) => void;
}

interface FolderTreeProps {
  folders: Folder[];
  level?: number;
  onSelectFolder: (folderId: string) => void;
}

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

export default function DashboardLeftSidebar({
  projects,
  folders,
  onCreateProject,
  onOpenProject,
  onCreateFolder,
  onSelectFolder,
}: DashboardLeftSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    // Set recent projects (last 5 accessed)
    setRecentProjects(Array.isArray(projects) ? projects.slice(0, 5) : []);
  }, [projects]);

  return (
    <div className="dl-wrapper">
      <aside className={`dl-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="dl-header">
          <h2 className="logo">AgentFlow</h2>
          <button
            className="toggle"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <div className="dl-section">
          <div className="dl-section-header">
            <span>Folders</span>
            <button className="dl-icon-btn" onClick={onCreateFolder} aria-label="Create folder">+</button>
          </div>
          <div className="dl-scroll">
            <FolderTree
              onSelectProject={() => {}}
              onSelectFolder={(folderId, folderName) => onSelectFolder?.(folderId)}
              projects={projects}
            />
          </div>
        </div>

        <div className="dl-section dl-bottom">
          <button className="dl-link">Billing</button>
          <button className="dl-link">Account</button>
        </div>
      </aside>

      <main className="dl-main">
        <ModularDashboard
          projects={projects}
        />
      </main>
    </div>
  );
}
