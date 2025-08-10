import React, { useEffect, useRef, useState } from "react";
import "./canvas.css";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onInsert: (type: string) => void;
}

const OPTIONS = ["Agent", "Tool", "Router", "Memory", "Message", "Conversation", "Run", "Share"];

export default function CommandPalette({ open, onClose, onInsert }: CommandPaletteProps) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => ref.current?.focus(), 0);
    }
  }, [open]);

  if (!open) return null;

  const filtered = OPTIONS.filter((o) => o.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="af-palette" role="dialog" aria-modal>
      <div className="af-palette-inner">
        <input
          ref={ref}
          className="af-input"
          placeholder="Type a command or node…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && filtered[0]) {
              onInsert(filtered[0]);
              onClose();
            }
          }}
        />
        <div className="af-palette-list">
          {filtered.map((f) => (
            <button key={f} className="af-menu-item" onClick={() => { onInsert(f); onClose(); }}>
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
