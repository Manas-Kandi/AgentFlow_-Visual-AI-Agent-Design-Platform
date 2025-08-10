"use client";
import React, { useState } from "react";
import { CanvasNode } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Settings } from "lucide-react";

export interface NodeCardProps {
  node: CanvasNode;
  isSelected: boolean;
  isStartNode: boolean;
  status?: "running" | "success" | "error";
  onSelect: () => void;
  onUpdate: (node: CanvasNode) => void;
  onDelete: () => void;
  onStartNodeChange: () => void;
  onPortMouseDown: (e: React.MouseEvent, nodeId: string, portId: string, isInput: boolean) => void;
  onCreateConnection: (e: React.MouseEvent, nodeId: string, portId: string, isInput: boolean) => void;
  getPortPosition: (nodeId: string, portId: string, isInput: boolean, node: CanvasNode) => { x: number; y: number } | null;
  screenToCanvas: (x: number, y: number) => { x: number; y: number };
  canvasToScreen: (x: number, y: number) => { x: number; y: number };
}

export default function NodeCard({
  node,
  isSelected,
  isStartNode,
  status,
  onSelect,
  onUpdate,
  onDelete,
  onStartNodeChange,
  onPortMouseDown,
  onCreateConnection,
  getPortPosition,
}: NodeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeLabel, setNodeLabel] = useState(node.label);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    onUpdate({ ...node, label: nodeLabel });
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelBlur();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getNodeTypeColor = () => {
    switch (node.type) {
      case 'agent': return 'bg-purple-500';
      case 'tool': return 'bg-orange-500';
      case 'router': return 'bg-blue-500';
      case 'memory': return 'bg-green-500';
      case 'message': return 'bg-yellow-500';
      case 'conversation': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card
      className={`af-node-card ${isSelected ? 'selected' : ''} ${isStartNode ? 'start-node' : ''}`}
      onClick={onSelect}
      style={{
        width: 200,
        minHeight: 100,
        position: 'relative',
        border: isSelected ? '2px solid #3b82f6' : '1px solid #374151',
        background: '#1f2937',
        color: '#f9fafb',
        cursor: 'pointer',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Node Header */}
      <div className="af-node-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        background: getNodeTypeColor(),
        color: 'white',
      }}>
        <div className="af-node-type" style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {node.type.toUpperCase()}
        </div>
        <div className="af-node-controls" style={{ display: 'flex', gap: '4px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onStartNodeChange();
            }}
            style={{
              padding: '2px',
              height: 'auto',
              color: isStartNode ? '#fbbf24' : 'white',
            }}
          >
            <Play size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              padding: '2px',
              height: 'auto',
              color: '#ef4444',
            }}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      {status && (
        <div className="af-node-status" style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: getStatusColor(),
        }} />
      )}

      {/* Node Content */}
      <div className="af-node-content" style={{ padding: '8px' }}>
        {isEditing ? (
          <input
            type="text"
            value={nodeLabel}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              fontSize: '14px',
              outline: 'none',
            }}
            autoFocus
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            style={{
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'text',
            }}
          >
            {node.label}
          </div>
        )}

        {node.description && (
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '4px',
          }}>
            {node.description}
          </div>
        )}
      </div>

      {/* Input/Output Ports */}
      <div className="af-node-ports" style={{ position: 'relative' }}>
        {/* Input Ports */}
        <div className="af-input-ports" style={{
          position: 'absolute',
          left: '-4px',
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
          {node.inputs?.map((input, index) => (
            <div
              key={input.id}
              className="af-input-port"
              style={{
                width: '8px',
                height: '8px',
                background: '#6b7280',
                borderRadius: '50%',
                cursor: 'pointer',
                position: 'absolute',
                top: `${(index + 1) * (100 / (node.inputs?.length || 1))}%`,
                transform: 'translateY(-50%)',
              }}
              onMouseDown={(e) => onPortMouseDown(e, node.id, input.id, true)}
              onMouseUp={(e) => onCreateConnection(e, node.id, input.id, true)}
            />
          ))}
        </div>

        {/* Output Ports */}
        <div className="af-output-ports" style={{
          position: 'absolute',
          right: '-4px',
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
          {node.outputs?.map((output, index) => (
            <div
              key={output.id}
              className="af-output-port"
              style={{
                width: '8px',
                height: '8px',
                background: '#6b7280',
                borderRadius: '50%',
                cursor: 'pointer',
                position: 'absolute',
                top: `${(index + 1) * (100 / (node.outputs?.length || 1))}%`,
                transform: 'translateY(-50%)',
              }}
              onMouseDown={(e) => onPortMouseDown(e, node.id, output.id, false)}
              onMouseUp={(e) => onCreateConnection(e, node.id, output.id, false)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
