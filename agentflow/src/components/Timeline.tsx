"use client";

import * as React from "react";
import DashboardCard from "@/components/DashboardCard";

export interface TimelineItem {
  id: string;
  date: Date; // due or event date
  label: string;
  meta?: string;
}

interface TimelineProps {
  rangeLabel?: string;
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ rangeLabel = "This week", items, className }: TimelineProps) {
  // Build a simple 7-day strip starting today
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <DashboardCard title={rangeLabel} className={className}>
      <div className="flex items-center gap-2 mb-3">
        {days.map((d, idx) => (
          <div
            key={idx}
            className="flex-1 text-center py-1.5 rounded-md bg-white/[0.02] border border-white/10"
            aria-label={d.toDateString()}
          >
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {d.toLocaleDateString(undefined, { weekday: "short" })}
            </div>
            <div className="text-sm text-foreground/90">
              {d.getDate()}
            </div>
          </div>
        ))}
      </div>
      <ul className="space-y-2">
        {items.slice(0, 6).map((it) => (
          <li key={it.id} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--color-accent-9))]" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm text-foreground/90 truncate">{it.label}</p>
              <p className="text-xs text-muted-foreground truncate">
                {new Date(it.date).toLocaleString()} {it.meta ? `· ${it.meta}` : ""}
              </p>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">No upcoming items</li>
        )}
      </ul>
    </DashboardCard>
  );
}
