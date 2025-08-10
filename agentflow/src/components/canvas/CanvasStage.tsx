import React from "react";
import { CanvasNode, Connection } from "@/types";
import NodeCard from "./NodeCard";
import EdgeLink from "./EdgeLink";
import StartNodeBadge from "./StartNodeBadge";
import "./canvas.css";

export interface CanvasStageProps {
  nodes: CanvasNode[];
  edges: Connection[];
  startNodeId?: string | null;
  onConnect?: (p: { from: string; to: string; port?: string }) => void;
  onMove?: (id: string, x: number, y: number) => void;
  onSelect?: (ids: string[]) => void;
}

export default function CanvasStage(props: CanvasStageProps) {
  const { nodes, edges, startNodeId } = props;

  return (
    <div className="af-stage" role="region" aria-label="Canvas stage">
      <div className="af-grid" aria-hidden />
      {edges.map((e) => (
        <EdgeLink key={e.id} edge={e} />
      ))}
      {nodes.map((n) => (
        <div key={n.id} className="af-node-wrapper" style={{ transform: `translate(${n.position?.x || 0}px, ${n.position?.y || 0}px)` }}>
          <NodeCard node={n} />
          {startNodeId === n.id && <StartNodeBadge />}
        </div>
      ))}
    </div>
  );
}
