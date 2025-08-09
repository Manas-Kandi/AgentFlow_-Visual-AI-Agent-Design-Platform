"use client";

import * as React from "react";
import DashboardCard from "@/components/DashboardCard";
import UserAvatar from "@/components/UserAvatar";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  at: Date;
  by?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export default function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <DashboardCard title="Activity" className={className}>
      <ul className="space-y-3">
        {items.slice(0, 10).map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              <UserAvatar name={item.by ?? "User"} />
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-5 text-foreground/90 truncate">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              )}
              <time className="text-[11px] text-muted-foreground/80">
                {formatRelative(item.at)}
              </time>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">No recent activity</li>
        )}
      </ul>
    </DashboardCard>
  );
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
