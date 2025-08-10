import React from "react";
import "./Canvas.css";

interface TopBarProps {
  projectTitle: string;
  onTestFlow?: () => void;
  isTesting?: boolean;
}

export default function TopBar({ projectTitle, onTestFlow, isTesting }: TopBarProps) {
  return (
    <header className="af-topbar" aria-label="Canvas header">
      <h1 className="text-sm font-semibold">{projectTitle}</h1>
      <div className="ml-auto flex items-center gap-2">
        <button
          className="af-btn af-primary"
          onClick={onTestFlow}
          disabled={isTesting}
          aria-label="Test flow"
        >
          {isTesting ? "Testing…" : "Test"}
        </button>
      </div>
    </header>
  );
}
