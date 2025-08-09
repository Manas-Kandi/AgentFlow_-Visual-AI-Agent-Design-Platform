"use client";
import { motion } from "framer-motion";
import { Project } from "@/types";

// Helper to safely get the latest timestamp from a project
function getProjectTimestamp(p: Project): number {
  // Type guard for updatedAt
  if ("updatedAt" in p && typeof p.updatedAt === "string") {
    return new Date(p.updatedAt).getTime();
  }
  // Fallback to createdAt
  if ("createdAt" in p && typeof p.createdAt === "string") {
    return new Date(p.createdAt).getTime();
  }
  return 0;
}

export default function RecentProjectsBlock({
  projects,
}: {
  projects: Project[];
}) {
  const recents = [...projects]
    .sort((a, b) => getProjectTimestamp(b) - getProjectTimestamp(a))
    .slice(0, 6);

  return (
    <div className="mb-content">
      <div className="mb-grid">
        {recents.map((p, i) => (
          <motion.div
            key={p.id}
            className="mb-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="mb-dot"
              style={{ ["--tone"]: colorFromId(p.id) } as React.CSSProperties}
            />
            <div className="mb-title" title={p.name}>
              {p.name}
            </div>
            <div className="mb-sub">{p.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
function colorFromId(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return `hsl(${200 + (h % 30)} 70% 60%)`; // blue-leaning
}
