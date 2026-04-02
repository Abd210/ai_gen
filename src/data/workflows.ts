export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  category: string;
  color: string;
  icon: string;
  isPopular: boolean;
}

export const workflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Product Photo Studio',
    description: 'Generate professional product photography from simple object photos',
    steps: 4,
    category: 'E-Commerce',
    color: '#3b82f6',
    icon: '📦',
    isPopular: true,
  },
  {
    id: 'wf-002',
    name: 'Social Media Pack',
    description: 'Create a full social media content pack from a single concept',
    steps: 6,
    category: 'Marketing',
    color: '#8b5cf6',
    icon: '📱',
    isPopular: true,
  },
  {
    id: 'wf-003',
    name: 'Character Designer',
    description: 'Design consistent characters across multiple poses and styles',
    steps: 5,
    category: 'Art',
    color: '#ec4899',
    icon: '🎨',
    isPopular: false,
  },
  {
    id: 'wf-004',
    name: 'Video Ad Creator',
    description: 'Turn your product images into engaging video advertisements',
    steps: 7,
    category: 'Advertising',
    color: '#f59e0b',
    icon: '🎥',
    isPopular: true,
  },
  {
    id: 'wf-005',
    name: 'Brand Kit Generator',
    description: 'Generate complete brand identity from a text description',
    steps: 8,
    category: 'Branding',
    color: '#10b981',
    icon: '✨',
    isPopular: false,
  },
  {
    id: 'wf-006',
    name: 'Moodboard to Scene',
    description: 'Transform moodboard collections into fully rendered scenes',
    steps: 3,
    category: 'Design',
    color: '#6366f1',
    icon: '🖼️',
    isPopular: false,
  },
];
