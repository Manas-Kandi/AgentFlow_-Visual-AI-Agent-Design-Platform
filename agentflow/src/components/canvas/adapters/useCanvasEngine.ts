"use client";
import { useState, useCallback, useEffect } from "react";
import { CanvasNode, Connection } from "@/types";

export function useCanvasEngine() {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [startNodeId, setStartNodeId] = useState<string | null>(null);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, "running" | "success" | "error">>({});
  const [pulsingConnectionIds, setPulsingConnectionIds] = useState<string[]>([]);

  // Node operations
  const handleNodeUpdate = useCallback((updatedNode: CanvasNode) => {
    setNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => 
      c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
    ));
    setSelectedNodeIds(prev => prev.filter(id => id !== nodeId));
    if (startNodeId === nodeId) {
      setStartNodeId(null);
    }
  }, [startNodeId]);

  const handleNodeCreate = useCallback((node: CanvasNode) => {
    setNodes(prev => [...prev, node]);
  }, []);

  // Connection operations
  const handleConnectionsChange = useCallback((newConnections: Connection[]) => {
    setConnections(newConnections);
  }, []);

  const handleCreateConnection = useCallback(async (connectionData: Connection) => {
    const newConnection: Connection = {
      ...connectionData,
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setConnections(prev => [...prev, newConnection]);
    return newConnection;
  }, []);

  // Selection operations
  const handleNodeSelect = useCallback((node: CanvasNode | null) => {
    if (node) {
      setSelectedNodeIds([node.id]);
    } else {
      setSelectedNodeIds([]);
    }
  }, []);

  // Start node operations
  const handleStartNodeChange = useCallback((nodeId: string | null) => {
    setStartNodeId(nodeId);
  }, []);

  // Status operations
  const setNodeStatus = useCallback((nodeId: string, status: "running" | "success" | "error") => {
    setNodeStatuses(prev => ({ ...prev, [nodeId]: status }));
  }, []);

  const setConnectionPulse = useCallback((connectionId: string, pulse: boolean) => {
    setPulsingConnectionIds(prev => 
      pulse 
        ? [...prev, connectionId]
        : prev.filter(id => id !== connectionId)
    );
  }, []);

  // Batch operations
  const handleBatchUpdate = useCallback((updates: {
    nodes?: CanvasNode[];
    connections?: Connection[];
    startNodeId?: string | null;
  }) => {
    if (updates.nodes) setNodes(updates.nodes);
    if (updates.connections) setConnections(updates.connections);
    if (updates.startNodeId !== undefined) setStartNodeId(updates.startNodeId);
  }, []);

  return {
    nodes,
    connections,
    selectedNodeIds,
    startNodeId,
    nodeStatuses,
    pulsingConnectionIds,
    setNodes,
    setConnections,
    setSelectedNodeIds,
    setStartNodeId,
    handleNodeUpdate,
    handleNodeDelete,
    handleNodeCreate,
    handleConnectionsChange,
    handleCreateConnection,
    handleNodeSelect,
    handleStartNodeChange,
    setNodeStatus,
    setConnectionPulse,
    handleBatchUpdate,
  };
}
