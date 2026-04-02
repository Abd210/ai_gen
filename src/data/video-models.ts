export interface VideoModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  tags: ('NEW' | 'PREMIUM' | 'BUSINESS')[];
  durations: string[];
  aspectRatios: string[];
  resolutions: string[];
  soundSupport: boolean;
  costPerGeneration: number;
  generationTime: string;
  category: string;
}

export const videoModels: VideoModel[] = [
  {
    id: 'kling-3',
    name: 'Kling 3.0',
    provider: 'Kuaishou',
    description: 'Latest generation cinematic video model',
    icon: '🎬',
    tags: [],
    durations: ['5s', '8s', '10s'],
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['720p', '1080p'],
    soundSupport: true,
    costPerGeneration: 14,
    generationTime: '~120s',
    category: 'GENERAL',
  },
  {
    id: 'kling-2-1',
    name: 'Kling 2.1',
    provider: 'Kuaishou',
    description: 'Reliable professional video generation',
    icon: '🎬',
    tags: [],
    durations: ['5s', '10s'],
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['720p', '1080p'],
    soundSupport: true,
    costPerGeneration: 10,
    generationTime: '~90s',
    category: 'GENERAL',
  },
  {
    id: 'seedance-2',
    name: 'New Seedance 2.0',
    provider: 'ByteDance',
    description: 'Dance and motion-focused video generation',
    icon: '💃',
    tags: ['NEW', 'BUSINESS'],
    durations: ['5s', '8s'],
    aspectRatios: ['16:9', '9:16'],
    resolutions: ['720p', '1080p'],
    soundSupport: true,
    costPerGeneration: 12,
    generationTime: '~100s',
    category: 'DANCE',
  },
  {
    id: 'wan-2-1',
    name: 'Wan 2.1',
    provider: 'Alibaba',
    description: 'High-quality text-to-video generation',
    icon: '🌟',
    tags: [],
    durations: ['5s', '8s'],
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['720p'],
    soundSupport: false,
    costPerGeneration: 8,
    generationTime: '~80s',
    category: 'GENERAL',
  },
  {
    id: 'hailuo-minimax',
    name: 'Hailuo (MiniMax)',
    provider: 'MiniMax',
    description: 'Fast and efficient video generation',
    icon: '🌊',
    tags: [],
    durations: ['5s'],
    aspectRatios: ['16:9', '9:16'],
    resolutions: ['720p'],
    soundSupport: false,
    costPerGeneration: 6,
    generationTime: '~60s',
    category: 'GENERAL',
  },
  {
    id: 'pika-2-2',
    name: 'Pika 2.2',
    provider: 'Pika',
    description: 'Creative video effects and generation',
    icon: '⚡',
    tags: ['NEW'],
    durations: ['4s', '8s'],
    aspectRatios: ['16:9', '9:16', '1:1'],
    resolutions: ['720p', '1080p'],
    soundSupport: true,
    costPerGeneration: 10,
    generationTime: '~90s',
    category: 'CREATIVE',
  },
];
