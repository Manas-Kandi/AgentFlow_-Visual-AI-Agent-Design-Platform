import React from "react";
import "./Canvas.css";
import { CanvasNode } from "@/types";

interface LeftPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onNodeCreate: (node: CanvasNode) => void;
}

export default function LeftPanel({ isOpen, onToggle, onNodeCreate }: LeftPanelProps) {
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
    <aside className="af-leftpanel" style={{ width: isOpen ? 280 : 56 }}>
      <div className="p-2">
        <button className="af-btn" onClick={onToggle} aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
          {isOpen ? "<" : ">"}
        </button>
      </div>
      {isOpen && (
        <div className="p-2 flex flex-col gap-2">
          <button className="af-btn" onClick={handleAddNode}>
            Add Node
          </button>
        </div>
      )}
    </aside>
  );
}
