import React from "react";
import "./Canvas.css";

export default function EmptyState() {
  return (
    <div className="af-empty" role="region" aria-label="Empty canvas">
      <h2>Build your first flow</h2>
      <p>Press &quot;/&quot; to open the palette or drag a component from the left.</p>
    </div>
  );
}
