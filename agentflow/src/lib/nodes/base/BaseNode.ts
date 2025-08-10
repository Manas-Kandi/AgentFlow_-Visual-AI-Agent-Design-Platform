import { CanvasNode, Connection, NodeOutput } from "@/types";
import type { FlowContextBag, FlowMode } from "@/types/flow-io";
import type { RunExecutionOptions } from "@/types/run";
import { callGemini } from "@/lib/geminiClient";

export interface NodeContext {
  nodes: CanvasNode[];
  connections: Connection[];
  nodeOutputs: Record<string, NodeOutput>;
  currentNode: CanvasNode;
  // --- Optional v2 context fields (non-breaking) ---
  // Inputs addressed by the target node's input port names
  inputs?: Record<string, NodeOutput>;
  // The target node's own configuration
  config?: Record<string, unknown>;
  // Transitive, namespaced context of upstream nodes
  flowContext?: FlowContextBag;
  // Dual-mode flag for migration (default: NewMode)
  mode?: FlowMode;
  // Execution-level options (scenario, simulation, overrides)
  runOptions?: RunExecutionOptions;
}

export interface NodeExecutor {
  execute(context: NodeContext): Promise<NodeOutput>;
  validate(node: CanvasNode): boolean;
}

export abstract class BaseNode implements NodeExecutor {
  protected node: CanvasNode;

  constructor(node: CanvasNode) {
    this.node = node;
  }

  abstract execute(context: NodeContext): Promise<NodeOutput>;

  validate(node: CanvasNode): boolean {
    return true; // Default validation
  }

  // Helper to get input values from connected nodes
  protected getInputValues(context: NodeContext): string[] {
    // Prefer v2 inputs if present (already respecting block/transform)
    if (context.inputs && Object.keys(context.inputs).length > 0) {
      const toText = (val: NodeOutput): string => {
        if (typeof val === "string") return val;
        if (val && typeof val === "object") {
          if (typeof (val as Record<string, unknown>).output === "string") return (val as Record<string, unknown>).output as string;
          if (typeof (val as Record<string, unknown>).message === "string") return (val as Record<string, unknown>).message as string;
          // Unified LLM wrapper
          if ("llm" in (val as Record<string, unknown>) && (val as Record<string, unknown>).llm) {
            const raw: unknown = (val as Record<string, unknown>).llm;
            // NVIDIA (OpenAI-compatible) shape
            const nvidiaText: string | undefined = raw?.choices?.[0]?.message?.content;
            if (typeof nvidiaText === "string") return nvidiaText;
            // Gemini raw shape (for completeness if passed through)
            const gemText: string | undefined = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof gemText === "string") return gemText;
          }
          if ("gemini" in (val as Record<string, unknown>) && (val as Record<string, unknown>).gemini) {
            const g: unknown = (val as Record<string, unknown>).gemini;
            const t = g?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof t === "string") return t;
          }
        }
        try {
          return JSON.stringify(val);
        } catch {
          return String(val);
        }
      };
      return Object.values(context.inputs).map(toText).filter(Boolean) as string[];
    }

    // Legacy path: derive from connections and nodeOutputs
    const incoming = context.connections.filter(
      (c) => c.targetNode === this.node.id
    );
    return incoming
      .map((conn) => {
        const upstreamNode = context.nodes.find((n) => n.id === conn.sourceNode);
        // UI node special handling
        if (upstreamNode && (upstreamNode.type === "ui" || upstreamNode.subtype === "ui")) {
          const output = context.nodeOutputs[conn.sourceNode];
          if (typeof output === "string" && output) return output;
          if (output && typeof output === "object" && (output as Record<string, unknown>).message)
            return (output as Record<string, unknown>).message as string;
          if (output && typeof output === "object" && (output as Record<string, unknown>).content)
            return (output as Record<string, unknown>).content as string;
          type UIData = { content?: string; message?: string };
          const data = upstreamNode.data as UIData;
          return data?.content || data?.message || "";
        }
        const output = context.nodeOutputs[conn.sourceNode];
        if (typeof output === "string") return output;
        if (output && typeof output === "object") {
          if (typeof (output as Record<string, unknown>).output === "string") return (output as Record<string, unknown>).output as string;
          if ("llm" in (output as Record<string, unknown>) && (output as Record<string, unknown>).llm) {
            const raw: unknown = (output as Record<string, unknown>).llm;
            const nvidiaText: string | undefined = raw?.choices?.[0]?.message?.content;
            if (typeof nvidiaText === "string") return nvidiaText;
            const gemText: string | undefined = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof gemText === "string") return gemText;
          }
          if ("gemini" in (output as Record<string, unknown>)) {
            const geminiOutput = (output as Record<string, unknown>).gemini as unknown;
            const text = geminiOutput?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof text === "string") return text;
          }
          if ("provider" in (output as Record<string, unknown>) && (output as Record<string, unknown>).provider) {
            const provider: unknown = (output as Record<string, unknown>).provider;
            const text = provider?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof text === "string") return text;
          }
        }
        try {
          return JSON.stringify(output);
        } catch {
          return String(output);
        }
      })
      .filter(Boolean);
  }

  // Helper to format all inputs as context
  protected formatInputContext(context: NodeContext): string {
    if (context.mode === "LegacyMode") {
      // eslint-disable-next-line no-console
      console.warn(
        `[AgentFlow][Deprecation] NodeContext LegacyMode in use for node ${this.node.id}. Please migrate nodes to v2 (namespaced flowContext, inputs map).`
      );
    }
    const inputs = this.getInputValues(context);
    const parts: string[] = [];
    if (inputs.length) parts.push(inputs.join("\n\n"));
    const scenario = context.runOptions?.scenario;
    if (scenario && (scenario.description || scenario.timezone || scenario.workingHours || scenario.businessRules)) {
      const lines: string[] = [];
      if (scenario.description) lines.push(`Description: ${scenario.description}`);
      if (scenario.timezone) lines.push(`Timezone: ${scenario.timezone}`);
      if (scenario.workingHours && (scenario.workingHours.start || scenario.workingHours.end)) {
        lines.push(`Working Hours: ${scenario.workingHours.start ?? ""}-${scenario.workingHours.end ?? ""}`);
      }
      if (scenario.businessRules) lines.push(`Business Rules: ${scenario.businessRules}`);
      parts.push(["Scenario Context:", ...lines].join("\n"));
    }
    return parts.join("\n\n");
  }
}
