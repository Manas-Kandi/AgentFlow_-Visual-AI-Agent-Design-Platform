import React from "react";
import ModelBadge from "./ModelBadge";
import "./canvas.css";

interface CanvasHeaderProps {
  title: string;
  onTitleChange?: (t: string) => void;
  zoom: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onTest?: () => void;
  onShare?: () => void;
  mode?: "hosted" | "byok";
  model?: string;
  onChangeMode?: (m: "hosted" | "byok") => void;
  onChangeModel?: (model: string) => void;
}

export default function CanvasHeader(props: CanvasHeaderProps) {
  const {
    title,
    onTitleChange,
    zoom,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onTest,
    onShare,
    mode = "hosted",
    model = "gemini-pro",
    onChangeMode,
    onChangeModel,
  } = props;

  return (
    <header className="af-header" aria-label="Canvas header">
      <input
        className="af-title"
        aria-label="Project title"
        value={title}
        onChange={(e) => onTitleChange?.(e.target.value)}
      />
      <div className="af-header-actions">
        <ModelBadge
          mode={mode}
          model={model}
          onChangeMode={onChangeMode}
          onChangeModel={onChangeModel}
        />
        <div className="af-zoom" aria-label="Zoom controls">
          <button className="af-btn" onClick={onZoomOut} aria-label="Zoom out">
            −
          </button>
          <button className="af-btn" onClick={onZoomReset} aria-label="Reset zoom">
            {Math.round(zoom * 100)}%
          </button>
          <button className="af-btn" onClick={onZoomIn} aria-label="Zoom in">
            +
          </button>
        </div>
        <button className="af-btn af-primary" onClick={onTest} aria-label="Test flow">
          Test
        </button>
        <button className="af-btn" onClick={onShare} aria-label="Share">
          Share
        </button>
      </div>
    </header>
  );
}
