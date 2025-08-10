import React from "react";
import { CanvasNode } from "@/types";
import "./Canvas.css";

export interface NodeVM {
  id: string;
  title: string;
  emoji?: string;
  color?: string;
  status?: "running" | "ok" | "error";
}

interface NodeCardProps {
  node: CanvasNode;
  vm?: NodeVM;
}

export default function NodeCard({ node, vm }: NodeCardProps) {
  const data =
    typeof node.data === "object" && node.data
      ? (node.data as Record<string, unknown>)
      : {};
  const title = vm?.title ?? (typeof data.title === "string" ? data.title : node.subtype || node.type);
  const color = vm?.color ?? (typeof data.color === "string" ? data.color : undefined);

  return (
    <div className="af-card" role="group" aria-label={`Node ${title}`} style={{ borderColor: color }}>
      <div className="af-card-head">
        <span className="af-card-emoji" aria-hidden>{vm?.emoji ?? "🧩"}</span>
        <span className="af-card-title">{title}</span>
        {vm?.status && <span className={`af-status af-${vm.status}`} />}
      </div>
      <div className="af-ports">
        <div className="af-ports-col" aria-label="Inputs">
          {(node.inputs || []).map((p) => (
            <div key={p.id} className="af-port" data-side="in" />
          ))}
        </div>
        <div className="af-ports-col" aria-label="Outputs">
          {(node.outputs || []).map((p) => (
            <div key={p.id} className="af-port" data-side="out" />
          ))}
        </div>
      </div>
    </div>
  );
}
