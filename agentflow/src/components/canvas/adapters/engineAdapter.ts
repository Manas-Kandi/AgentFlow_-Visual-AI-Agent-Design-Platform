import { CanvasNode, Connection, NodeOutput } from "@/types";
import type { RunExecutionOptions } from "@/types/run";
import { FlowEngine } from "@/lib/flow/FlowEngine";

export type NormalizedEvent = {
  stepId: string;
  nodeId: string;
  cause?: string;
  startedAt?: number;
  endedAt?: number;
  output?: NodeOutput | undefined;
  debug?: {
    prompt?: string;
    responseRaw?: unknown;
    tokens?: number;
  };
  error?: string;
};

export async function runFlow(
  nodes: CanvasNode[],
  edges: Connection[],
  startNodeId: string | null,
  options?: RunExecutionOptions,
  onEvent?: (e: NormalizedEvent) => void
): Promise<Record<string, NodeOutput>> {
  const engine = new FlowEngine(nodes, edges, options);
  if (startNodeId) engine.setStartNode(startNodeId);

  const outputs = await engine.execute(
    // emitLog (optional)
    (nodeId, log, output, error) => {
      onEvent?.({
        stepId: `${Date.now()}-${nodeId}`,
        nodeId,
        cause: log,
        output,
        error,
        startedAt: Date.now(),
        endedAt: Date.now(),
      });
    },
    // hooks
    {
      emitTesterEvent: (evt) => {
        onEvent?.({
          stepId: (evt as any)?.stepId || `${Date.now()}`,
          nodeId: (evt as any)?.nodeId || "",
          cause: (evt as any)?.cause,
          startedAt: (evt as any)?.startedAt,
          endedAt: (evt as any)?.endedAt,
          output: (evt as any)?.output,
          error: (evt as any)?.error,
          debug: (evt as any)?.debug,
        });
      },
    }
  );

  return outputs;
}
