import React, { useState } from "react";
import "./Canvas.css";
import { CanvasNode, Connection } from "@/types";
import TopBar from "./TopBar";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import BottomTester from "./BottomTester";
import CanvasStage from "./CanvasStage";

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
  projectTitle: string;
}

export default function CanvasShell(props: Props) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [testerOpen, setTesterOpen] = useState(false);

  return (
    <div className="af-canvas-shell">
      <TopBar
        projectTitle={props.projectTitle}
        onTestFlow={props.onTestFlow}
        isTesting={props.isTesting}
      />
      <div className="af-main relative">
        <LeftPanel
          isOpen={leftOpen}
          onToggle={() => setLeftOpen(!leftOpen)}
          onNodeCreate={props.onNodeCreate}
        />
        <CanvasStage
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
        />
        <RightPanel
          node={props.selectedNode}
          onUpdate={props.onNodeUpdate}
          nodes={props.nodes}
          connections={props.connections}
          onConnectionsChange={props.onConnectionsChange}
        />
        <BottomTester
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
