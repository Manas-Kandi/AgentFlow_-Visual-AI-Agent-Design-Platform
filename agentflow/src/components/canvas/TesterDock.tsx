import React, { useState } from "react";
import "./canvas.css";

interface TesterDockProps {
  open?: boolean;
  onToggle?: () => void;
  events?: any[];
}

export default function TesterDock({ open = false, onToggle, events = [] }: TesterDockProps) {
  const [tab, setTab] = useState<"Summary" | "Output" | "Prompt" | "LLM" | "Inputs" | "Trace" | "Errors">("Summary");
  return (
    <section className={`af-dock ${open ? "is-open" : ""}`} aria-expanded={open}>
      <div className="af-dock-header">
        <div className="af-tabs">
          {["Summary", "Output", "Prompt", "LLM", "Inputs", "Trace", "Errors"].map((t) => (
            <button key={t} className={`af-tab ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t as any)}>
              {t}
            </button>
          ))}
        </div>
        <button className="af-btn" onClick={onToggle}>{open ? "Close" : "Open"}</button>
      </div>
      <div className="af-dock-body" role="tabpanel" aria-label={`${tab} panel`}>
        <pre className="af-code">{JSON.stringify({ tab, events }, null, 2)}</pre>
      </div>
    </section>
  );
}
