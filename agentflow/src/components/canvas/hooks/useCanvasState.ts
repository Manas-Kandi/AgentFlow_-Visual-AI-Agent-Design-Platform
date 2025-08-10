import { useCallback, useMemo, useState } from "react";

export function useCanvasState() {
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [selection, setSelection] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<any | null>(null);

  const api = useMemo(
    () => ({
      zoomIn: () => setViewport((v) => ({ ...v, scale: Math.min(3, v.scale * 1.1) })),
      zoomOut: () => setViewport((v) => ({ ...v, scale: Math.max(0.25, v.scale / 1.1) })),
      zoomReset: () => setViewport((v) => ({ ...v, scale: 1 })),
      setSelection,
      copy: (data: any) => setClipboard(data),
      paste: () => clipboard,
    }),
    [clipboard]
  );

  return { viewport, setViewport, selection, setSelection, clipboard, setClipboard, api };
}
