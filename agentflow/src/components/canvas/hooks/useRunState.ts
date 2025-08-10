import { useCallback, useMemo, useState } from "react";
import type { NormalizedEvent } from "../adapters/engineAdapter";

export function useRunState() {
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<NormalizedEvent[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(
    () => ({
      start: () => {
        setRunning(true);
        setEvents([]);
        setError(null);
      },
      stop: () => setRunning(false),
      push: (e: NormalizedEvent) => setEvents((prev) => [...prev, e]),
      setActiveNodeId,
      setError,
    }),
    []
  );

  return { running, events, activeNodeId, error, api };
}
