"use client";

import * as React from "react";
import DashboardCard from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export interface RecentFile {
  id: string;
  name: string;
  size?: string;
  modifiedAt: Date;
}

interface RecentFilesCardProps {
  files: RecentFile[];
  onOpen?: (id: string) => void;
  className?: string;
}

export default function RecentFilesCard({ files, onOpen, className }: RecentFilesCardProps) {
  return (
    <DashboardCard title="Latest Files" className={className} actions={
      <Button size="sm" variant="ghost" className="hover:bg-white/5">Upload</Button>
    }>
      <ul className="space-y-2">
        {files.slice(0, 6).map((f) => (
          <li key={f.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/[0.03]">
            <button
              className="text-left min-w-0 flex-1 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent-8))] rounded"
              onClick={() => onOpen?.(f.id)}
            >
              <p className="text-sm truncate text-foreground/90">{f.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {f.size ? `${f.size} · ` : ""}{f.modifiedAt.toLocaleString()}
              </p>
            </button>
            <Button size="icon" variant="ghost" aria-label={`Download ${f.name}`}>
              <Download className="w-4 h-4" />
            </Button>
          </li>
        ))}
        {files.length === 0 && (
          <li className="text-sm text-muted-foreground">No files yet</li>
        )}
      </ul>
    </DashboardCard>
  );
}
