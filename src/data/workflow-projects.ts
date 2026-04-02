import { imageModels, ImageModel } from './models';
import { videoModels, VideoModel } from './video-models';

// ─── Node Types ──────────────────────────────────────────
export type NodeType = 'text' | 'image' | 'video';

export interface Port {
  id: string;
  side: 'left' | 'right';
}

export interface WorkflowNodeBase {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  prompt: string;
  ports: Port[];
}

export interface TextNode extends WorkflowNodeBase {
  type: 'text';
  content: string;
}

export interface ImageNodeData extends WorkflowNodeBase {
  type: 'image';
  model: ImageModel;
  aspectRatio: string;
  quality: string;
  previewUrl: string | null;
}

export interface VideoNodeData extends WorkflowNodeBase {
  type: 'video';
  model: VideoModel;
  aspectRatio: string;
  duration: number;
  previewUrl: string | null;
}

export type WorkflowNode = TextNode | ImageNodeData | VideoNodeData;

// ─── Connection ──────────────────────────────────────────
export interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

// ─── Project ─────────────────────────────────────────────
export interface WorkflowProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  connections: Connection[];
}

// ─── Helpers ─────────────────────────────────────────────
let _counter = 0;
function uid() {
  _counter++;
  return `node_${Date.now()}_${_counter}`;
}

export function createTextNode(x: number, y: number): TextNode {
  const id = uid();
  return {
    id,
    type: 'text',
    x,
    y,
    width: 220,
    prompt: '',
    content: '',
    ports: [
      { id: `${id}_out`, side: 'right' },
    ],
  };
}

export function createImageNode(x: number, y: number): ImageNodeData {
  const id = uid();
  const model = imageModels.find((m) => m.id === 'nano-banana-pro') || imageModels[0];
  return {
    id,
    type: 'image',
    x,
    y,
    width: 260,
    prompt: '',
    model,
    aspectRatio: '1:1',
    quality: model.defaultQuality,
    previewUrl: null,
    ports: [
      { id: `${id}_in`, side: 'left' },
      { id: `${id}_out`, side: 'right' },
    ],
  };
}

export function createVideoNode(x: number, y: number): VideoNodeData {
  const id = uid();
  const model = videoModels[0];
  return {
    id,
    type: 'video',
    x,
    y,
    width: 260,
    prompt: '',
    model,
    aspectRatio: '16:9',
    duration: model.defaultDuration,
    previewUrl: null,
    ports: [
      { id: `${id}_in`, side: 'left' },
      { id: `${id}_out`, side: 'right' },
    ],
  };
}

// ─── Sample Projects ─────────────────────────────────────
export const sampleProjects: WorkflowProject[] = [];
