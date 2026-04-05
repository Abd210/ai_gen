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
  { id: 'audio', label: 'Audio', icon: 'Mic', route: '/audio' },
  { id: 'post-studio', label: 'Post Studio', icon: 'LayoutDashboard', route: '/post-studio' },
  { id: 'image-cropper', label: 'Image Cropper', icon: 'Crop', route: '/image-cropper' },
  { id: 'remove-meta', label: 'Remove Meta', icon: 'ShieldOff', route: '/remove-meta' },
  { id: 'characters', label: 'Characters', icon: 'UserCircle2', route: '/characters' },
  { id: 'motion-control', label: 'Motion Control', icon: 'Joystick', route: '/motion-control' },
  { id: 'my-prompts', label: 'My Prompts', icon: 'FileText', route: '/my-prompts' },
];
