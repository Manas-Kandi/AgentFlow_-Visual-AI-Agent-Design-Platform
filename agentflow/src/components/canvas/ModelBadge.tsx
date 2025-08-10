import React from "react";
import "./Canvas.css";

export interface ModelBadgeProps {
  mode: "hosted" | "byok";
  model: string;
  onChangeMode?: (m: "hosted" | "byok") => void;
  onChangeModel?: (m: string) => void;
}

export default function ModelBadge({ mode, model, onChangeMode, onChangeModel }: ModelBadgeProps) {
  return (
    <div className="af-model" aria-label="Model badge">
      <button className="af-chip" onClick={() => onChangeMode?.(mode === "hosted" ? "byok" : "hosted")}>{mode === "hosted" ? "Hosted" : "BYOK"}</button>
      <select className="af-select" value={model} onChange={(e) => onChangeModel?.(e.target.value)} aria-label="Model selector">
        <option value="gemini-pro">Gemini Pro</option>
        <option value="gpt-4o">GPT‑4o</option>
        <option value="llama-3.1">Llama 3.1</option>
      </select>
    </div>
  );
}
