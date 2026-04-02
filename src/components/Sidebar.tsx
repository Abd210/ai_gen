'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Workflow,
  History,
  Image,
  Video,
  Joystick,
  FileText,
  Wallet,
  LogOut,
  Sparkles,
  PanelLeftClose,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Workflow,
  History,
  Image,
  Video,
  Joystick,
  FileText,
};

interface SidebarItemProps {
  label: string;
  icon: string;
  route: string;
  isActive: boolean;
}

function SidebarItem({ label, icon, route, isActive }: SidebarItemProps) {
  const IconComponent = iconMap[icon];

  return (
    <Link
      href={route}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
        transition-all duration-200 group relative
        ${isActive
          ? 'bg-accent-muted text-accent'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }
      `}
    >
      {IconComponent && (
        <IconComponent
          size={18}
          className={`shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-text-tertiary group-hover:text-text-secondary'}`}
        />
      )}
      <span>{label}</span>
    </Link>
  );
}

const menuItems = [
  { id: 'workflows', label: 'Workflows', icon: 'Workflow', route: '/workflows' },
  { id: 'generations', label: 'Generations', icon: 'History', route: '/generations' },
  { id: 'image', label: 'Image', icon: 'Image', route: '/image' },
  { id: 'video', label: 'Video', icon: 'Video', route: '/video' },
  { id: 'motion-control', label: 'Motion Control', icon: 'Joystick', route: '/motion-control' },
  { id: 'my-prompts', label: 'My Prompts', icon: 'FileText', route: '/my-prompts' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-[240px] min-w-[240px] h-screen bg-bg-secondary border-r border-border flex flex-col sticky top-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border border-accent/20">
            <span className="text-sm font-bold text-accent">Sn</span>
          </div>
          <span className="text-[15px] font-semibold text-text-primary tracking-tight">Xenofield</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-tertiary hover:text-text-secondary">
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            route={item.route}
            isActive={pathname === item.route}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-3 space-y-1 border-t border-border pt-3">
        {/* Billing */}
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
        >
          <Wallet size={18} className="text-text-tertiary" />
          <span>Billing</span>
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-text-primary truncate">
              {user?.email || 'user@email.com'}
            </p>
            <p className="text-[11px] text-text-tertiary">
              ${user?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Add Funds */}
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-accent text-bg-primary text-[13px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.98]">
          <Sparkles size={14} />
          <span>Add funds</span>
        </button>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
