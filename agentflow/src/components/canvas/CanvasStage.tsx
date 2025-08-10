import React from "react";
import "./Canvas.css";
import CanvasAdapter from "./adapters/CanvasAdapter";
import { CanvasNode, Connection } from "@/types";

interface CanvasStageProps {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  onNodeSelect: (node: CanvasNode | null) => void;
  onNodeUpdate: (node: CanvasNode) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onCreateConnection: (connectionData: Connection) => Promise<void>;
  startNodeId: string | null;
  onStartNodeChange: (id: string | null) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeCreate: (node: CanvasNode) => void;
  nodeStatuses?: Record<string, "running" | "success" | "error">;
  pulsingConnectionIds?: string[];
}

export default function CanvasStage(props: CanvasStageProps) {
  return (
    <div className="af-canvas-stage">
      <CanvasAdapter {...props} zoom={1} />
    </div>
  );
}
