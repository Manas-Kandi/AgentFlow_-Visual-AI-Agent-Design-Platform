import React from "react";
import "./Canvas.css";

interface BottomTesterProps {
  isOpen: boolean;
  onToggle: () => void;
  startNodeId: string | null;
  onStartNodeChange?: (id: string | null) => void;
  nodeStatuses?: Record<string, "running" | "success" | "error">;
  pulsingConnectionIds?: string[];
  onTestFlow?: () => void;
  isTesting?: boolean;
}

export default function BottomTester({
  isOpen,
  onToggle,
  startNodeId,
  nodeStatuses,
  pulsingConnectionIds,
  onTestFlow,
  isTesting,
}: BottomTesterProps) {
  return (
    <section className={`af-bottomtester ${isOpen ? "is-open" : ""}`}>
      <div className="p-2 flex items-center justify-between">
        <span>Tester</span>
        <button className="af-btn" onClick={onToggle}>{isOpen ? "Close" : "Open"}</button>
      </div>
      {isOpen && (
        <div className="p-2 text-xs space-y-2 overflow-auto h-full">
          <button className="af-btn af-primary" onClick={onTestFlow} disabled={isTesting}>
            {isTesting ? "Running..." : "Run"}
          </button>
          <div>Start: {startNodeId || "None"}</div>
          <pre className="overflow-auto">
            {JSON.stringify({ nodeStatuses, pulsingConnectionIds }, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
