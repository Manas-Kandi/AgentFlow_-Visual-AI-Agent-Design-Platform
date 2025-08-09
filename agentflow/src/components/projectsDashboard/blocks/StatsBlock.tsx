"use client";
export default function StatsBlock() {
  return (
    <div className="mb-stats">
      <div className="mb-stat">
        <label className="mb-label">Total</label>
        <div className="mb-value">12</div>
        <div className="mb-delta mb-delta-up">+2</div>
      </div>
      <div className="mb-stat">
        <label className="mb-label">Active</label>
        <div className="mb-value">3</div>
        <div className="mb-delta mb-delta-up">+1</div>
      </div>
      <div className="mb-stat">
        <label className="mb-label">Nodes</label>
        <div className="mb-value">0</div>
        <div className="mb-delta mb-delta-neutral">0</div>
      </div>
    </div>
  );
}
