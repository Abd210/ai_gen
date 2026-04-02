export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export const menuItems: MenuItem[] = [
  { id: 'workflows', label: 'Workflows', icon: 'Workflow', route: '/workflows' },
  { id: 'generations', label: 'Generations', icon: 'History', route: '/generations' },
  { id: 'image', label: 'Image', icon: 'Image', route: '/image' },
  { id: 'video', label: 'Video', icon: 'Video', route: '/video' },
  { id: 'motion-control', label: 'Motion Control', icon: 'Joystick', route: '/motion-control' },
  { id: 'my-prompts', label: 'My Prompts', icon: 'FileText', route: '/my-prompts' },
];
