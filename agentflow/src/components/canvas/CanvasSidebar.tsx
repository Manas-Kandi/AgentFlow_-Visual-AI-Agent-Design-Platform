import React from "react";
import { CanvasNode } from "@/types";
import "./canvas.css";

interface CanvasSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNodeCreate: (node: CanvasNode) => void;
}

export default function CanvasSidebar({ isOpen, onToggle, onNodeCreate }: CanvasSidebarProps) {
  const handleAddNode = () => {
    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      type: "message",
      subtype: "default",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      data: { title: "New Node" },
      inputs: [],
      outputs: [],
    };
    onNodeCreate(newNode);
  };

  return (
    <aside className={`af-sidebar ${isOpen ? "" : "is-collapsed"}`} aria-expanded={isOpen}>
      <div className="af-sidebar-header">
        <button className="af-btn" onClick={onToggle} aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
          {isOpen ? "<" : ">"}
        </button>
      </div>
      {isOpen && (
        <div className="af-sidebar-content">
          <button className="af-chip" onClick={handleAddNode}>
            Add Node
          </button>
        </div>
      )}
    </aside>
  );
}
