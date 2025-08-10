export type NewNodeType = "Agent" | "Tool" | "Router" | "Memory" | "Message" | "Conversation";

export function mapLegacyType(t: string): NewNodeType {
  switch (t) {
    case "Agent":
      return "Agent";
    case "ToolAgent":
      return "Tool";
    case "IfElse":
      return "Router";
    case "DecisionTree":
      return "Router";
    case "KnowledgeBase":
      return "Memory";
    case "StateMachine":
      return "Memory";
    case "Message":
      return "Message";
    case "PromptTemplate":
      return "Message";
    case "ConversationFlow":
      return "Conversation";
    default:
      return "Message";
  }
}

export interface NodeViewModel {
  id: string;
  title: string;
  emoji?: string;
  color?: string;
  status?: "running" | "ok" | "error";
}

export function toNodeVM(node: any): NodeViewModel {
  const d = (node?.data ?? {}) as Record<string, any>;
  return {
    id: node?.id,
    title: d.title || node?.subtype || node?.type || "Node",
    emoji: d.icon || "🧩",
    color: d.color,
    status: undefined,
  };
}
