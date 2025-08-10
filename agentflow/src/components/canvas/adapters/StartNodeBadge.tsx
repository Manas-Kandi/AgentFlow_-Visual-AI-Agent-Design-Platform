"use client";
import React from "react";
import { Play } from "lucide-react";

export default function StartNodeBadge() {
  return (
    <div
      className="af-start-node-badge"
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '20px',
        height: '20px',
        background: '#10b981',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10,
      }}
    >
      <Play size={12} />
    </div>
  );
}
