import React, { useEffect, useRef } from "react";
import "./Canvas.css";

export interface ContextMenuProps {
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ACTIONS = [
  { id: "set-start", label: "Set as Start" },
  { id: "duplicate", label: "Duplicate" },
  { id: "disconnect", label: "Disconnect" },
  { id: "copy-id", label: "Copy ID" },
  { id: "delete", label: "Delete", danger: true },
];

export default function ContextMenu({ open, x, y, onClose, onAction }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="af-menu" style={{ left: x, top: y }} role="menu">
      {ACTIONS.map((a) => (
        <button
          key={a.id}
          role="menuitem"
          className={`af-menu-item ${a.danger ? "is-danger" : ""}`}
          onClick={() => onAction(a.id)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
