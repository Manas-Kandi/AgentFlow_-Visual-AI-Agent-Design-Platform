"use client";

import { ReactNode, CSSProperties } from "react";
import TabBar from "@/components/TabBar";
import {
  MousePointer,
  Hand,
  Link,
  FileText,
  Play,
  Share,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const toolbarStyle: CSSProperties = {
  height: "48px",
  width: "100%",
  borderBottom: "1px solid hsl(var(--color-border))",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 12px",
  backgroundColor: "hsl(var(--color-secondary))",
};

const toolButtonStyle: CSSProperties = {
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--radius)",
  border: "1px solid hsl(var(--color-border))",
  backgroundColor: "hsl(var(--color-secondary))",
  color: "hsl(var(--color-muted-foreground))",
  cursor: "pointer",
  padding: 0,
  transition: "background-color 0.15s ease, color 0.15s ease",
};

interface DesignerLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  onTestFlow?: () => void;
  testButtonDisabled?: boolean;
}

export default function DesignerLayout({
  left,
  center,
  right,
  onTestFlow,
  testButtonDisabled = false,
}: DesignerLayoutProps) {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[hsl(var(--color-background))]">
      {/* Left Sidebar */}
      {left}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TabBar />
        {/* Toolbar */}
        <div style={toolbarStyle}>
          <div className="flex items-center gap-1">
            {[
              { id: "select", name: "Select", icon: MousePointer, shortcut: "V" },
              { id: "hand", name: "Hand", icon: Hand, shortcut: "H" },
              { id: "connect", name: "Connect", icon: Link, shortcut: "C" },
              { id: "text", name: "Comment", icon: FileText, shortcut: "T" },
            ].map((tool) => (
              <button
                key={tool.id}
                style={toolButtonStyle}
                className="hover:bg-[hsl(var(--color-background))] active:bg-[hsl(var(--color-border))]"
                title={`${tool.name} (${tool.shortcut})`}
              >
                <tool.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--color-muted-foreground))] font-mono">100%</span>
            <button
              style={toolButtonStyle}
              className="hover:bg-[hsl(var(--color-background))] active:bg-[hsl(var(--color-border))]"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              style={toolButtonStyle}
              className="hover:bg-[hsl(var(--color-background))] active:bg-[hsl(var(--color-border))]"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              style={{ borderRadius: "var(--radius)" }}
              onClick={onTestFlow}
              disabled={testButtonDisabled}
            >
              <Play className="w-4 h-4" />
              Test
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 text-xs font-mono bg-[hsl(var(--color-secondary))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-background))] transition-colors"
              style={{ borderRadius: "var(--radius)" }}
            >
              <Share className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex bg-[hsl(var(--color-background))]">{center}</div>
      </div>

      {/* Right Sidebar */}
      {right}
    </div>
  );
}
