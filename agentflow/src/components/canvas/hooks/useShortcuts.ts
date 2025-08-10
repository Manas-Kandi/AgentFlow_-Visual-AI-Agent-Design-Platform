import { useEffect } from "react";

export function useShortcuts({ onRun, onOpenPalette }: { onRun?: () => void; onOpenPalette?: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // / to open command palette
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        onOpenPalette?.();
        e.preventDefault();
        return;
      }
      // Cmd/Ctrl + Enter to run
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") {
        onRun?.();
        e.preventDefault();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRun, onOpenPalette]);
}
