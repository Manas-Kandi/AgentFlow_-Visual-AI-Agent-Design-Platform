"use client";
import React, { useState } from "react";
import { CanvasNode, Connection } from "@/types";
import CanvasHeader from "./CanvasHeader";
import CanvasAdapter from "./adapters/CanvasAdapter";
import CanvasSidebar from "./CanvasSidebar";
import PropertiesPanel from "./PropertiesPanel";
import TesterDock from "./TesterDock";

interface Props {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNode: CanvasNode | null;
  onNodeSelect: (node: CanvasNode | null) => void;
  onNodeUpdate: (node: CanvasNode) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onCreateConnection: (connectionData: Connection) => Promise<void>;
  onNodeDelete: (nodeId: string) => void;
  onNodeCreate: (node: CanvasNode) => void;
  startNodeId: string | null;
  onStartNodeChange: (id: string | null) => void;
  nodeStatuses?: Record<string, "running" | "success" | "error">;
  pulsingConnectionIds?: string[];
  onTestFlow?: () => void;
  isTesting?: boolean;
  currentProject?: any;
}

export default function Canvas(props: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testerOpen, setTesterOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <CanvasHeader
        projectTitle={props.currentProject?.name || "Untitled Project"}
        onTestFlow={props.onTestFlow}
        isTesting={props.isTesting}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CanvasSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNodeCreate={props.onNodeCreate}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <CanvasAdapter
            nodes={props.nodes}
            connections={props.connections}
            selectedNodeId={props.selectedNode?.id || null}
            onNodeSelect={props.onNodeSelect}
            onNodeUpdate={props.onNodeUpdate}
            onConnectionsChange={props.onConnectionsChange}
            onCreateConnection={props.onCreateConnection}
            startNodeId={props.startNodeId}
            onStartNodeChange={props.onStartNodeChange}
            onNodeDelete={props.onNodeDelete}
            onNodeCreate={props.onNodeCreate}
            nodeStatuses={props.nodeStatuses}
            pulsingConnectionIds={props.pulsingConnectionIds}
            zoom={1}
          />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          isOpen={!!props.selectedNode}
          node={props.selectedNode}
          onClose={() => props.onNodeSelect(null)}
          onUpdate={props.onNodeUpdate}
          onDelete={props.onNodeDelete}
        />

        {/* Tester Dock */}
        <TesterDock
          isOpen={testerOpen}
          onToggle={() => setTesterOpen(!testerOpen)}
          startNodeId={props.startNodeId}
          onStartNodeChange={props.onStartNodeChange}
          nodeStatuses={props.nodeStatuses}
          pulsingConnectionIds={props.pulsingConnectionIds}
          onTestFlow={props.onTestFlow}
          isTesting={props.isTesting}
        />
      </div>
    </div>
  );
}
