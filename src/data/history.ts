export interface GenerationItem {
  id: string;
  prompt: string;
  model: string;
  type: 'image' | 'video';
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
  resolution: string;
  cost: number;
  thumbnailColor: string;
}

export const generationHistory: GenerationItem[] = [
  {
    id: 'gen-001',
    prompt: 'A cyberpunk cityscape at sunset with neon lights reflecting on wet streets',
    model: 'Nano Banana Pro',
    type: 'image',
    status: 'completed',
    createdAt: '2 min ago',
    resolution: '2K',
    cost: 2,
    thumbnailColor: '#1a1a3e',
  },
  {
    id: 'gen-002',
    prompt: 'Portrait of a woman in futuristic fashion, studio lighting, editorial style',
    model: 'Higgsfield Soul 2.0',
    type: 'image',
    status: 'completed',
    createdAt: '15 min ago',
    resolution: '2K',
    cost: 2,
    thumbnailColor: '#2a1a2e',
  },
  {
    id: 'gen-003',
    prompt: 'Aerial drone shot of a mountain lake at golden hour',
    model: 'Kling 3.0',
    type: 'video',
    status: 'processing',
    createdAt: '30 min ago',
    resolution: '1080p',
    cost: 14,
    thumbnailColor: '#1a2a1e',
  },
  {
    id: 'gen-004',
    prompt: 'Abstract fluid art animation with iridescent colors',
    model: 'Seedream 5.0 lite',
    type: 'image',
    status: 'completed',
    createdAt: '1 hour ago',
    resolution: '2K',
    cost: 1,
    thumbnailColor: '#2e1a2a',
  },
  {
    id: 'gen-005',
    prompt: 'A cat wearing sunglasses on a beach, oil painting style',
    model: 'Nano Banana Pro',
    type: 'image',
    status: 'completed',
    createdAt: '2 hours ago',
    resolution: '2K',
    cost: 2,
    thumbnailColor: '#1e2a1a',
  },
  {
    id: 'gen-006',
    prompt: 'Timelapse of a flower blooming in a dark studio',
    model: 'Kling 2.1',
    type: 'video',
    status: 'failed',
    createdAt: '3 hours ago',
    resolution: '720p',
    cost: 10,
    thumbnailColor: '#2a1a1a',
  },
];
