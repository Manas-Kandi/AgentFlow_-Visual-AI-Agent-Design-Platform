import type { CSSProperties } from "react";
import { figmaHoverStyle, figmaSelectedStyle } from "../utils/figmaInteractions";

// Base style shared by all nodes
export const figmaNodeStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, var(--figma-surface) 0%, var(--figma-surface-hover) 100%)",
  border: "1px solid var(--node-accent, var(--figma-border))",
  borderRadius: "var(--figma-radius)",
  boxShadow:
    "0 1px 3px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

// Hover and selection enhancements build on the base style but allow
// customization through the --node-accent CSS variable.
export const hoverNodeStyle: CSSProperties = {
  ...figmaHoverStyle,
  transform: "scale(1.02)",
  boxShadow:
    "0 0 0 2px var(--node-accent, var(--figma-border)), 0 4px 12px rgba(0,0,0,0.3)",
};

export const selectedNodeStyle: CSSProperties = {
  ...figmaSelectedStyle,
  transform: "scale(1.03)",
  boxShadow:
    "0 0 0 2px var(--node-accent, var(--figma-accent)), 0 6px 16px rgba(0,0,0,0.4), 0 0 8px var(--node-accent, var(--figma-accent))",
};
