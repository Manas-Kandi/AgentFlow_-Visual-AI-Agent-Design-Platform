import type { NormalizedEvent } from "./engineAdapter";

export type TimelineStep = {
  id: string;
  nodeId: string;
  status: "running" | "ok" | "error";
  startedAt?: number;
  endedAt?: number;
};

export type InspectorPayload = Record<string, unknown>;

export function toTimeline(events: NormalizedEvent[]): TimelineStep[] {
  return events.map((e) => ({
    id: e.stepId,
    nodeId: e.nodeId,
    status: e.error ? "error" : "ok",
    startedAt: e.startedAt,
    endedAt: e.endedAt,
  }));
}

export function toInspector(events: NormalizedEvent[]): InspectorPayload {
  const last = events[events.length - 1];
  return {
    output: last?.output,
    debug: last?.debug,
    error: last?.error,
  };
}
