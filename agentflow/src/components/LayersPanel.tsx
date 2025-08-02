"use client";

import { Layers as LayersIcon } from "lucide-react";
import { CanvasNode } from "@/types";

interface LayersPanelProps {
  nodes: CanvasNode[];
}

export default function LayersPanel({ nodes }: LayersPanelProps) {
  return (
    <aside className="w-64 border-r border-[hsl(var(--color-border))] bg-[hsl(var(--color-secondary))] flex flex-col">
      <div className="border-b border-[hsl(var(--color-border))] p-[var(--spacing-4)]">
        <h2 className="font-medium text-[var(--text-sm)]">Layers</h2>
      </div>
      <div className="flex-1 overflow-y-auto figma-scrollbar p-[var(--spacing-2)]">
        <ul className="space-y-[var(--spacing-1)]">
          {nodes.map((node) => {
            const title = (node.data as { title?: string }).title ?? node.id;

            return (
              <li
                key={node.id}
                className="flex items-center gap-[var(--spacing-2)] rounded cursor-pointer hover:bg-[hsl(var(--color-background))] px-[var(--spacing-2)] py-[var(--spacing-1)] text-[var(--text-sm)]"
              >
                <LayersIcon className="w-4 h-4 text-[hsl(var(--color-muted-foreground))]" />
                <span className="truncate">{title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

