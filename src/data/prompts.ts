export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  isFavorite: boolean;
}

export const savedPrompts: SavedPrompt[] = [
  {
    id: 'sp-001',
    title: 'Cyberpunk Portrait',
    prompt: 'Portrait of a person in cyberpunk style, neon lights, rain, reflections, volumetric lighting, cinematic, 8k',
    tags: ['portrait', 'cyberpunk', 'cinematic'],
    usageCount: 24,
    createdAt: '2 days ago',
    isFavorite: true,
  },
  {
    id: 'sp-002',
    title: 'Product Flatlay',
    prompt: 'Professional product photography, white marble surface, soft natural light, minimalist composition, luxury aesthetic',
    tags: ['product', 'photography', 'minimal'],
    usageCount: 18,
    createdAt: '5 days ago',
    isFavorite: true,
  },
  {
    id: 'sp-003',
    title: 'Fantasy Landscape',
    prompt: 'Epic fantasy landscape, floating islands, waterfalls, magical atmosphere, golden light, matte painting style',
    tags: ['landscape', 'fantasy', 'art'],
    usageCount: 12,
    createdAt: '1 week ago',
    isFavorite: false,
  },
  {
    id: 'sp-004',
    title: 'Anime Character',
    prompt: 'Beautiful anime character, detailed eyes, flowing hair, cherry blossom background, soft pastel colors, studio ghibli inspired',
    tags: ['anime', 'character', 'illustration'],
    usageCount: 31,
    createdAt: '1 week ago',
    isFavorite: true,
  },
  {
    id: 'sp-005',
    title: 'Architecture Interior',
    prompt: 'Modern luxury penthouse interior, floor to ceiling windows, city skyline view, warm lighting, minimal furniture, architectural photography',
    tags: ['architecture', 'interior', 'luxury'],
    usageCount: 8,
    createdAt: '2 weeks ago',
    isFavorite: false,
  },
  {
    id: 'sp-006',
    title: 'Street Photography',
    prompt: 'Moody street photography, rain soaked Tokyo alley, neon signs, lone figure with umbrella, film grain, cinematic mood',
    tags: ['street', 'photography', 'moody'],
    usageCount: 15,
    createdAt: '2 weeks ago',
    isFavorite: false,
  },
];
