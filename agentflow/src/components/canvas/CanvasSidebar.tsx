import React from "react";
import "./canvas.css";

interface CanvasSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onInsert?: (type: string) => void;
}

const TYPES = ["Agent", "Tool", "Router", "Memory", "Message", "Conversation"];

export default function CanvasSidebar({ collapsed = false, onToggle, onInsert }: CanvasSidebarProps) {
  return (
    <aside className={`af-sidebar ${collapsed ? "is-collapsed" : ""}`} aria-expanded={!collapsed}>
      <div className="af-sidebar-header">
        <input className="af-input" placeholder="Search components…" aria-label="Search components" />
        <button className="af-btn" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? ">" : "<"}
        </button>
      </div>
      <div className="af-sidebar-content">
        {TYPES.map((t) => (
          <button key={t} className="af-chip" onClick={() => onInsert?.(t)}>
            {t}
          </button>
        ))}
      </div>
    </aside>
  );
}
