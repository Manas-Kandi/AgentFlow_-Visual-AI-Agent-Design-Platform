import React from "react";
import "./canvas.css";

interface CanvasHeaderProps {
  projectTitle: string;
  onTestFlow?: () => void;
  isTesting?: boolean;
}

export default function CanvasHeader({ projectTitle, onTestFlow, isTesting }: CanvasHeaderProps) {
  return (
    <header className="af-header flex items-center justify-between" aria-label="Canvas header">
      <h1 className="af-title">{projectTitle}</h1>
      <button
        className="af-btn af-primary"
        onClick={onTestFlow}
        disabled={isTesting}
        aria-label="Test flow"
      >
        {isTesting ? "Testing…" : "Test"}
      </button>
    </header>
  );
}
