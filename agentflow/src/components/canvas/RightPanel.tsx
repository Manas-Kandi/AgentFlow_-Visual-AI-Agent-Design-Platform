import React from "react";
import "./Canvas.css";
import PropertiesPanel from "@/components/panels/PropertiesPanel";
import { CanvasNode, Connection } from "@/types";

interface RightPanelProps {
  node: CanvasNode | null;
  onUpdate: (node: CanvasNode) => void;
  nodes: CanvasNode[];
  connections: Connection[];
  onConnectionsChange: (next: Connection[]) => void;
}

export default function RightPanel({
  node,
  onUpdate,
  nodes,
  connections,
  onConnectionsChange,
}: RightPanelProps) {
  return (
    <aside className="af-rightpanel">
      <PropertiesPanel
        selectedNode={node}
        onChange={onUpdate}
        nodes={nodes}
        connections={connections}
        onConnectionsChange={onConnectionsChange}
      />
    </aside>
  );
}
