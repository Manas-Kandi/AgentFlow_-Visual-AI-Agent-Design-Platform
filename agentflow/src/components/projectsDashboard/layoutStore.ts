"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BlockType = "recent" | "kanban" | "stats";
export type ViewKind = "list" | "grid" | "board" | "calendar";

export interface BlockConfig {
  id: string;
  type: BlockType;
  title: string;
  view: ViewKind;
  // layout (CSS grid areas; x/y/w/h measured in “grid units”)
  x: number;
  y: number;
  w: number;
  h: number;
  collapsed?: boolean;
  pinned?: boolean;
  // per-block filters/sorts (kept simple here)
  filters?: Record<string, string | number | boolean | undefined>;
}

export interface LayoutState {
  blocks: BlockConfig[];
  gridCols: number;
  unit: number; // px per grid unit (for resize snapping)
  // actions
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  toggleCollapse: (id: string) => void;
  addBlock: (b: BlockConfig) => void;
  removeBlock: (id: string) => void;
  loadTemplate: (name: "focused" | "boardStats" | "minimal") => void;
}

const templates: Record<string, BlockConfig[]> = {
  focused: [
    {
      id: "recent",
      type: "recent",
      title: "Recent Projects",
      view: "grid",
      x: 0,
      y: 0,
      w: 12,
      h: 6,
    },
    {
      id: "stats",
      type: "stats",
      title: "Stats",
      view: "grid",
      x: 0,
      y: 6,
      w: 12,
      h: 4,
    },
  ],
  boardStats: [
    {
      id: "kanban",
      type: "kanban",
      title: "Board",
      view: "board",
      x: 0,
      y: 0,
      w: 8,
      h: 10,
    },
    {
      id: "stats",
      type: "stats",
      title: "Overview",
      view: "grid",
      x: 8,
      y: 0,
      w: 4,
      h: 10,
    },
  ],
  minimal: [
    {
      id: "recent",
      type: "recent",
      title: "Recent",
      view: "list",
      x: 0,
      y: 0,
      w: 12,
      h: 6,
    },
  ],
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      blocks: templates.focused,
      gridCols: 12,
      unit: 16,
      move: (id: string, x: number, y: number) =>
        set((s: LayoutState) => ({
          blocks: s.blocks.map((b: BlockConfig) =>
            b.id === id ? { ...b, x, y } : b
          ),
        })),
      resize: (id: string, w: number, h: number) =>
        set((s: LayoutState) => ({
          blocks: s.blocks.map((b: BlockConfig) =>
            b.id === id ? { ...b, w, h } : b
          ),
        })),
      toggleCollapse: (id: string) =>
        set((s: LayoutState) => ({
          blocks: s.blocks.map((b: BlockConfig) =>
            b.id === id ? { ...b, collapsed: !b.collapsed } : b
          ),
        })),
      addBlock: (b: BlockConfig) =>
        set((s: LayoutState) => ({ blocks: [...s.blocks, b] })),
      removeBlock: (id: string) =>
        set((s: LayoutState) => ({
          blocks: s.blocks.filter((b: BlockConfig) => b.id !== id),
        })),
      loadTemplate: (name: "focused" | "boardStats" | "minimal") =>
        set({ blocks: templates[name] ?? templates.focused }),
    }),
    {
      name: "projects-dashboard-layout",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
