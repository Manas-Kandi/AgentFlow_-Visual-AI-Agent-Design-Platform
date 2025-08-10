import React from "react";
import "./Canvas.css";

interface NodeFrameProps {
  title: string;
  children?: React.ReactNode;
}

export default function NodeFrame({ title, children }: NodeFrameProps) {
  return (
    <div className="af-node-frame">
      <div className="af-node-header">{title}</div>
      {children}
    </div>
  );
}
