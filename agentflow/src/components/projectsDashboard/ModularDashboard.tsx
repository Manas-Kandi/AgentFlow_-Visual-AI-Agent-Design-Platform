"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, rectIntersection } from "@dnd-kit/core";
import { useLayoutStore } from "./layoutStore";
import RecentProjectsBlock from "./blocks/RecentProjectsBlock";
import KanbanBlock from "./blocks/KanbanBlock";
import StatsBlock from "./blocks/StatsBlock";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "./modular-dashboard.css";
import { Project } from "@/types";

/** Block registry: add new blocks here */
const Registry = {
  recent: RecentProjectsBlock,
  kanban: KanbanBlock,
  stats:  StatsBlock,
} as const;

export default function ModularDashboard({
  projects,
}: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management from old ProjectDashboard
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderProjects, setFolderProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'comfort');
  
  // Update URL when state changes
  const updateQueryParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push(`?${newParams.toString()}`);
  };
  const { blocks, gridCols, unit, move, resize, toggleCollapse, loadTemplate, addBlock } = useLayoutStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Folder selection handler
  const handleFolderSelect = async (folderId: string) => {
    setSelectedFolder(folderId);
    updateQueryParams({ folder: folderId });
    
    // Simulate fetching folder projects (replace with actual API call)
    const filtered = projects.filter(p => 
      (p as any).folderId === folderId
    );
    setFolderProjects(filtered);
  };

  const handleBackToAllProjects = () => {
    setSelectedFolder(null);
    setFolderProjects([]);
    updateQueryParams({ folder: '' });
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateQueryParams({ q: query });
  };

  // View mode handler
  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    updateQueryParams({ view: mode });
  };

  // Filter projects based on search and folder
  const displayedProjects = useMemo(() => {
    let filtered = projects;
    
    if (selectedFolder) {
      filtered = folderProjects;
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [projects, selectedFolder, folderProjects, searchQuery]);

  // DnD handlers: snap to 8px grid units
  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id);
    const over = e.over?.rect;
    const rect = e.active.rect.current?.translated;
    if (!rect || !over) return;
    // Compute snapped position inside canvas
    const canvas = (document.querySelector(".md-canvas") as HTMLElement)?.getBoundingClientRect();
    if (!canvas) return;
    const x = Math.max(0, Math.round((rect.left - canvas.left) / unit));
    const y = Math.max(0, Math.round((rect.top  - canvas.top)  / unit));
    move(id, x, y);
  };

  return (
    <div className="md-root">
      {/* Toolbar */}
      <div className="md-toolbar">
        <div className="md-left">
          <button 
            className={`md-pill ${viewMode === 'focused' ? 'active' : ''}`}
            onClick={() => handleViewChange('focused')}
          >
            Focused
          </button>
          <button 
            className={`md-pill ${viewMode === 'boardStats' ? 'active' : ''}`}
            onClick={() => handleViewChange('boardStats')}
          >
            Board + Stats
          </button>
          <button 
            className={`md-pill ${viewMode === 'minimal' ? 'active' : ''}`}
            onClick={() => handleViewChange('minimal')}
          >
            Minimal
          </button>
        </div>
        
        <div className="md-center">
          <input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="md-search"
          />
        </div>
        
        <div className="md-right">
          <button 
            className="md-primary"
            onClick={() => addBlock({ 
              id: `stats-${Date.now()}`, 
              type: "stats", 
              title: "Stats", 
              view: "grid", 
              x: 0, 
              y: 0, 
              w: 4, 
              h: 3 
            })}
          >
            + Add block
          </button>
        </div>
      </div>

      {/* Canvas */}
      {isClient && (
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
          <div className="md-canvas" style={{ ["--cols" as any]: gridCols, ["--unit" as any]: `${unit}px` }}>
            {blocks.map(b => {
              const Comp = Registry[b.type];
              return (
                <DraggableResizable
                  key={b.id}
                  id={b.id}
                  x={b.x} y={b.y} w={b.w} h={b.h}
                  onResize={(w,h)=>resize(b.id,w,h)}
                  header={
                    <div className="md-block-header">
                      <div className="md-title">{b.title}</div>
                      <div className="md-actions">
                        <button className="md-icon" onClick={()=>toggleCollapse(b.id)} aria-label="Collapse">▾</button>
                        <div className="md-grip" aria-label="Drag" />
                      </div>
                    </div>
                  }
                >
                  {!b.collapsed ? (
                    <Comp {...(b.type==="recent" ? { projects: displayedProjects } : {})} />
                  ) : <div className="mb-collapsed">Collapsed</div>}
                </DraggableResizable>
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
}

/** Minimal draggable+resizable shell (Dnd Kit + ResizeObserver) */
import { useDraggable } from "@dnd-kit/core";

function DraggableResizable({
  id, x, y, w, h, onResize, header, children
}: {
  id: string; x:number; y:number; w:number; h:number;
  onResize: (w:number,h:number)=>void;
  header: React.ReactNode; children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const ref = useRef<HTMLDivElement>(null);

  // Resize handle (bottom-right) with snapping
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = ref.current!;
    const canvas = el.parentElement!.getBoundingClientRect();
    const onMove = (ev: MouseEvent) => {
      const unit = parseFloat(getComputedStyle(el.parentElement!).getPropertyValue("--unit"));
      const right = Math.max(ev.clientX - canvas.left, 80);
      const bottom = Math.max(ev.clientY - canvas.top , 60);
      const w = Math.round(right / unit) - x;
      const h = Math.round(bottom / unit) - y;
      onResize(Math.max(2,w), Math.max(2,h));
    };
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const style: React.CSSProperties = {
    gridColumn: `${x+1} / span ${w}`,
    gridRow: `${y+1} / span ${h}`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <motion.div ref={ref} className="md-block" style={style} layout>
      <div ref={setNodeRef} className="md-head" {...listeners} {...attributes}>
        {header}
      </div>
      <div className="md-body">{children}</div>
      <button className="md-resize" onMouseDown={startResize} aria-label="Resize" />
    </motion.div>
  );
}
