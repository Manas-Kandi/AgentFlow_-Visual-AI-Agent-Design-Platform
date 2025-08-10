import React from "react";
import "./canvas.css";

export default function EmptyState() {
  return (
    <div className="af-empty" role="region" aria-label="Empty canvas">
      <h2>Build your first flow</h2>
      <p>Press "/" to open the palette or drag a component from the left.</p>
    </div>
  );
}
