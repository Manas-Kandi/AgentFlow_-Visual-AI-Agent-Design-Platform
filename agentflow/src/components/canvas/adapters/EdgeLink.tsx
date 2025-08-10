"use client";
import React from "react";
import { Connection } from "@/types";

export interface EdgeLinkProps {
  edge: Connection;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
  isPulsing?: boolean;
}

export default function EdgeLink({
  edge,
  sourcePos,
  targetPos,
  isPulsing = false,
}: EdgeLinkProps) {
  const getBezierPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const c1x = x1 + Math.abs(x2 - x1) * 0.5;
    const c1y = y1;
    const c2x = x2 - Math.abs(x2 - x1) * 0.5;
    const c2y = y2;

    return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  };

  const path = getBezierPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);

  return (
    <g>
      <path
        d={path}
        stroke={isPulsing ? "#3b82f6" : "#6b7280"}
        strokeWidth={isPulsing ? "3" : "2"}
        fill="none"
        className={isPulsing ? "af-edge-pulsing" : ""}
        style={{
          filter: isPulsing ? "drop-shadow(0 0 4px #3b82f6)" : "none",
          animation: isPulsing ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      />
      
      {/* Arrowhead */}
      <polygon
        points={`${targetPos.x - 8},${targetPos.y - 4} ${targetPos.x},${targetPos.y} ${targetPos.x - 8},${targetPos.y + 4}`}
        fill={isPulsing ? "#3b82f6" : "#6b7280"}
      />

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </g>
  );
}
