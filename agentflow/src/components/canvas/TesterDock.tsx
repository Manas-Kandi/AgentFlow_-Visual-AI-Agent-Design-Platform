import React from "react";
import "./canvas.css";

interface TesterDockProps {
  isOpen: boolean;
  onToggle: () => void;
  startNodeId: string | null;
  onStartNodeChange: (id: string | null) => void;
  nodeStatuses?: Record<string, "running" | "success" | "error">;
  pulsingConnectionIds?: string[];
  onTestFlow?: () => void;
  isTesting?: boolean;
}

export default function TesterDock({
  isOpen,
  onToggle,
  startNodeId,
  onStartNodeChange,
  nodeStatuses,
  pulsingConnectionIds,
  onTestFlow,
  isTesting,
}: TesterDockProps) {
  return (
    <section className={`af-dock ${isOpen ? "is-open" : ""}`} aria-expanded={isOpen}>
      <div className="af-dock-header">
        <span>Tester</span>
        <button className="af-btn" onClick={onToggle}>
          {isOpen ? "Close" : "Open"}
        </button>
      </div>
      {isOpen && (
        <div className="af-dock-body">
          <div className="mb-2 flex items-center gap-2">
            <button
              className="af-btn af-primary"
              onClick={onTestFlow}
              disabled={isTesting}
            >
              {isTesting ? "Running..." : "Run"}
            </button>
            <span className="text-xs text-gray-400">Start: {startNodeId || "None"}</span>
          </div>
          <pre className="af-code text-xs overflow-auto">
            {JSON.stringify({ nodeStatuses, pulsingConnectionIds }, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
