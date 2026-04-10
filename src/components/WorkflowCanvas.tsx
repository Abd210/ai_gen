'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, Type, ImageIcon, Film,
  Play, Trash2, ChevronDown, Sparkles, GitBranch,
  MousePointer2, Hand, Undo2, Redo2, Copy, Lock, Unlock,
  MoreHorizontal, X, Eye, EyeOff, Settings2, Zap,
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
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.5;
const PORT_HIT_RADIUS = 28;

// ─── Port Colors by Type ──────────────────────────────────
const portColors: Record<string, string> = {
  text: '#22c55e',
  image: '#3b82f6',
  video: '#a855f7',
};

const nodeGlowColors: Record<string, string> = {
  text: 'rgba(34, 197, 94, 0.08)',
  image: 'rgba(59, 130, 246, 0.08)',
  video: 'rgba(168, 85, 247, 0.08)',
};

const nodeAccentColors: Record<string, string> = {
  text: 'rgba(34, 197, 94, 0.4)',
  image: 'rgba(59, 130, 246, 0.4)',
  video: 'rgba(168, 85, 247, 0.4)',
};

// ─── Canvas Node Component ──────────────────────────────
function CanvasNode({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onUpdate,
  onDelete,
  onDuplicate,
  onPortMouseDown,
  zoom,
  connectionCount,
}: {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onPortMouseDown: (nodeId: string, portId: string, side: 'left' | 'right', e: React.MouseEvent) => void;
  zoom: number;
  connectionCount: number;
}) {
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const typeLabel = node.type === 'text' ? 'Text' : node.type === 'image' ? 'Image' : 'Video';
  const typeIcon = node.type === 'text' ? <Type size={11} /> : node.type === 'image' ? <ImageIcon size={11} /> : <Film size={11} />;
  const accentColor = portColors[node.type];

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

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
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
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowContextMenu(true);
      }}
    >
      <div
        className="rounded-xl border transition-all duration-200 overflow-visible relative"
        style={{
          borderColor: isSelected ? nodeAccentColors[node.type] : 'rgba(255,255,255,0.08)',
          boxShadow: isSelected
            ? `0 0 24px ${nodeGlowColors[node.type]}, 0 4px 16px rgba(0,0,0,0.3)`
            : '0 2px 8px rgba(0,0,0,0.2)',
          background: '#1a1a1e',
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full rounded-t-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: isSelected ? 1 : 0.4,
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
          <div className="flex items-center gap-1.5">
            <span style={{ color: accentColor }}>{typeIcon}</span>
            <span className="text-[11px] font-medium text-text-secondary">{typeLabel}</span>
            {connectionCount > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] text-text-tertiary">
                <GitBranch size={7} />{connectionCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {isRunning && (
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }} />
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setShowContextMenu(!showContextMenu); }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-tertiary hover:text-text-secondary transition-all"
            >
              <MoreHorizontal size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-tertiary hover:text-red-400 transition-all"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {/* Context Menu */}
        {showContextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowContextMenu(false); }} />
            <div
              className="absolute top-8 right-0 w-36 bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 overflow-hidden py-1 animate-scale-in"
              style={{ transform: `scale(${1 / zoom})`, transformOrigin: 'top right' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setShowContextMenu(false); onDuplicate(); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
              >
                <Copy size={10} /> Duplicate
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowContextMenu(false); handleRun(e); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all"
              >
                <Play size={10} /> Run Node
              </button>
              <div className="h-px bg-border mx-2 my-0.5" />
              <button
                onClick={(e) => { e.stopPropagation(); setShowContextMenu(false); onDelete(); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={10} /> Delete
              </button>
            </div>
          </>
        )}

        {/* Model / Settings chips row — only for image/video */}
        {(node.type === 'image' || node.type === 'video') && (
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/30 flex-wrap">
            {/* Model chip */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowModelMenu(!showModelMenu); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all"
                style={{
                  background: `${accentColor}15`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
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
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
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
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
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
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
              >
                {(node as VideoNodeData).duration}s
              </button>
            )}
          </div>
        )}

        {/* Preview area */}
        <div
          className="h-[120px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: isRunning
              ? `linear-gradient(135deg, ${accentColor}08 0%, transparent 50%)`
              : 'rgba(0,0,0,0.3)',
          }}
        >
          {isRunning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }} />
                <span className="text-[10px] font-medium" style={{ color: accentColor }}>Generating...</span>
              </div>
            </div>
          )}
          {!isRunning && node.type === 'text' ? (
            <textarea
              value={(node as TextNode).content}
              onChange={(e) => onUpdate({ content: e.target.value } as any)}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Type your text content..."
              className="w-full h-full bg-transparent text-[12px] text-text-primary px-3 py-2 outline-none resize-none placeholder:text-text-tertiary"
            />
          ) : !isRunning ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}12` }}>
                {node.type === 'image' ? <ImageIcon size={14} style={{ color: accentColor, opacity: 0.6 }} /> : <Film size={14} style={{ color: accentColor, opacity: 0.6 }} />}
              </div>
              <span className="text-[10px] text-text-tertiary">No {node.type === 'image' ? 'image' : 'video'} yet</span>
            </div>
          ) : null}
        </div>

        {/* Prompt input — for image/video */}
        {node.type !== 'text' && (
          <div className="px-3 py-2 border-t border-border/30 flex items-center gap-2">
            <input
              type="text"
              value={node.prompt}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder={`Describe the ${node.type}...`}
              className="flex-1 bg-transparent text-[11px] text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <button
              onClick={handleRun}
              className="p-1.5 rounded-lg transition-all shrink-0"
              style={{
                background: `${accentColor}18`,
                color: accentColor,
              }}
            >
              <Play size={10} fill="currentColor" />
            </button>
          </div>
        )}

        {/* Ports */}
        {node.ports.map((port) => {
          const portX = port.side === 'left' ? -6 : node.width + 6;
          const nodeHeight = node.type === 'text' ? 160 : 200;
          const portY = nodeHeight / 2;

          return (
            <div
              key={port.id}
              className="absolute cursor-crosshair z-30 group/port"
              style={{
                left: port.side === 'left' ? -6 : 'auto',
                right: port.side === 'right' ? -6 : 'auto',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 12,
                height: 12,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                onPortMouseDown(node.id, port.id, port.side, e);
              }}
            >
              <div
                className="w-3 h-3 rounded-full border-2 transition-all group-hover/port:scale-[1.8] group-hover/port:shadow-lg"
                style={{
                  borderColor: portColors[node.type],
                  background: isSelected ? portColors[node.type] : '#1a1a1e',
                  boxShadow: `0 0 6px ${portColors[node.type]}40`,
                }}
              />
              {/* Port hover tooltip */}
              <div
                className="absolute hidden group-hover/port:block text-[8px] font-medium px-1.5 py-0.5 rounded bg-bg-secondary border border-border whitespace-nowrap z-50"
                style={{
                  color: portColors[node.type],
                  ...(port.side === 'left'
                    ? { right: '100%', marginRight: 6, top: '50%', transform: 'translateY(-50%)' }
                    : { left: '100%', marginLeft: 6, top: '50%', transform: 'translateY(-50%)' }),
                }}
              >
                {port.side === 'left' ? 'Input' : 'Output'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Connection Line SVG ────────────────────────────────
function ConnectionLine({
  from,
  to,
  fromType,
  toType,
  isSelected,
  onDelete,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  fromType?: string;
  toType?: string;
  isSelected?: boolean;
  onDelete?: () => void;
}) {
  const dx = Math.abs(to.x - from.x) * 0.5;
  const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  const color = fromType ? portColors[fromType] || 'rgba(200,255,0,0.5)' : 'rgba(200,255,0,0.5)';
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g>
      {/* Invisible wider path for easier clicking */}
      {onDelete && (
        <path
          d={path}
          stroke="transparent"
          strokeWidth={16}
          fill="none"
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        />
      )}
      {/* Glow path */}
      <path
        d={path}
        stroke={color}
        strokeWidth={isSelected ? 4 : 2}
        fill="none"
        opacity={isSelected ? 0.3 : 0.1}
        filter="blur(3px)"
      />
      {/* Main path */}
      <path
        d={path}
        stroke={color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        fill="none"
        opacity={isSelected ? 0.8 : 0.5}
        strokeDasharray={isSelected ? undefined : '6 4'}
      />
      {/* Animated flow dots */}
      <circle r={2.5} fill={color} opacity={0.7}>
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
      {/* Delete button on hover */}
      {onDelete && isSelected && (
        <g
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <circle cx={midX} cy={midY} r={8} fill="#1a1a1e" stroke={color} strokeWidth={1} opacity={0.9} />
          <line x1={midX - 3} y1={midY - 3} x2={midX + 3} y2={midY + 3} stroke="#ff4444" strokeWidth={1.5} />
          <line x1={midX + 3} y1={midY - 3} x2={midX - 3} y2={midY + 3} stroke="#ff4444" strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
}

// ─── Drawing Connection Preview ─────────────────────────
function DrawingConnectionLine({
  from,
  to,
  type,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  type: string;
}) {
  const dx = Math.abs(to.x - from.x) * 0.5;
  const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  const color = portColors[type] || 'rgba(200,255,0,0.5)';

  return (
    <g>
      <path
        d={path}
        stroke={color}
        strokeWidth={2}
        fill="none"
        opacity={0.6}
        strokeDasharray="8 4"
      />
      <circle cx={to.x} cy={to.y} r={5} fill={color} opacity={0.3}>
        <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

// ─── Minimap ────────────────────────────────────────────
function Minimap({
  nodes,
  connections,
  pan,
  zoom,
  canvasWidth,
  canvasHeight,
  onPanTo,
}: {
  nodes: WorkflowNode[];
  connections: Connection[];
  pan: { x: number; y: number };
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onPanTo: (x: number, y: number) => void;
}) {
  const MAP_W = 160;
  const MAP_H = 100;

  // Calculate bounds
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 600 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + 200);
    });
    const pad = 100;
    return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
  }, [nodes]);

  const scaleX = MAP_W / (bounds.maxX - bounds.minX);
  const scaleY = MAP_H / (bounds.maxY - bounds.minY);
  const scale = Math.min(scaleX, scaleY);

  // Viewport rect in minimap
  const vpX = (-pan.x / zoom - bounds.minX) * scale;
  const vpY = (-pan.y / zoom - bounds.minY) * scale;
  const vpW = (canvasWidth / zoom) * scale;
  const vpH = (canvasHeight / zoom) * scale;

  return (
    <div className="absolute bottom-16 right-4 w-[160px] h-[100px] bg-[#111113]/90 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden z-30 shadow-lg">
      <svg width={MAP_W} height={MAP_H} className="w-full h-full">
        {/* Nodes */}
        {nodes.map((node) => {
          const nx = (node.x - bounds.minX) * scale;
          const ny = (node.y - bounds.minY) * scale;
          const nw = node.width * scale;
          const nh = 20 * scale;
          return (
            <rect
              key={node.id}
              x={nx} y={ny}
              width={Math.max(nw, 3)} height={Math.max(nh, 2)}
              rx={1}
              fill={portColors[node.type] || '#555'}
              opacity={0.6}
            />
          );
        })}
        {/* Connections */}
        {connections.map((conn) => {
          const fromNode = nodes.find(n => n.id === conn.fromNodeId);
          const toNode = nodes.find(n => n.id === conn.toNodeId);
          if (!fromNode || !toNode) return null;
          const fx = (fromNode.x + fromNode.width - bounds.minX) * scale;
          const fy = (fromNode.y + 100 - bounds.minY) * scale;
          const tx = (toNode.x - bounds.minX) * scale;
          const ty = (toNode.y + 100 - bounds.minY) * scale;
          return (
            <line
              key={conn.id}
              x1={fx} y1={fy} x2={tx} y2={ty}
              stroke="rgba(200,255,0,0.3)"
              strokeWidth={0.5}
            />
          );
        })}
        {/* Viewport */}
        <rect
          x={Math.max(0, vpX)} y={Math.max(0, vpY)}
          width={vpW} height={vpH}
          fill="rgba(200,255,0,0.05)"
          stroke="rgba(200,255,0,0.3)"
          strokeWidth={1}
          rx={2}
        />
      </svg>
    </div>
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
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ w: 1000, h: 600 });
  const [drawingConnection, setDrawingConnection] = useState<{
    fromNodeId: string;
    fromPortId: string;
    fromSide: 'left' | 'right';
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);

  // Track canvas size
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ w: width, h: height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ─── Handlers ────────────────────────
  const updateNodes = useCallback(
    (updater: (nodes: WorkflowNode[]) => WorkflowNode[]) => {
      onUpdate({ ...project, nodes: updater(project.nodes), updatedAt: new Date().toISOString() });
    },
    [project, onUpdate]
  );

  const addConnection = useCallback(
    (conn: Connection) => {
      const exists = project.connections.some(
        (c) => c.fromNodeId === conn.fromNodeId && c.toNodeId === conn.toNodeId
      );
      const selfConn = conn.fromNodeId === conn.toNodeId;
      if (!exists && !selfConn) {
        onUpdate({ ...project, connections: [...project.connections, conn] });
      }
    },
    [project, onUpdate]
  );

  const deleteConnection = useCallback(
    (id: string) => {
      onUpdate({
        ...project,
        connections: project.connections.filter((c) => c.id !== id),
      });
      if (selectedConnectionId === id) setSelectedConnectionId(null);
    },
    [project, selectedConnectionId, onUpdate]
  );

  const addNode = useCallback(
    (type: 'text' | 'image' | 'video') => {
      // Position nodes with proper offset based on existing nodes
      const offset = nodeIdCounter * 40;
      const centerX = (-pan.x + canvasSize.w / 2) / zoom - 130 + offset;
      const centerY = (-pan.y + canvasSize.h / 2) / zoom - 100 + offset;
      let node: WorkflowNode;
      if (type === 'text') node = createTextNode(centerX, centerY);
      else if (type === 'image') node = createImageNode(centerX, centerY);
      else node = createVideoNode(centerX, centerY);
      updateNodes((nodes) => [...nodes, node]);
      setSelectedNodeId(node.id);
      setNodeIdCounter((c) => c + 1);
    },
    [pan, zoom, updateNodes, nodeIdCounter, canvasSize]
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

  const duplicateNode = useCallback(
    (id: string) => {
      const original = project.nodes.find((n) => n.id === id);
      if (!original) return;
      let node: WorkflowNode;
      if (original.type === 'text') node = createTextNode(original.x + 40, original.y + 40);
      else if (original.type === 'image') node = createImageNode(original.x + 40, original.y + 40);
      else node = createVideoNode(original.x + 40, original.y + 40);
      // Copy content fields
      node.prompt = original.prompt;
      if (original.type === 'text' && node.type === 'text') {
        (node as TextNode).content = (original as TextNode).content;
      }
      if (original.type === 'image' && node.type === 'image') {
        const imgOrig = original as ImageNodeData;
        const imgNode = node as ImageNodeData;
        imgNode.model = imgOrig.model;
        imgNode.aspectRatio = imgOrig.aspectRatio;
        imgNode.quality = imgOrig.quality;
      }
      if (original.type === 'video' && node.type === 'video') {
        const vidOrig = original as VideoNodeData;
        const vidNode = node as VideoNodeData;
        vidNode.model = vidOrig.model;
        vidNode.aspectRatio = vidOrig.aspectRatio;
        vidNode.duration = vidOrig.duration;
      }
      updateNodes((nodes) => [...nodes, node]);
      setSelectedNodeId(node.id);
    },
    [project.nodes, updateNodes]
  );

  const updateNode = useCallback(
    (id: string, updates: Partial<WorkflowNode>) => {
      updateNodes((nodes) =>
        nodes.map((n) => (n.id === id ? { ...n, ...updates } as WorkflowNode : n))
      );
    },
    [updateNodes]
  );

  // Get connection count for a node
  const getConnectionCount = useCallback(
    (nodeId: string) => {
      return project.connections.filter(
        (c) => c.fromNodeId === nodeId || c.toNodeId === nodeId
      ).length;
    },
    [project.connections]
  );

  // ─── Node dragging ────────────────────
  const handleNodeDragStart = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      const node = project.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      setDraggingNodeId(nodeId);
      setDragOffset({
        x: (e.clientX - pan.x) / zoom - node.x,
        y: (e.clientY - pan.y) / zoom - node.y,
      });
    },
    [project.nodes, zoom, pan]
  );

  // ─── Canvas pan ───────────────────────
  // Nodes call e.stopPropagation(), so any mousedown reaching here is on empty canvas space.
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only primary button (left click)
      if (e.button !== 0) return;
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
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

  // ─── Get node center height ───────────
  const getNodeHeight = useCallback((node: WorkflowNode) => {
    if (node.type === 'text') return 160;
    return 220;
  }, []);

  // ─── Global mouse move/up ─────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingNodeId) {
        const newX = Math.round(((e.clientX - pan.x) / zoom - dragOffset.x) / GRID_SIZE) * GRID_SIZE;
        const newY = Math.round(((e.clientY - pan.y) / zoom - dragOffset.y) / GRID_SIZE) * GRID_SIZE;
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
      if (drawingConnection && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = (e.clientX - rect.left - pan.x) / zoom;
        const my = (e.clientY - rect.top - pan.y) / zoom;

        // Find target port - with wider hit radius
        for (const node of project.nodes) {
          if (node.id === drawingConnection.fromNodeId) continue;
          const nodeHeight = getNodeHeight(node);
          for (const port of node.ports) {
            const portX = port.side === 'left' ? node.x : node.x + node.width;
            const portY = node.y + nodeHeight / 2;
            const dist = Math.sqrt((mx - portX) ** 2 + (my - portY) ** 2);
            if (dist < PORT_HIT_RADIUS) {
              const conn: Connection = {
                id: `conn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
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
  }, [draggingNodeId, dragOffset, isPanning, panStart, drawingConnection, pan, zoom, project.nodes, updateNode, addConnection, getNodeHeight]);

  // ─── Keyboard shortcuts ───────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't delete if focusing an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
        if (selectedConnectionId) {
          deleteConnection(selectedConnectionId);
        }
      }
      // Duplicate with Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedNodeId) duplicateNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, selectedConnectionId, deleteNode, deleteConnection, duplicateNode]);

  // ─── Zoom via wheel ───────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Zoom toward mouse position
      const delta = e.deltaY * -0.001;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
      const scale = newZoom / zoom;

      setPan({
        x: mouseX - (mouseX - pan.x) * scale,
        y: mouseY - (mouseY - pan.y) * scale,
      });
      setZoom(newZoom);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoom, pan]);

  // ─── Get port position ────────────────
  const getPortPosition = useCallback(
    (nodeId: string, portId: string) => {
      const node = project.nodes.find((n) => n.id === nodeId);
      if (!node) return { x: 0, y: 0 };
      const port = node.ports.find((p) => p.id === portId);
      if (!port) return { x: 0, y: 0 };
      const nodeHeight = getNodeHeight(node);
      return {
        x: port.side === 'left' ? node.x : node.x + node.width,
        y: node.y + nodeHeight / 2,
      };
    },
    [project.nodes, getNodeHeight]
  );

  // Fit view
  const fitView = useCallback(() => {
    if (project.nodes.length === 0) {
      setZoom(0.85);
      setPan({ x: 0, y: 0 });
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    project.nodes.forEach((n) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + 200);
    });
    const pad = 80;
    const w = maxX - minX + pad * 2;
    const h = maxY - minY + pad * 2;
    const newZoom = Math.min(canvasSize.w / w, canvasSize.h / h, 1.2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setZoom(newZoom);
    setPan({
      x: canvasSize.w / 2 - centerX * newZoom,
      y: canvasSize.h / 2 - centerY * newZoom,
    });
  }, [project.nodes, canvasSize]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d0f] overflow-hidden relative">
      {/* Canvas viewport */}
      <div
        ref={canvasRef}
        className={`flex-1 relative overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Grid */}
        <div
          className="canvas-bg absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Center crosshair (very subtle) */}
        <div className="canvas-bg absolute inset-0 pointer-events-none">
          <div
            className="absolute w-px h-full opacity-[0.03]"
            style={{ left: `${pan.x}px`, background: 'white' }}
          />
          <div
            className="absolute w-full h-px opacity-[0.03]"
            style={{ top: `${pan.y}px`, background: 'white' }}
          />
        </div>

        {/* Transform layer */}
        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Connection lines */}
          <svg className="absolute top-0 left-0 w-[8000px] h-[8000px] pointer-events-none z-0" style={{ pointerEvents: 'visiblePainted' }}>
            {project.connections.map((conn) => {
              const from = getPortPosition(conn.fromNodeId, conn.fromPortId);
              const to = getPortPosition(conn.toNodeId, conn.toPortId);
              const fromNode = project.nodes.find(n => n.id === conn.fromNodeId);
              const toNode = project.nodes.find(n => n.id === conn.toNodeId);
              return (
                <ConnectionLine
                  key={conn.id}
                  from={from}
                  to={to}
                  fromType={fromNode?.type}
                  toType={toNode?.type}
                  isSelected={selectedConnectionId === conn.id}
                  onDelete={() => deleteConnection(conn.id)}
                />
              );
            })}
            {/* Drawing connection preview */}
            {drawingConnection && (() => {
              const fromNode = project.nodes.find((n) => n.id === drawingConnection.fromNodeId);
              if (!fromNode) return null;
              const fromPort = fromNode.ports.find((p) => p.id === drawingConnection.fromPortId);
              if (!fromPort) return null;
              const nodeHeight = getNodeHeight(fromNode);
              const from = {
                x: fromPort.side === 'left' ? fromNode.x : fromNode.x + fromNode.width,
                y: fromNode.y + nodeHeight / 2,
              };
              return (
                <DrawingConnectionLine
                  from={from}
                  to={{ x: drawingConnection.mouseX, y: drawingConnection.mouseY }}
                  type={fromNode.type}
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
              onSelect={() => { setSelectedNodeId(node.id); setSelectedConnectionId(null); }}
              onDragStart={(e) => handleNodeDragStart(node.id, e)}
              onUpdate={(updates) => updateNode(node.id, updates)}
              onDelete={() => deleteNode(node.id)}
              onDuplicate={() => duplicateNode(node.id)}
              onPortMouseDown={handlePortMouseDown}
              zoom={zoom}
              connectionCount={getConnectionCount(node.id)}
            />
          ))}
        </div>

        {/* Minimap */}
        {showMinimap && project.nodes.length > 0 && (
          <Minimap
            nodes={project.nodes}
            connections={project.connections}
            pan={pan}
            zoom={zoom}
            canvasWidth={canvasSize.w}
            canvasHeight={canvasSize.h}
            onPanTo={(x, y) => setPan({ x, y })}
          />
        )}

        {/* Empty state */}
        {project.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-surface/50 border border-border/50 flex items-center justify-center">
                <GitBranch size={24} className="text-text-tertiary" />
              </div>
              <div className="text-center">
                <h3 className="text-[14px] font-semibold text-text-secondary mb-1">Empty Canvas</h3>
                <p className="text-[11px] text-text-tertiary max-w-xs">
                  Add nodes using the toolbar below. Connect them by dragging from output ports to input ports.
                </p>
              </div>
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => addNode('text')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
                >
                  <Type size={12} /> Text
                </button>
                <button
                  onClick={() => addNode('image')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                >
                  <ImageIcon size={12} /> Image
                </button>
                <button
                  onClick={() => addNode('video')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                >
                  <Film size={12} /> Video
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-[#111113] shrink-0">
        {/* Left: Node info */}
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary min-w-[140px]">
          <span>{project.nodes.length} node{project.nodes.length !== 1 ? 's' : ''}</span>
          <span className="text-border">•</span>
          <span>{project.connections.length} connection{project.connections.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Center: Main tools */}
        <div className="flex items-center gap-1 bg-bg-tertiary/80 border border-border/60 rounded-xl px-2 py-1.5">
          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.1))}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] text-text-tertiary w-10 text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.1))}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={fitView}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
            title="Fit view"
          >
            <Maximize2 size={14} />
          </button>

          {/* Separator */}
          <div className="w-px h-5 bg-border mx-1.5" />

          {/* Add node buttons */}
          <button
            onClick={() => addNode('text')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-green-400/80 hover:text-green-400 hover:bg-green-500/10 transition-all"
            title="Add text node"
          >
            <Type size={13} />
            <span>Text</span>
          </button>
          <button
            onClick={() => addNode('image')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-blue-400/80 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
            title="Add image node"
          >
            <ImageIcon size={13} />
            <span>Image</span>
          </button>
          <button
            onClick={() => addNode('video')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-purple-400/80 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
            title="Add video node"
          >
            <Film size={13} />
            <span>Video</span>
          </button>
        </div>

        {/* Right: Minimap toggle + Run */}
        <div className="flex items-center gap-2 min-w-[140px] justify-end">
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`p-1.5 rounded-lg text-[11px] transition-all ${
              showMinimap
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-text-tertiary hover:text-text-secondary bg-surface border border-border'
            }`}
            title="Toggle minimap"
          >
            <Eye size={13} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 text-accent border border-accent/25 text-[11px] font-medium hover:bg-accent/25 transition-all"
            title="Run workflow"
          >
            <Zap size={12} />
            Run All
          </button>
        </div>
      </div>
    </div>
  );
}
