"use client";

import * as React from "react";
import DashboardCard from "@/components/DashboardCard";
import { Badge } from "@/components/ui/badge";

export interface MetricRow {
  id: string;
  name: string;
  value: string | number;
  status?: "good" | "warn" | "bad" | "neutral";
  meta?: string;
}

interface MetricsTableProps {
  title?: string;
  rows: MetricRow[];
  className?: string;
}

export default function MetricsTable({ title = "Metrics", rows, className }: MetricsTableProps) {
  const toBadge = (s?: MetricRow["status"]) => {
    const map: Record<string, string> = {
      good: "var(--figma-success)",
      warn: "var(--figma-warning)",
      bad: "hsl(var(--destructive))",
      neutral: "hsl(var(--color-muted-foreground))",
    };
    const color = s ? map[s] : map.neutral;
    return (
      <Badge
        variant="outline"
        className="text-[11px] px-1.5 py-0.5"
        style={{
          color,
          backgroundColor: `color-mix(in hsl, ${color} 15%, transparent)`,
          borderColor: `color-mix(in hsl, ${color} 30%, transparent)`,
        }}
      >
        {s ?? "neutral"}
      </Badge>
    );
  };

  return (
    <DashboardCard title={title} className={className}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/60">
              <th className="py-2 pr-4 font-normal">Name</th>
              <th className="py-2 pr-4 font-normal">Value</th>
              <th className="py-2 pr-4 font-normal">Status</th>
              <th className="py-2 font-normal">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/40 last:border-0">
                <td className="py-2 pr-4 text-foreground/90">{r.name}</td>
                <td className="py-2 pr-4">{r.value}</td>
                <td className="py-2 pr-4">{toBadge(r.status)}</td>
                <td className="py-2 text-muted-foreground">{r.meta}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="py-4 text-muted-foreground" colSpan={4}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
