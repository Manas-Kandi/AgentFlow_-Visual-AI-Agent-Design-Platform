"use client";
import React, { useEffect, useRef } from "react";
import { CanvasNode, Connection } from "@/types";
import NodeCard from "./NodeCard";
import EdgeLink from "./EdgeLink";
import StartNodeBadge from "./StartNodeBadge";

export interface CanvasEngineProps {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNodeIds: string[];
  startNodeId: string | null;
  viewportTransform: { x: number; y: number; scale: number };
  onNodeSelect: (node: CanvasNode) => void;
  onNodeUpdate: (node: CanvasNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeCreate: (node: CanvasNode) => void;
  onStartNodeChange: (id: string | null) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onCreateConnection: (e: React.MouseEvent, nodeId: string, portId: string, isInput: boolean) => void;
  nodeStatuses?: Record<string, "running" | "success" | "error">;
  pulsingConnectionIds?: string[];
  screenToCanvas: (x: number, y: number) => { x: number; y: number };
  canvasToScreen: (x: number, y: number) => { x: number; y: number };
  getPortPosition: (nodeId: string, portId: string, isInput: boolean, node: CanvasNode) => { x: number; y: number } | null;
  dragConnection: any;
  isDragging: boolean;
  draggedNode: string | null;
  onPortMouseDown: (e: React.MouseEvent, nodeId: string, portId: string, isInput: boolean) => void;
}

export function CanvasEngine({
  nodes,
  connections,
  selectedNodeIds,
  startNodeId,
  viewportTransform,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeCreate,
  onStartNodeChange,
  onConnectionsChange,
  onCreateConnection,
  nodeStatuses,
  pulsingConnectionIds,
  screenToCanvas,
  canvasToScreen,
  getPortPosition,
  dragConnection,
  isDragging,
  draggedNode,
  onPortMouseDown,
}: CanvasEngineProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const transformStyle = {
    transform: `translate(${viewportTransform.x}px, ${viewportTransform.y}px) scale(${viewportTransform.scale})`,
    transformOrigin: "0 0",
  };

  return (
    <div
      ref={canvasRef}
      className="af-canvas-engine"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <div
        className="af-canvas-content"
        style={{
          ...transformStyle,
          pointerEvents: 'auto',
        }}
      >
        {/* Connections */}
        <svg
          className="af-connections"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {connections.map((connection) => {
            const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
            const targetNode = nodes.find(n => n.id === connection.targetNodeId);
            
            if (!sourceNode || !targetNode) return null;

            const sourcePos = getPortPosition(
              connection.sourceNodeId,
              connection.sourceOutputId,
              false,
              sourceNode
            );
            const targetPos = getPortPosition(
              connection.targetNodeId,
              connection.targetInputId,
              true,
              targetNode
            );

            if (!sourcePos || !targetPos) return null;

            return (
              <EdgeLink
                key={connection.id}
                edge={connection}
                sourcePos={sourcePos}
                targetPos={targetPos}
                isPulsing={pulsingConnectionIds?.includes(connection.id)}
              />
            );
          })}

          {/* Dragging connection line */}
          {dragConnection && (
            <line
              x1={dragConnection.from.pos.x}
              y1={dragConnection.from.pos.y}
              x2={dragConnection.currentPos.x}
              y2={dragConnection.currentPos.y}
              stroke="#666"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`af-node-wrapper ${selectedNodeIds.includes(node.id) ? 'selected' : ''} ${draggedNode === node.id ? 'dragging' : ''}`}
            style={{
              position: 'absolute',
              left: node.position.x,
              top: node.position.y,
              pointerEvents: 'auto',
            }}
          >
            <NodeCard
              node={node}
              isSelected={selectedNodeIds.includes(node.id)}
              isStartNode={startNodeId === node.id}
              status={nodeStatuses?.[node.id]}
              onSelect={() => onNodeSelect(node)}
              onUpdate={(updatedNode) => onNodeUpdate(updatedNode)}
              onDelete={() => onNodeDelete(node.id)}
              onStartNodeChange={() => onStartNodeChange(node.id)}
              onPortMouseDown={onPortMouseDown}
              onCreateConnection={onCreateConnection}
              getPortPosition={getPortPosition}
              screenToCanvas={screenToCanvas}
              canvasToScreen={canvasToScreen}
            />
            {startNodeId === node.id && <StartNodeBadge />}
          </div>
        ))}
      </div>
    </div>
  );
}
