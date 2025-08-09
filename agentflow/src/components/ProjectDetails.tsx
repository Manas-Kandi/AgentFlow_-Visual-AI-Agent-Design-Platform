import React, { useState } from 'react';
import { Project } from '@/types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import {
  Share2,
  ArrowLeft,
  Pencil,
  Check,
  X,
  Loader2,
  Folder,
  Zap,
  Star,
  Circle,
  Diamond,
  Triangle,
  Hexagon,
  Square,
  Heart,
  Bookmark,
} from 'lucide-react';
import FileManager from './FileManager';
import MCPModal from './MCPModal';

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  onOpenCanvas: (projectId: string) => void;
}

export default function ProjectDetails({ project, onBack, onOpenCanvas }: ProjectDetailsProps) {
  const [mcpModalOpen, setMcpModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [localProject, setLocalProject] = useState<Project>(project);

  // Inline editing states
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(project.name);
  const [savingName, setSavingName] = useState(false);

  const [editingDesc, setEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState(project.description || '');
  const [savingDesc, setSavingDesc] = useState(false);

  // Token-based status colors using global CSS variables
  const statusStyles = (status: Project['status']) => {
    switch (status) {
      case 'deployed':
        return { base: 'var(--figma-success)' };
      case 'testing':
        return { base: 'var(--figma-warning)' };
      default:
        return { base: 'hsl(var(--color-muted-foreground))' };
    }
  };

  const statusBadgeStyle = (status: Project['status']): React.CSSProperties => {
    const { base } = statusStyles(status);
    return {
      color: base,
      backgroundColor: `color-mix(in hsl, ${base} 15%, transparent)`,
      borderColor: `color-mix(in hsl, ${base} 30%, transparent)`,
    } as React.CSSProperties;
  };

  // Consistent icon + gradient as in dashboard
  const getProjectIcon = (projectId: string) => {
    const icons = [Folder, Zap, Star, Circle, Diamond, Triangle, Hexagon, Square, Heart, Bookmark];
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      const char = projectId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const index = Math.abs(hash) % icons.length;
    return icons[index];
  };

  const getProjectGradient = (projectId: string) => {
    const gradients = [
      'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.06))',
      'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(34, 197, 94, 0.06))',
      'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.06))',
      'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(251, 113, 133, 0.06))',
      'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(196, 181, 253, 0.06))',
      'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(34, 211, 238, 0.06))',
      'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(217, 70, 239, 0.06))',
      'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(132, 204, 22, 0.06))',
      'linear-gradient(135deg, rgba(251, 113, 133, 0.12), rgba(244, 63, 94, 0.06))',
      'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(129, 140, 248, 0.06))',
    ];
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      const char = projectId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const saveName = async () => {
    if (!nameInput.trim() || nameInput === localProject.name) {
      setEditingName(false);
      return;
    }
    try {
      setSavingName(true);
      const { supabase } = await import('@/lib/supabaseClient');
      const { error } = await supabase
        .from('projects')
        .update({ name: nameInput.trim() })
        .eq('id', localProject.id);
      if (error) throw error;
      setLocalProject({ ...localProject, name: nameInput.trim() });
      setEditingName(false);
    } catch (e) {
      console.error('Failed to update project name', e);
    } finally {
      setSavingName(false);
    }
  };

  const saveDescription = async () => {
    if (descInput === localProject.description) {
      setEditingDesc(false);
      return;
    }
    try {
      setSavingDesc(true);
      const { supabase } = await import('@/lib/supabaseClient');
      const { error } = await supabase
        .from('projects')
        .update({ description: descInput })
        .eq('id', localProject.id);
      if (error) throw error;
      setLocalProject({ ...localProject, description: descInput });
      setEditingDesc(false);
    } catch (e) {
      console.error('Failed to update project description', e);
    } finally {
      setSavingDesc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-[hsl(var(--color-background))]/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur px-1 -mx-1">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="p-1.5 rounded-lg border border-border/60" style={{ background: getProjectGradient(localProject.id) }}>
              {React.createElement(getProjectIcon(localProject.id), { className: 'w-4 h-4 text-foreground/90' })}
            </div>
            <div className="min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName();
                      if (e.key === 'Escape') {
                        setEditingName(false);
                        setNameInput(localProject.name);
                      }
                    }}
                    onBlur={saveName}
                    className="h-8 w-[min(52ch,60vw)]"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={saveName} disabled={savingName}>
                    {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={(e) => e.preventDefault()} onClick={() => { setEditingName(false); setNameInput(localProject.name); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-medium truncate">{localProject.name}</h1>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditingName(true)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
              <div className="mt-0.5 flex items-center gap-2">
                <Badge variant="outline" className="text-xs" style={statusBadgeStyle(localProject.status)}>
                  {localProject.status}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{localProject.nodeCount} nodes</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setMcpModalOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share MCP
            </Button>
            <Button size="sm" onClick={() => onOpenCanvas(localProject.id)}>
              Open Canvas
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Onboarding hint when no description */}
          {!localProject.description?.trim() && !editingDesc && (
            <Card className="p-4 border border-[hsl(var(--color-accent))]/25 bg-[hsl(var(--color-accent))]/10">
              <div className="text-sm text-foreground/90">
                Add a short description to help your team understand this project. Click "Edit" below to get started.
              </div>
            </Card>
          )}

          {/* Description card */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full">
                <h3 className="font-medium mb-2">Description</h3>
                {editingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      autoFocus
                      value={descInput}
                      onChange={(e) => setDescInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') saveDescription();
                        if (e.key === 'Escape') { setEditingDesc(false); setDescInput(localProject.description || ''); }
                      }}
                      onBlur={saveDescription}
                      rows={4}
                      className="w-full resize-y"
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onMouseDown={(e) => e.preventDefault()} onClick={saveDescription} disabled={savingDesc}>
                        {savingDesc ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => { setEditingDesc(false); setDescInput(localProject.description || ''); }}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="group">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {localProject.description?.trim() || '—'}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditingDesc(true)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              <div className="shrink-0 hidden sm:flex flex-col items-end gap-2 min-w-[180px]">
                <Badge variant="outline" className="text-xs" style={statusBadgeStyle(localProject.status)}>
                  {localProject.status}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">Created {new Date(localProject.created_at).toLocaleDateString()}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">Updated {localProject.lastModified.toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <FileManager projectId={localProject.id} />
        </TabsContent>
      </Tabs>

      <MCPModal
        isOpen={mcpModalOpen}
        onClose={() => setMcpModalOpen(false)}
        projectId={localProject.id}
        projectName={localProject.name}
        onServerStatusChange={() => {}}
      />
    </div>
  );
}
