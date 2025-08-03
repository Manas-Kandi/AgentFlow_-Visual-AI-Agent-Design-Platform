// All UI rules for properties panels must come from propertiesPanelTheme.ts
import React, { useState } from "react";
import { figmaPropertiesTheme as theme } from "./propertiesPanelTheme";
import {
  CanvasNode,
  ChatNodeData as BaseChatNodeData,
} from "@/types";
import { isChatNodeData } from "@/utils/typeGuards";
import { PanelSection } from "./PanelSection";
import { VSCodeInput } from "./vsCodeFormComponents";

interface ChatInterfacePropertiesPanelProps {
  node: CanvasNode;
  onChange: (node: CanvasNode) => void;
}

type ChatNodeData = BaseChatNodeData & {
  placeholder?: string;
  enableFileUpload?: boolean;
  showHistory?: boolean;
};

export default function ChatInterfacePropertiesPanel({
  node,
  onChange,
}: ChatInterfacePropertiesPanelProps) {
  const defaultData: ChatNodeData = {
    title: "",
    description: "",
    color: "",
    icon: "",
    messages: [],
    placeholder: "",
    enableFileUpload: false,
    showHistory: false,
  };
  const data: ChatNodeData = isChatNodeData(node.data)
    ? { ...defaultData, ...(node.data as ChatNodeData) }
    : defaultData;

  const [title, setTitle] = useState<string>(data.title ?? "");
  const [placeholder, setPlaceholder] = useState<string>(
    data.placeholder ?? ""
  );
  const [enableFileUpload, setEnableFileUpload] = useState<boolean>(
    data.enableFileUpload ?? false
  );
  const [showHistory, setShowHistory] = useState<boolean>(
    data.showHistory ?? false
  );

  // Only update known fields, preserve extra fields
  const handleFieldChange = (field: keyof ChatNodeData, value: unknown) => {
    const current: ChatNodeData = isChatNodeData(node.data)
      ? (node.data as ChatNodeData)
      : defaultData;
    const updatedData = { ...current, [field]: value };
    onChange({ ...node, data: updatedData });
  };

  // Compose styles from theme
  const panelStyle: React.CSSProperties = {
    background: theme.colors.background,
    borderLeft: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    minHeight: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.lg,
  };
  const labelStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
  };
  const inputStyle: React.CSSProperties = {
    background: theme.colors.backgroundTertiary,
    color: theme.colors.textPrimary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.inputPadding,
    width: "100%",
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize.base,
  };

  return (
    <div style={panelStyle}>
      <PanelSection
        title="Chat Interface Settings"
        description="Configure chat interface properties."
      >
        <label style={labelStyle}>Title</label>
        <VSCodeInput
          style={inputStyle}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
            handleFieldChange("title", e.target.value);
          }}
          placeholder="Chat title"
        />
        <label style={labelStyle}>Placeholder</label>
        <VSCodeInput
          style={inputStyle}
          value={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPlaceholder(e.target.value);
            handleFieldChange("placeholder", e.target.value);
          }}
          placeholder="Type your message..."
        />
        <div style={{ marginTop: theme.spacing.md }}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={enableFileUpload}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEnableFileUpload(e.target.checked);
                handleFieldChange("enableFileUpload", e.target.checked);
              }}
              style={{ marginRight: theme.spacing.sm }}
            />
            Enable File Upload
          </label>
        </div>
        <div style={{ marginTop: theme.spacing.sm }}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={showHistory}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setShowHistory(e.target.checked);
                handleFieldChange("showHistory", e.target.checked);
              }}
              style={{ marginRight: theme.spacing.sm }}
            />
            Show History
          </label>
        </div>
      </PanelSection>
    </div>
  );
}
