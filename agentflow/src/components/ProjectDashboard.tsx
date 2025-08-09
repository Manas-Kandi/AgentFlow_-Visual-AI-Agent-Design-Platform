"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Project } from "@/types";
import { Plus, Search, CreditCard, UserCog, MoreHorizontal, Folder, Zap, Star, Circle, Diamond, Triangle, Hexagon, Square, Heart, Bookmark, ArrowRight } from "lucide-react";
import FolderTree from "./FolderTree";
import Image from "next/image";
import AccountSettings from "@/components/AccountSettings";
import UserAvatar from "@/components/UserAvatar";
import ProjectDetails from "./ProjectDetails";
import { cn } from "@/lib/utils";

interface ProjectDashboardProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (id: string) => void;
}

export default function ProjectDashboard({
  projects,
  onCreateProject,
  onOpenProject,
}: ProjectDashboardProps) {
  const [activeSection, setActiveSection] = useState<"projects" | "account">(
    "projects"
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<{id: string, name: string} | null>(null);
  const [folderProjects, setFolderProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinned, setPinned] = useState<string[]>([]);

  // Load persisted pinned projects
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pinned_projects');
      if (stored) setPinned(JSON.parse(stored));
    } catch {}
  }, []);

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id];
      try { localStorage.setItem('pinned_projects', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Groupings
  const pinnedProjects = filteredProjects.filter(p => pinned.includes(p.id));
  const otherProjects = filteredProjects.filter(p => !pinned.includes(p.id));
  const recentProjects = projects.filter(p => !pinned.includes(p.id)).slice(0, 3);

  const handleFolderSelect = async (folderId: string, folderName: string) => {
    try {
      // Import supabase here to avoid issues
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Fetch projects in this folder
      const { data, error } = await supabase
        .from('project_folders')
        .select('project_id')
        .eq('folder_id', folderId);
      
      if (error) {
        console.error('Error fetching folder projects:', error);
        return;
      }
      
      // Filter projects that are in this folder
      const projectIds = data.map(pf => pf.project_id);
      const projectsInFolder = projects.filter(p => projectIds.includes(p.id));
      
      setSelectedFolder({ id: folderId, name: folderName });
      setFolderProjects(projectsInFolder);
      setSelectedProject(null); // Clear any selected project
    } catch (err) {
      console.error('Error selecting folder:', err);
    }
  };

  const handleBackToAllProjects = () => {
    setSelectedFolder(null);
    setFolderProjects([]);
    setSelectedProject(null);
  };

  // Token-based status colors using global CSS variables
  const statusStyles = (status: Project["status"]) => {
    switch (status) {
      case "deployed":
        return { base: 'var(--figma-success)' };
      case "testing":
        return { base: 'var(--figma-warning)' };
      default:
        return { base: 'hsl(var(--color-muted-foreground))' };
    }
  };

  const statusBadgeStyle = (status: Project["status"]): React.CSSProperties => {
    const { base } = statusStyles(status);
    return {
      color: base,
      // subtle tint backgrounds and borders using color-mix
      backgroundColor: `color-mix(in hsl, ${base} 15%, transparent)`,
      borderColor: `color-mix(in hsl, ${base} 30%, transparent)`
    } as React.CSSProperties;
  };

  const getProjectIcon = (projectId: string) => {
    const icons = [Folder, Zap, Star, Circle, Diamond, Triangle, Hexagon, Square, Heart, Bookmark];
    
    // Simple hash function to consistently assign icons
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      const char = projectId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const index = Math.abs(hash) % icons.length;
    return icons[index];
  };

  const getProjectGradient = (projectId: string) => {
    const gradients = [
      'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.06))', // Blue to Purple
      'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(34, 197, 94, 0.06))', // Emerald to Green
      'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.06))', // Amber to Yellow
      'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(251, 113, 133, 0.06))', // Red to Pink
      'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(196, 181, 253, 0.06))', // Violet to Purple
      'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(34, 211, 238, 0.06))', // Cyan to Sky
      'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(217, 70, 239, 0.06))', // Purple to Fuchsia
      'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(132, 204, 22, 0.06))', // Green to Lime
      'linear-gradient(135deg, rgba(251, 113, 133, 0.12), rgba(244, 63, 94, 0.06))', // Pink to Rose
      'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(129, 140, 248, 0.06))', // Indigo to Blue
    ];
    
    // Use the same hash function to consistently assign gradients
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      const char = projectId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  /* -----------------------------  RENDER  ----------------------------- */
  return (
    <SidebarProvider defaultOpen>

      <Sidebar collapsible="icon" className="border-r border-border" style={{ '--sidebar-width': '14rem' } as React.CSSProperties}>
        <SidebarRail />
        <SidebarContent className="p-1.5 flex flex-col gap-1">
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="justify-start py-2 px-3 gap-2">
                <Image
                  src="/weevthing.png"
                  alt="AgentFlow logo"
                  width={114}
                  height={114}
                  priority
                  className="rounded-sm -ml-3 mt-1.5"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarSeparator className="my-0.5" />
          </SidebarMenu>

          <div className="flex-grow overflow-y-auto min-h-0">
            <FolderTree 
              onSelectProject={(id) => {
                const project = projects.find(p => p.id === id);
                if (project) setSelectedProject(project);
              }}
              onSelectFolder={handleFolderSelect}
              selectedProjectId={selectedProject?.id}
              projects={projects}
            />
          </div>

          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeSection === "account"}
                onClick={() => setActiveSection("account")}
                className="justify-start py-2 pl-3"
              >
                <CreditCard className="mt-0.5" />
                Billing
                <SidebarMenuBadge className="mr-2">
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[8px] font-normal">new</span>
                </SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton disabled className="justify-start py-2 pl-3">
                <UserCog />
                Account
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        
          <SidebarMenu className="gap-2 mb-4">
             <SidebarSeparator className="my-3" />
             <SidebarMenuItem>
              <SidebarMenuButton className="justify-start py-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 backdrop-blur-sm border border-white/10"></div>
                  <div className="relative z-10">
                    <UserAvatar name="Manas Kandimalla" />
                  </div>
                </div>
                <span className="truncate">Manas Kandimalla</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="border-b border-border">
        {/* ---- Header bar ---- */}
        <div className="flex items-center justify-between px-4 py-4">
          {activeSection === "projects" ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <SidebarTrigger />
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full border-0 shadow-none focus:ring-0 focus:border-0 bg-[hsl(var(--color-card))]"
                  />
                </div>
              </div>
              <div className="flex items-center ml-4">
                <Button 
                  onClick={onCreateProject} 
                  variant="ghost" 
                  className="gap-2 hover:bg-white/5"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
                <div className="ml-2">
                  <Select onValueChange={(value) => { try { localStorage.setItem('selected_template', value); } catch {} onCreateProject(); }}>
                    <SelectTrigger size="sm" className="bg-[hsl(var(--color-card))] border-0 shadow-none">
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blank">Blank</SelectItem>
                      <SelectItem value="customer-support">Customer Support Bot</SelectItem>
                      <SelectItem value="faq-agent">FAQ Agent</SelectItem>
                      <SelectItem value="lead-qualifier">Lead Qualifier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-medium">Billing & Account</h1>
          )}
        </div>

                {/* ---- Main content ---- */}
        {activeSection === "projects" ? (
          <>
            {selectedProject ? (
            <div className="p-6">
              <ProjectDetails
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onOpenCanvas={onOpenProject}
              />
            </div>
            ) : selectedFolder ? (
            <div className="p-4 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
              {/* Folder View Header */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleBackToAllProjects}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to All Projects
                </button>
              </div>
              <div className="space-y-4">
                <h2 className="text-base font-light text-muted-foreground">{selectedFolder.name} ({folderProjects.length} projects)</h2>
                <div className="space-y-3">
                  {folderProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="group w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.02] transition-all text-left rounded-lg"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div 
                          className="p-1.5 rounded-lg backdrop-blur-sm border border-white/10 mt-0.5 transition-all duration-200 group-hover:backdrop-blur-md group-hover:border-white/20"
                          style={{ 
                            background: getProjectGradient(project.id),
                            '--hover-gradient': getProjectGradient(project.id).replace(/0\.(\d+)/g, (match, p1) => {
                              const opacity = parseFloat('0.' + p1);
                              return (opacity * 1.5).toFixed(2);
                            })
                          } as React.CSSProperties & { '--hover-gradient': string }}
                        >
                          {React.createElement(getProjectIcon(project.id), {
                            className: "w-4 h-4 flex-shrink-0 text-foreground"
                          })}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-base leading-[1.4] truncate">{project.name}</p>
                          <p className="text-[13px] text-muted-foreground truncate">{project.description}</p>
                        </div>
                      </div>
                      
                      <div className="hidden md:flex items-center gap-3 flex-shrink-0 text-sm text-muted-foreground">
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0.5`}
                          style={statusBadgeStyle(project.status)}
                        >
                          {project.status}
                        </Badge>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">{project.nodeCount} nodes</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">{project.lastModified.toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                  {folderProjects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground opacity-70">
                      <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No projects in this folder yet</p>
                      <p className="text-sm mt-1">Drag projects from the main view to add them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">

            {/* Recent Projects Section */}
            <div className="space-y-4">
              <h2 className="text-base font-light text-muted-foreground">Recent Projects</h2>
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    draggable
                    onDragStart={() => {
                      (window as any).draggedProjectId = project.id;
                    }}
                    onDragEnd={() => {
                      (window as any).draggedProjectId = null;
                    }}
                    className="group w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.02] hover:ring-1 hover:ring-white/10 transition-all text-left rounded-lg cursor-move"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div 
                        className="p-1.5 rounded-lg backdrop-blur-sm border border-white/10 mt-0.5 transition-all duration-200 group-hover:backdrop-blur-md group-hover:border-white/20"
                        style={{ 
                          background: getProjectGradient(project.id),
                          '--hover-gradient': getProjectGradient(project.id).replace(/0\.(\d+)/g, (match, p1) => {
                            const opacity = parseFloat('0.' + p1);
                            return (opacity * 1.5).toFixed(2);
                          })
                        } as React.CSSProperties & { '--hover-gradient': string }}
                      >
                        {React.createElement(getProjectIcon(project.id), {
                          className: "w-4 h-4 flex-shrink-0 text-white/80"
                        })}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-base leading-[1.4] truncate">{project.name}</p>
                        <p className="text-[13px] text-muted-foreground truncate">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0 text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0.5`}
                        style={statusBadgeStyle(project.status)}
                      >
                        {project.status}
                      </Badge>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">{project.nodeCount} nodes</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">{project.lastModified.toLocaleDateString()}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          aria-label="Pin project"
                          onClick={(e) => { e.stopPropagation(); togglePin(project.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                        >
                          <Star className={cn("w-4 h-4", pinned.includes(project.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                        </button>
                        <button
                          aria-label="Open project"
                          onClick={(e) => { e.stopPropagation(); onOpenProject(project.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          aria-label="More actions"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* All Projects Section */}
            <div className="space-y-4">
              <h2 className="text-base font-light text-muted-foreground">All Projects</h2>
              <div className="space-y-3">
                {otherProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    draggable
                    onDragStart={() => {
                      (window as any).draggedProjectId = project.id;
                    }}
                    onDragEnd={() => {
                      (window as any).draggedProjectId = null;
                    }}
                    className="group w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.02] hover:ring-1 hover:ring-white/10 transition-all text-left rounded-lg cursor-move"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div 
                        className="p-1.5 rounded-lg backdrop-blur-sm border border-white/10 mt-0.5 transition-all duration-200 group-hover:backdrop-blur-md group-hover:border-white/20"
                        style={{ 
                          background: getProjectGradient(project.id),
                          '--hover-gradient': getProjectGradient(project.id).replace(/0\.(\d+)/g, (match, p1) => {
                            const opacity = parseFloat('0.' + p1);
                            return (opacity * 1.5).toFixed(2);
                          })
                        } as React.CSSProperties & { '--hover-gradient': string }}
                      >
                        {React.createElement(getProjectIcon(project.id), {
                          className: "w-4 h-4 flex-shrink-0 text-foreground"
                        })}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-base leading-[1.4] truncate">{project.name}</p>
                        <p className="text-[13px] text-muted-foreground truncate">{project.description}</p>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0 text-sm text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0.5`}
                        style={statusBadgeStyle(project.status)}
                      >
                        {project.status}
                      </Badge>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">{project.nodeCount} nodes</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">{project.lastModified.toLocaleDateString()}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          aria-label="Pin project"
                          onClick={(e) => { e.stopPropagation(); togglePin(project.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                        >
                          <Star className={cn("w-4 h-4", pinned.includes(project.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")}/>
                        </button>
                        <button
                          aria-label="Open project"
                          onClick={(e) => { e.stopPropagation(); onOpenProject(project.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          aria-label="More actions"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
            )}
          </>
        ) : (
          <AccountSettings />
        )}
      </SidebarInset>
  </SidebarProvider>
  );
}
