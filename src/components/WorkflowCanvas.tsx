'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, Type, ImageIcon, Film,
  Play, Trash2, ChevronDown, Sparkles,
} from 'lucide-react';
import {
  WorkflowNode, Connection, WorkflowProject,
  createTextNode, createImageNode, createVideoNode,
  ImageNodeData, VideoNodeData, TextNode,
} from '@/data/workflow-projects';
import { imageModels } from '@/data/models';
import { videoModels } from '@/data/video-models';

// ─── Constants ────────────────────────────────────────────
const GRID_SIZE = 20;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;

// ─── Canvas Node Component ──────────────────────────────
function CanvasNode({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onUpdate,
  onDelete,
  onPortMouseDown,
  zoom,
}: {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
  onDelete: () => void;
  onPortMouseDown: (nodeId: string, portId: string, side: 'left' | 'right', e: React.MouseEvent) => void;
  zoom: number;
}) {
  const [showModelMenu, setShowModelMenu] = useState(false);

  const typeLabel = node.type === 'text' ? 'Text' : node.type === 'image' ? 'Image' : 'Video';
  const typeIcon = node.type === 'text' ? <Type size={12} /> : node.type === 'image' ? <ImageIcon size={12} /> : <Film size={12} />;

  const handleModelChange = (modelId: string) => {
    if (node.type === 'image') {
      const model = imageModels.find((m) => m.id === modelId);
      if (model) onUpdate({ model, quality: model.defaultQuality } as Partial<ImageNodeData>);
    } else if (node.type === 'video') {
      const model = videoModels.find((m) => m.id === modelId);
      if (model) onUpdate({ model, duration: model.defaultDuration } as Partial<VideoNodeData>);
    }
    setShowModelMenu(false);
  };

  return (
    <div
      className={`absolute group select-none ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
        onDragStart(e);
      }}
    >
      <div
        className={`
          rounded-xl border transition-all duration-150 overflow-visible
          ${isSelected
            ? 'border-accent/50 shadow-[0_0_20px_rgba(200,255,0,0.1)]'
            : 'border-border/60 hover:border-border'
          }
          bg-[#1a1a1e]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="text-text-tertiary">{typeIcon}</span>
            <span className="text-[11px] font-medium text-text-secondary">{typeLabel}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-tertiary hover:text-red-400 transition-all"
          >
            <Trash2 size={11} />
          </button>
        </div>

        {/* Model / Settings chips row — only for image/video */}
        {(node.type === 'image' || node.type === 'video') && (
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/40 flex-wrap">
            {/* Model chip */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowModelMenu(!showModelMenu); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
              >
                <span>{node.type === 'image' ? (node as ImageNodeData).model.icon : (node as VideoNodeData).model.icon}</span>
                <span>{node.type === 'image' ? (node as ImageNodeData).model.name : (node as VideoNodeData).model.name}</span>
                <ChevronDown size={8} />
              </button>

              {showModelMenu && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setShowModelMenu(false)} />
                  <div
                    className="absolute top-full left-0 mt-1 w-[200px] max-h-[240px] bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 overflow-y-auto py-1"
                    style={{ transform: `scale(${1 / zoom})`, transformOrigin: 'top left' }}
                  >
                    {(node.type === 'image' ? imageModels : videoModels).map((m) => (
                      <button
                        key={m.id}
                        onClick={(e) => { e.stopPropagation(); handleModelChange(m.id); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-[11px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
                      >
                        <span>{m.icon}</span>
                        <span className="flex-1">{m.name}</span>
                        <span className="text-[9px] text-accent flex items-center gap-0.5">
                          <Sparkles size={7} />{(m as any).costPerImage ?? (m as any).costPerGeneration}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Aspect ratio chip */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const ratios = node.type === 'image'
                  ? (node as ImageNodeData).model.aspectRatios
                  : (node as VideoNodeData).model.aspectRatios;
                const current = node.type === 'image'
                  ? (node as ImageNodeData).aspectRatio
                  : (node as VideoNodeData).aspectRatio;
                const idx = ratios.indexOf(current);
                const next = ratios[(idx + 1) % ratios.length];
                onUpdate({ aspectRatio: next } as any);
              }}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary transition-all"
            >
              {node.type === 'image' ? (node as ImageNodeData).aspectRatio : (node as VideoNodeData).aspectRatio}
            </button>

            {/* Quality / Duration chip */}
            {node.type === 'image' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const opts = (node as ImageNodeData).model.qualityOptions;
                  const current = (node as ImageNodeData).quality;
                  const idx = opts.findIndex((o) => o.label === current);
                  const next = opts[(idx + 1) % opts.length];
                  onUpdate({ quality: next.label } as any);
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary transition-all"
              >
                {(node as ImageNodeData).quality}
              </button>
            )}
            {node.type === 'video' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const m = (node as VideoNodeData).model;
                  const current = (node as VideoNodeData).duration;
                  const next = current + m.durationStep;
                  onUpdate({ duration: next > m.durationRange[1] ? m.durationRange[0] : next } as any);
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary transition-all"
              >
                {(node as VideoNodeData).duration}s
              </button>
            )}
          </div>
        )}

        {/* Preview area */}
        <div className="h-[120px] bg-black/30 flex items-center justify-center relative">
          {node.type === 'text' ? (
            <textarea
              value={(node as TextNode).content}
              onChange={(e) => onUpdate({ content: e.target.value } as any)}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Type your text content..."
              className="w-full h-full bg-transparent text-[12px] text-text-primary px-3 py-2 outline-none resize-none placeholder:text-text-tertiary"
            />
          ) : (
            <span className="text-[11px] text-text-tertiary">No {node.type === 'image' ? 'image' : 'video'} yet</span>
          )}
        </div>

        {/* Prompt input — for image/video */}
        {node.type !== 'text' && (
          <div className="px-3 py-2 border-t border-border/40 flex items-center gap-2">
            <input
              type="text"
              value={node.prompt}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder={`Describe the ${node.type}...`}
              className="flex-1 bg-transparent text-[11px] text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <button className="p-1 rounded-md bg-accent/20 text-accent hover:bg-accent/30 transition-all shrink-0">
              <Play size={10} fill="currentColor" />
            </button>
          </div>
        )}

        {/* Ports */}
        {node.ports.map((port) => (
          <div
            key={port.id}
            className={`
              absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 cursor-crosshair z-30
              transition-all hover:scale-150
              ${port.side === 'left' ? '-left-1.5' : '-right-1.5'}
              border-text-tertiary bg-bg-secondary hover:border-accent hover:bg-accent
            `}
            onMouseDown={(e) => {
              e.stopPropagation();
              onPortMouseDown(node.id, port.id, port.side, e);
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Connection Line SVG ────────────────────────────────
function ConnectionLine({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const dx = Math.abs(to.x - from.x) * 0.5;
  const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  return (
    <path
      d={path}
      stroke="rgba(200,255,0,0.3)"
      strokeWidth={2}
      fill="none"
      strokeDasharray="6 4"
    />
  );
}

// ─── Main Canvas ────────────────────────────────────────
export default function WorkflowCanvas({
  project,
  onUpdate,
}: {
  project: WorkflowProject;
  onUpdate: (project: WorkflowProject) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawingConnection, setDrawingConnection] = useState<{
    fromNodeId: string;
    fromPortId: string;
    fromSide: 'left' | 'right';
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // ─── Handlers ────────────────────────
  const updateNodes = useCallback(
    (updater: (nodes: WorkflowNode[]) => WorkflowNode[]) => {
      onUpdate({ ...project, nodes: updater(project.nodes), updatedAt: new Date().toISOString() });
    },
    [project, onUpdate]
  );

  const addConnection = useCallback(
    (conn: Connection) => {
      // Prevent duplicate
      const exists = project.connections.some(
        (c) => c.fromNodeId === conn.fromNodeId && c.toNodeId === conn.toNodeId
      );
      if (!exists) {
        onUpdate({ ...project, connections: [...project.connections, conn] });
      }
    },
    [project, onUpdate]
  );

  const addNode = useCallback(
    (type: 'text' | 'image' | 'video') => {
      const centerX = (-pan.x + 400) / zoom;
      const centerY = (-pan.y + 300) / zoom;
      let node: WorkflowNode;
      if (type === 'text') node = createTextNode(centerX, centerY);
      else if (type === 'image') node = createImageNode(centerX, centerY);
      else node = createVideoNode(centerX, centerY);
      updateNodes((nodes) => [...nodes, node]);
      setSelectedNodeId(node.id);
    },
    [pan, zoom, updateNodes]
  );

  const deleteNode = useCallback(
    (id: string) => {
      onUpdate({
        ...project,
        nodes: project.nodes.filter((n) => n.id !== id),
        connections: project.connections.filter((c) => c.fromNodeId !== id && c.toNodeId !== id),
      });
      if (selectedNodeId === id) setSelectedNodeId(null);
    },
    [project, selectedNodeId, onUpdate]
  );

  const updateNode = useCallback(
    (id: string, updates: Partial<WorkflowNode>) => {
      updateNodes((nodes) =>
        nodes.map((n) => (n.id === id ? { ...n, ...updates } as WorkflowNode : n))
      );
    },
    [updateNodes]
  );

  // ─── Node dragging ────────────────────
  const handleNodeDragStart = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      const node = project.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      setDraggingNodeId(nodeId);
      setDragOffset({
        x: e.clientX / zoom - node.x,
        y: e.clientY / zoom - node.y,
      });
    },
    [project.nodes, zoom]
  );

  // ─── Canvas pan ───────────────────────
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
        setSelectedNodeId(null);
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    },
    [pan]
  );

  // ─── Port connection ─────────────────
  const handlePortMouseDown = useCallback(
    (nodeId: string, portId: string, side: 'left' | 'right', e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDrawingConnection({
        fromNodeId: nodeId,
        fromPortId: portId,
        fromSide: side,
        mouseX: (e.clientX - rect.left - pan.x) / zoom,
        mouseY: (e.clientY - rect.top - pan.y) / zoom,
      });
    },
    [pan, zoom]
  );

  // ─── Global mouse move/up ─────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingNodeId) {
        const newX = Math.round((e.clientX / zoom - dragOffset.x) / GRID_SIZE) * GRID_SIZE;
        const newY = Math.round((e.clientY / zoom - dragOffset.y) / GRID_SIZE) * GRID_SIZE;
        updateNode(draggingNodeId, { x: newX, y: newY });
      }
      if (isPanning) {
        setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      }
      if (drawingConnection && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDrawingConnection((prev) =>
          prev
            ? {
                ...prev,
                mouseX: (e.clientX - rect.left - pan.x) / zoom,
                mouseY: (e.clientY - rect.top - pan.y) / zoom,
              }
            : null
        );
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // If we were drawing a connection, check if we're over a port
      if (drawingConnection && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = (e.clientX - rect.left - pan.x) / zoom;
        const my = (e.clientY - rect.top - pan.y) / zoom;

        // Find target port
        for (const node of project.nodes) {
          if (node.id === drawingConnection.fromNodeId) continue;
          for (const port of node.ports) {
            const portX = port.side === 'left' ? node.x : node.x + node.width;
            const portY = node.y + 80; // approximate halfway
            if (Math.abs(mx - portX) < 20 && Math.abs(my - portY) < 30) {
              // Create connection
              const conn: Connection = {
                id: `conn_${Date.now()}`,
                fromNodeId: drawingConnection.fromSide === 'right' ? drawingConnection.fromNodeId : node.id,
                fromPortId: drawingConnection.fromSide === 'right' ? drawingConnection.fromPortId : port.id,
                toNodeId: drawingConnection.fromSide === 'right' ? node.id : drawingConnection.fromNodeId,
                toPortId: drawingConnection.fromSide === 'right' ? port.id : drawingConnection.fromPortId,
              };
              addConnection(conn);
              break;
            }
          }
        }
        setDrawingConnection(null);
      }
      setDraggingNodeId(null);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNodeId, dragOffset, isPanning, panStart, drawingConnection, pan, zoom, project.nodes, updateNode, addConnection]);

  // ─── Zoom via wheel ───────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  // ─── Get port position ────────────────
  const getPortPosition = useCallback(
    (nodeId: string, portId: string) => {
      const node = project.nodes.find((n) => n.id === nodeId);
      if (!node) return { x: 0, y: 0 };
      const port = node.ports.find((p) => p.id === portId);
      if (!port) return { x: 0, y: 0 };
      return {
        x: port.side === 'left' ? node.x : node.x + node.width,
        y: node.y + 80,
      };
    },
    [project.nodes]
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d0f] overflow-hidden">
      {/* Canvas viewport */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Grid */}
        <div
          className="canvas-bg absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Transform layer */}
        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Connection lines */}
          <svg className="absolute top-0 left-0 w-[8000px] h-[8000px] pointer-events-none z-0">
            {project.connections.map((conn) => {
              const from = getPortPosition(conn.fromNodeId, conn.fromPortId);
              const to = getPortPosition(conn.toNodeId, conn.toPortId);
              return <ConnectionLine key={conn.id} from={from} to={to} />;
            })}
            {/* Drawing connection preview */}
            {drawingConnection && (() => {
              const fromNode = project.nodes.find((n) => n.id === drawingConnection.fromNodeId);
              if (!fromNode) return null;
              const fromPort = fromNode.ports.find((p) => p.id === drawingConnection.fromPortId);
              if (!fromPort) return null;
              const from = {
                x: fromPort.side === 'left' ? fromNode.x : fromNode.x + fromNode.width,
                y: fromNode.y + 80,
              };
              return (
                <ConnectionLine
                  from={from}
                  to={{ x: drawingConnection.mouseX, y: drawingConnection.mouseY }}
                />
              );
            })()}
          </svg>

          {/* Nodes */}
          {project.nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => setSelectedNodeId(node.id)}
              onDragStart={(e) => handleNodeDragStart(node.id, e)}
              onUpdate={(updates) => updateNode(node.id, updates)}
              onDelete={() => deleteNode(node.id)}
              onPortMouseDown={handlePortMouseDown}
              zoom={zoom}
            />
          ))}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-center py-3 px-4 border-t border-border/40 bg-[#111113]">
        <div className="flex items-center gap-1 bg-bg-tertiary border border-border rounded-xl px-2 py-1.5">
          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.1))}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.1))}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => { setZoom(0.85); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <Maximize2 size={14} />
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-border mx-1.5" />

          {/* Add node buttons */}
          <button
            onClick={() => addNode('text')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <Type size={13} />
            <span>Text</span>
          </button>
          <button
            onClick={() => addNode('image')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <ImageIcon size={13} />
            <span>Image</span>
          </button>
          <button
            onClick={() => addNode('video')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <Film size={13} />
            <span>Video</span>
          </button>
        </div>
      </div>
    </div>
  );
}
