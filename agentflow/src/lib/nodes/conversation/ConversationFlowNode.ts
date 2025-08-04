import { BaseNode, NodeContext } from "../base/BaseNode";
import { NodeOutput } from "@/types";

interface ConversationRule {
  pattern: string;
  context: string;
}

interface ConversationFlowNodeData {
  historyLength?: number;
  contextRules?: ConversationRule[];
}

export class ConversationFlowNode extends BaseNode {
  private static histories = new Map<string, string[]>();

  async execute(context: NodeContext): Promise<NodeOutput> {
    const data = this.node.data as ConversationFlowNodeData;
    const historyLength = data.historyLength ?? 5;
    const rules = Array.isArray(data.contextRules) ? data.contextRules : [];

    const inputs = this.getInputValues(context);
    const message = inputs.join("\n");

    const history = ConversationFlowNode.histories.get(this.node.id) || [];
    if (message) {
      history.push(message);
    }
    const trimmed = history.slice(-historyLength);
    ConversationFlowNode.histories.set(this.node.id, trimmed);

    const activeContexts: string[] = [];
    for (const rule of rules) {
      const regex = new RegExp(rule.pattern, "i");
      if (trimmed.some((msg) => regex.test(msg))) {
        activeContexts.push(rule.context);
      }
    }

    return {
      history: trimmed,
      context: activeContexts,
    } as Record<string, unknown>;
  }
}
