import React, { useMemo } from "react";
import { Connection } from "@/types";
import "./Canvas.css";

interface EdgeLinkProps {
  edge: Connection;
}

export default function EdgeLink({ edge }: EdgeLinkProps) {
  // Basic cubic bezier path using node positions if available later
  // For now, draw a placeholder straight path; adapters can enrich coordinates
  const path = useMemo(() => {
    // Without coordinates, render an invisible placeholder to avoid layout shift
    return "M0,0 C0,0 0,0 0,0";
  }, [edge.id]);

  return (
    <svg className="af-edge" aria-hidden>
      <path d={path} className="af-edge-path" />
    </svg>
  );
}
