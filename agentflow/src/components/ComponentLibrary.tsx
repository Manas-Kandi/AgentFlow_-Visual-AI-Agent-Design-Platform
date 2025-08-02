"use client"

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Bot } from 'lucide-react';
import { nodeCategories } from '@/data/nodeDefinitions';
import { theme as colors } from '@/data/theme';
import { NodeType, NodeCategory } from '@/types';

const SIDEBAR_WIDTH = "16rem";

const sidebarStyle: React.CSSProperties = {
  width: SIDEBAR_WIDTH,
  minWidth: SIDEBAR_WIDTH,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: colors.sidebar,
  borderRight: `1px solid ${colors.border}`,
  color: colors.text,
  fontFamily: "var(--font-code)",
  fontSize: "var(--fs-xs)",
};

const sidebarTabStyle: React.CSSProperties = {
  flex: 1,
  padding: "var(--space-sm)",
  textAlign: "center",
  fontFamily: "var(--font-ui)",
  fontSize: "var(--fs-xs)",
  fontWeight: 600,
  color: colors.textMute,
  background: "none",
  border: "none",
  cursor: "pointer",
};

const activeTabStyle: React.CSSProperties = {
  color: colors.text,
  boxShadow: `inset 0 -2px 0 ${colors.accent}`,
};

interface ComponentLibraryProps {
  onAddNode: (nodeType: NodeType) => void;
  onBackToProjects: () => void;
}

export function ComponentLibrary({ onAddNode, onBackToProjects }: ComponentLibraryProps) {
  // Dynamically create expandedSections based on nodeCategories
  const initialSections: Record<string, boolean> = Object.fromEntries(nodeCategories.map((cat: NodeCategory) => [cat.id, true]));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(initialSections);
  const [searchTerm] = useState('');
  const tabs = [
    { id: 'layers', label: 'Layers' },
    { id: 'assets', label: 'Assets' },
    { id: 'pages', label: 'Pages' },
  ] as const;

  type TabId = typeof tabs[number]['id'];
  const [activeTab, setActiveTab] = useState<TabId>('assets');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter nodes based on search term
  const filteredCategories: NodeCategory[] = nodeCategories.map((category: NodeCategory) => ({
    ...category,
    nodes: category.nodes.filter((node: NodeType) => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((category: NodeCategory) => category.nodes.length > 0);

  return (
    <aside style={sidebarStyle}>
      {/* Header */}
      <div
        style={{
          height: "3rem",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 var(--space-md)",
        }}
      >
        <button
          onClick={onBackToProjects}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            padding: "var(--space-xs) var(--space-sm)",
            background: "none",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.accent,
            }}
          >
            <Bot style={{ width: "1rem", height: "1rem", color: "#fff" }} />
          </div>
          <span
            style={{
              fontSize: "var(--fs-xs)",
              fontWeight: 600,
              color: colors.text,
              letterSpacing: "0.05em",
            }}
          >
            AgentFlow
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}` }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...sidebarTabStyle,
              ...(activeTab === tab.id ? activeTabStyle : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-md)" }}>
        {activeTab === "assets" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "var(--space-sm)",
              }}
            >
              <span style={{ fontSize: "var(--fs-xs)", fontWeight: 600 }}>
                Components
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {filteredCategories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleSection(category.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-sm)",
                      padding: "var(--space-xs) var(--space-sm)",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      borderRadius: 4,
                      color: colors.text,
                      cursor: "pointer",
                      fontSize: "var(--fs-xs)",
                      fontFamily: "var(--font-ui)",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${colors.accent}1A`)}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")}
                  >
                    {expandedSections[category.id] ? (
                      <ChevronDown
                        style={{ width: 16, height: 16, color: colors.accent }}
                      />
                    ) : (
                      <ChevronRight
                        style={{ width: 16, height: 16, color: colors.accent }}
                      />
                    )}
                    <span>{category.name}</span>
                  </button>
                  {expandedSections[category.id] && (
                    <div
                      style={{
                        marginLeft: "var(--space-md)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-xs)",
                      }}
                    >
                      {category.nodes.map((node) => (
                        <div
                          key={node.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-sm)",
                            padding: "var(--space-xs) var(--space-sm)",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: "var(--fs-xs)",
                            fontFamily: "var(--font-code)",
                            color: colors.text,
                          }}
                          onClick={() => onAddNode(node)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = `${colors.accent}1A`)}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "none")}
                        >
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 4,
                              backgroundColor: node.color,
                            }}
                          />
                          {React.createElement(node.icon, {
                            style: {
                              width: 16,
                              height: 16,
                              color: colors.textMute,
                            },
                          })}
                          <span>{node.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "layers" && (
          <div style={{ color: colors.textMute }}>Layers panel coming soon</div>
        )}

        {activeTab === "pages" && (
          <div style={{ color: colors.textMute }}>Pages panel coming soon</div>
        )}
      </div>
    </aside>
  );
}
