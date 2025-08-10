// Minimal placeholder schemas; if zod is added later, swap these with zod/yup
export type Schema = {
  fields: { name: string; label: string; type: string; required?: boolean }[];
};

export const agentSchema: Schema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "systemPrompt", label: "System Prompt", type: "textarea" },
    { name: "model", label: "Model", type: "select" },
  ],
};

export const messageSchema: Schema = {
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "template", label: "Template", type: "textarea" },
  ],
};
