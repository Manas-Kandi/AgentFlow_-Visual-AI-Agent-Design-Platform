"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
}

export default function DashboardCard({ title, actions, className, children, ...props }: DashboardCardProps) {
  return (
    <Card
      role="region"
      aria-label={title ?? undefined}
      className={cn(
        "bg-[hsl(var(--color-card))] border border-border/80 shadow-[0_1px_0_0_hsl(var(--border))] rounded-xl",
        "hover:shadow-[0_0_0_1px_hsl(var(--border))] transition-shadow",
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          {title ? (
            <h3 className="text-sm font-medium text-foreground/90">{title}</h3>
          ) : (
            <div />
          )}
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className={cn("p-4", !title && !actions && "pt-4")}>{children}</div>
    </Card>
  );
}
