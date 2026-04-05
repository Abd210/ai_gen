export interface Character {
  id: string;
  name: string;
  avatar: string; // gradient CSS or image URL
  photo?: string; // actual character image
  description: string;
  tags: string[];
  createdFrom: 'prompt' | 'photo';
  createdAt: string;
}

export const dummyCharacters: Character[] = [
  {
    id: 'char-zara',
    name: 'Zara Nebula',
    avatar: 'linear-gradient(135deg, #a855f7, #ec4899)',
    photo: '/characters/zara.png',
    description: 'Futuristic space explorer with cybernetic enhancements and glowing violet eyes. Wears a sleek dark suit with neon accents.',
    tags: ['sci-fi', 'cyberpunk', 'female'],
    createdFrom: 'prompt',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'char-kai',
    name: 'Kai Storm',
    avatar: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    photo: '/characters/kai.png',
    description: 'Brooding samurai warrior from a rain-soaked neon city. Long dark hair, scarred face, carries a plasma katana.',
    tags: ['warrior', 'neo-tokyo', 'male'],
    createdFrom: 'prompt',
    createdAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'char-nova',
    name: 'Nova Echo',
    avatar: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    photo: '/characters/nova.png',
    description: 'Ethereal AI consciousness manifested as a humanoid figure made of shifting golden light particles and warm energy.',
    tags: ['ai', 'abstract', 'non-binary'],
    createdFrom: 'prompt',
    createdAt: '2026-03-25T09:15:00Z',
  },
  {
    id: 'char-luna',
    name: 'Luna Voss',
    avatar: 'linear-gradient(135deg, #10b981, #14b8a6)',
    photo: '/characters/luna.png',
    description: 'Mystical forest guardian draped in living vines and bioluminescent flowers. Pale skin with emerald markings.',
    tags: ['fantasy', 'nature', 'female'],
    createdFrom: 'photo',
    createdAt: '2026-04-01T16:45:00Z',
  },
  {
    id: 'char-rex',
    name: 'Rex Cipher',
    avatar: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    photo: '/characters/rex.png',
    description: 'Rogue hacker in a dystopian megacity. Wears a holographic mask, fingerless gloves, and a tattered trench coat with LED strips.',
    tags: ['hacker', 'dystopian', 'male'],
    createdFrom: 'prompt',
    createdAt: '2026-04-03T11:20:00Z',
  },
];
