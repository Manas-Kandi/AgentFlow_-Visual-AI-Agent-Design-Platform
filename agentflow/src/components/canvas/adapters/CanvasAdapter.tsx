"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { CanvasNode, Connection } from "@/types";
import { useCanvasEngine } from "./useCanvasEngine";
import { CanvasEngine } from "./CanvasEngine";

interface CanvasAdapterProps {
  nodes: CanvasNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  onNodeSelect: (node: CanvasNode | null) => void;
  onNodeUpdate: (node: CanvasNode) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onCreateConnection: (connectionData: Connection) => Promise<void>;
  startNodeId: string | null;
  onStartNodeChange: (id: string | null) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeCreate: (node: CanvasNode) => void;
  nodeStatuses?: Record<string, "running" | "success" | "error">;
  pulsingConnectionIds?: string[];
  zoom: number;
}

export default function CanvasAdapter({
  nodes,
  connections,
  selectedNodeId,
  onNodeSelect,
  onNodeUpdate,
  onConnectionsChange,
  onCreateConnection,
  startNodeId,
  onStartNodeChange,
  onNodeDelete,
  onNodeCreate,
  nodeStatuses,
  pulsingConnectionIds,
  zoom,
}: CanvasAdapterProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewportTransform, setViewportTransform] = useState({
    x: 0,
    y: 0,
    scale: zoom,
  });
  
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragConnection, setDragConnection] = useState<{
    from: { nodeId: string; outputId: string; pos: { x: number; y: number } };
    currentPos: { x: number; y: number };
  } | null>(null);

  // Sync selectedNodeId prop with internal state
  useEffect(() => {
    if (selectedNodeId) {
      setSelectedNodeIds([selectedNodeId]);
    } else {
      setSelectedNodeIds([]);
    }
  }, [selectedNodeId]);

  // Sync zoom prop with viewport transform
  useEffect(() => {
    setViewportTransform(prev => ({ ...prev, scale: zoom }));
  }, [zoom]);

  // Transform utilities
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - viewportTransform.x) / viewportTransform.scale,
      y: (screenY - viewportTransform.y) / viewportTransform.scale,
    };
  }, [viewportTransform]);

  const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
    return {
      x: canvasX * viewportTransform.scale + viewportTransform.x,
      y: canvasY * viewportTransform.scale + viewportTransform.y,
    };
  }, [viewportTransform]);

  const getPortPosition = useCallback((
    nodeId: string,
    portId: string,
    isInput: boolean,
    node: CanvasNode
  ) => {
    const port = isInput
      ? node.inputs?.find((p) => p.id === portId)
      : node.outputs?.find((p) => p.id === portId);

    if (!port) return null;

    const portIndex = isInput
      ? node.inputs?.findIndex((p) => p.id === portId) ?? 0
      : node.outputs?.findIndex((p) => p.id === portId) ?? 0;

    const totalPorts = isInput
      ? node.inputs?.length ?? 1
      : node.outputs?.length ?? 1;

    const spacing = 40;
    const offsetY = (portIndex + 1) * (200 / (totalPorts + 1));

    return {
      x: node.position.x + (isInput ? 0 : 200),
      y: node.position.y + offsetY,
    };
  }, []);

  // Event handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewportTransform.x, y: e.clientY - viewportTransform.y });
      return;
    }

    if (e.button === 0) {
      onNodeSelect(null);
      setSelectedNodeIds([]);
    }
  }, [viewportTransform, onNodeSelect]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setViewportTransform(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
    }

    if (dragConnection) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setDragConnection(prev => prev ? { ...prev, currentPos: canvasPos } : null);
    }

    if (isDragging && draggedNode) {
      const canvasPos = screenToCanvas(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      const node = nodes.find(n => n.id === draggedNode);
      if (node) {
        onNodeUpdate({ ...node, position: canvasPos });
      }
    }
  }, [isPanning, panStart, dragConnection, isDragging, draggedNode, screenToCanvas, nodes, onNodeUpdate]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDragging(false);
    setDraggedNode(null);
    setDragConnection(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, viewportTransform.scale * delta));
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const worldX = (mouseX - viewportTransform.x) / viewportTransform.scale;
    const worldY = (mouseY - viewportTransform.y) / viewportTransform.scale;
    
    setViewportTransform({
      x: mouseX - worldX * newScale,
      y: mouseY - worldY * newScale,
      scale: newScale,
    });
  }, [viewportTransform]);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setIsDragging(true);
    setDraggedNode(nodeId);
    
    const screenPos = canvasToScreen(node.position.x, node.position.y);
    setDragOffset({
      x: e.clientX - screenPos.x,
      y: e.clientY - screenPos.y,
    });

    onNodeSelect(node);
    setSelectedNodeIds([nodeId]);
  }, [nodes, canvasToScreen, onNodeSelect]);

  const handleNodeClick = useCallback((e: React.MouseEvent, node: CanvasNode) => {
    e.stopPropagation();
    onNodeSelect(node);
    setSelectedNodeIds([node.id]);
  }, [onNodeSelect]);

  const handlePortMouseDown = useCallback((
    e: React.MouseEvent,
    nodeId: string,
    portId: string,
    isInput: boolean
  ) => {
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const portPos = getPortPosition(nodeId, portId, isInput, node);
    if (portPos) {
      setDragConnection({
        from: { nodeId, outputId: portId, pos: portPos },
        currentPos: portPos,
      });
    }
  }, [nodes, getPortPosition]);

  const handlePortMouseUp = useCallback(async (
    e: React.MouseEvent,
    nodeId: string,
    portId: string,
    isInput: boolean
  ) => {
    e.stopPropagation();
    
    if (dragConnection && isInput) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        sourceNodeId: dragConnection.from.nodeId,
        sourceOutputId: dragConnection.from.outputId,
        targetNodeId: nodeId,
        targetInputId: portId,
      };
      
      await onCreateConnection(newConnection);
    }
    
    setDragConnection(null);
  }, [dragConnection, onCreateConnection]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    onNodeDelete(nodeId);
    setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
  }, [onNodeDelete]);

  const handleNodeCreate = useCallback((node: CanvasNode) => {
    onNodeCreate(node);
  }, [onNodeCreate]);

  const handleStartNodeChange = useCallback((nodeId: string | null) => {
    onStartNodeChange(nodeId);
  }, [onStartNodeChange]);

  return (
    <div
      ref={canvasRef}
      className="af-canvas-adapter"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'default',
        backgroundColor: '#0D0D0D',
        backgroundImage: `radial-gradient(circle at 1px 1px, #333 1px, transparent 1px)`,
        backgroundSize: `${20 * viewportTransform.scale}px ${20 * viewportTransform.scale}px`,
        backgroundPosition: `${viewportTransform.x}px ${viewportTransform.y}px`,
      }}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onWheel={handleWheel}
    >
      <CanvasEngine
        nodes={nodes}
        connections={connections}
        selectedNodeIds={selectedNodeIds}
        startNodeId={startNodeId}
        viewportTransform={viewportTransform}
        onNodeSelect={handleNodeClick}
        onNodeUpdate={onNodeUpdate}
        onNodeDelete={handleNodeDelete}
        onNodeCreate={handleNodeCreate}
        onStartNodeChange={handleStartNodeChange}
        onConnectionsChange={onConnectionsChange}
        onCreateConnection={handlePortMouseUp}
        nodeStatuses={nodeStatuses}
        pulsingConnectionIds={pulsingConnectionIds}
        screenToCanvas={screenToCanvas}
        canvasToScreen={canvasToScreen}
        getPortPosition={getPortPosition}
        dragConnection={dragConnection}
        isDragging={isDragging}
        draggedNode={draggedNode}
        onPortMouseDown={handlePortMouseDown}
      />
    </div>
  );
}
