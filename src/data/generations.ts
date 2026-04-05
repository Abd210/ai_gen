export interface GeneratedImage {
  id: string;
  gradient: string; // CSS gradient as placeholder
  width: number;
  height: number;
}

export interface Generation {
  id: string;
  prompt: string;
  model: string;
  quality: string;
  aspectRatio: string;
  images: GeneratedImage[];
  createdAt: string;
  type: 'image' | 'video';
}

// Seeded hue-based gradient generator for variety
const gradients = [
  'linear-gradient(135deg, #ff6b6b, #ee5a24, #f0932b)',
  'linear-gradient(135deg, #6c5ce7, #a29bfe, #74b9ff)',
  'linear-gradient(135deg, #00b894, #55efc4, #81ecec)',
  'linear-gradient(135deg, #fdcb6e, #e17055, #d63031)',
  'linear-gradient(135deg, #0984e3, #74b9ff, #a29bfe)',
  'linear-gradient(135deg, #e84393, #fd79a8, #fab1a0)',
  'linear-gradient(135deg, #00cec9, #81ecec, #55efc4)',
  'linear-gradient(135deg, #2d3436, #636e72, #b2bec3)',
  'linear-gradient(135deg, #6c5ce7, #e84393, #fd79a8)',
  'linear-gradient(135deg, #00b894, #00cec9, #0984e3)',
  'linear-gradient(135deg, #fdcb6e, #f0932b, #ee5a24)',
  'linear-gradient(135deg, #d63031, #e17055, #fab1a0)',
  'linear-gradient(45deg, #667eea, #764ba2)',
  'linear-gradient(45deg, #f093fb, #f5576c)',
  'linear-gradient(45deg, #4facfe, #00f2fe)',
  'linear-gradient(45deg, #43e97b, #38f9d7)',
  'linear-gradient(45deg, #fa709a, #fee140)',
  'linear-gradient(45deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #ff9a9e, #fecfef, #fdfbfb)',
  'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
  'linear-gradient(135deg, #ffecd2, #fcb69f, #ff9a9e)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb, #e0c3fc)',
  'linear-gradient(135deg, #d4fc79, #96e6a1, #84fab0)',
  'linear-gradient(135deg, #fbc2eb, #a6c1ee, #c2e9fb)',
];

const aspectDimensions: Record<string, { w: number; h: number }> = {
  'Auto': { w: 1024, h: 1024 },
  '1:1': { w: 1024, h: 1024 },
  '4:5': { w: 1024, h: 1280 },
  '9:16': { w: 720, h: 1280 },
  '16:9': { w: 1792, h: 1024 },
  '4:3': { w: 1024, h: 768 },
  '3:4': { w: 768, h: 1024 },
};

export function getAspectDimensions(aspect: string) {
  return aspectDimensions[aspect] || { w: 1024, h: 1024 };
}

export function generateDemoImages(
  prompt: string,
  count: number,
  model: string,
  quality: string,
  aspect: string,
  type: 'image' | 'video' = 'image'
): Generation {
  const dims = getAspectDimensions(aspect);
  const seed = Date.now();
  const images: GeneratedImage[] = Array.from({ length: count }, (_, i) => ({
    id: `img-${seed}-${i}`,
    gradient: gradients[(seed + i * 7) % gradients.length],
    width: dims.w,
    height: dims.h,
  }));

  return {
    id: `gen-${seed}`,
    prompt,
    model,
    quality,
    aspectRatio: aspect,
    images,
    createdAt: new Date().toISOString(),
    type,
  };
}
