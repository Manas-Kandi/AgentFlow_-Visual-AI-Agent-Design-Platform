import type { CanvasNode } from "@/types";

export function toFormDefaults(node: CanvasNode): Record<string, any> {
  const d = (node.data ?? {}) as Record<string, any>;
  return {
    title: d.title || node.subtype || node.type,
    description: d.description || "",
    color: d.color || "#0066cc",
    systemPrompt: d.systemPrompt || "",
    personality: d.personality || "",
    model: d.model || "gemini-pro",
    template: d.template || d.prompt || "",
  };
}

export function applyFormToNode(node: CanvasNode, form: Record<string, any>): CanvasNode {
  const d = { ...(node.data as any) };
  return {
    ...node,
    data: {
      ...d,
      title: form.title,
      description: form.description,
      color: form.color,
      systemPrompt: form.systemPrompt,
      personality: form.personality,
      model: form.model,
      template: form.template,
    },
  };
}
