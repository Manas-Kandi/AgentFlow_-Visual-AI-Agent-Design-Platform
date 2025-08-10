import React from "react";
import { Schema } from "./schemas";
import "../canvas.css";

export function Fieldset({ schema, value, onChange }: { schema: Schema; value: Record<string, any>; onChange: (v: Record<string, any>) => void; }) {
  return (
    <form className="af-form" onSubmit={(e) => e.preventDefault()}>
      {schema.fields.map((f) => (
        <label key={f.name} className="af-field">
          <span className="af-label">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              className="af-input"
              value={value[f.name] ?? ""}
              onChange={(e) => onChange({ ...value, [f.name]: e.target.value })}
              required={f.required}
            />
          ) : f.type === "select" ? (
            <select
              className="af-select"
              value={value[f.name] ?? ""}
              onChange={(e) => onChange({ ...value, [f.name]: e.target.value })}
            >
              <option value="">Select…</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gpt-4o">GPT‑4o</option>
            </select>
          ) : (
            <input
              className="af-input"
              type="text"
              value={value[f.name] ?? ""}
              onChange={(e) => onChange({ ...value, [f.name]: e.target.value })}
              required={f.required}
            />
          )}
        </label>
      ))}
    </form>
  );
}
