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
  PanelLeftOpen,
  Mic,
  ShieldOff,
  ShieldCheck,
  Crop,
  LayoutDashboard,
  UserCircle2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ToastProvider';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Workflow,
  History,
  Image,
  Video,
  Joystick,
  FileText,
  Mic,
  ShieldOff,
  ShieldCheck,
  Crop,
  LayoutDashboard,
  UserCircle2,
  SlidersHorizontal,
};

interface SidebarItemProps {
  label: string;
  icon: string;
  route: string;
  isActive: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function SidebarItem({ label, icon, route, isActive, collapsed, onClick }: SidebarItemProps) {
  const IconComponent = iconMap[icon];

  return (
    <Link
      href={route}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        flex items-center gap-3 rounded-xl text-[13px] font-medium
        transition-all duration-200 group relative
        ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'}
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
      {!collapsed && <span>{label}</span>}
      {/* Tooltip on hover when collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-bg-secondary border border-border text-[11px] text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-dropdown">
          {label}
        </div>
      )}
    </Link>
  );
}

const menuItems = [
  { id: 'workflows', label: 'Workflows', icon: 'Workflow', route: '/workflows' },
  { id: 'generations', label: 'Generations', icon: 'History', route: '/generations' },
  { id: 'image', label: 'Image', icon: 'Image', route: '/image' },
  { id: 'video', label: 'Video', icon: 'Video', route: '/video' },
  { id: 'audio', label: 'Audio', icon: 'Mic', route: '/audio' },
  { id: 'post-studio', label: 'Post Studio', icon: 'LayoutDashboard', route: '/post-studio' },
  { id: 'image-editor', label: 'Image Editor', icon: 'SlidersHorizontal', route: '/image-editor' },
  { id: 'characters', label: 'Characters', icon: 'UserCircle2', route: '/characters' },
  { id: 'motion-control', label: 'Motion Control', icon: 'Joystick', route: '/motion-control' },
  { id: 'my-prompts', label: 'My Prompts', icon: 'FileText', route: '/my-prompts' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isOpen = false, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  const sidebarWidth = collapsed ? 'w-[60px] min-w-[60px]' : 'w-[240px] min-w-[240px]';

  const sidebarContent = (
    <aside className={`${sidebarWidth} h-full bg-bg-secondary border-r border-border flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-4 border-b border-border`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15">
              <img src="/xenofield-icon.png" alt="Xenofield" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-[15px] font-semibold text-text-primary tracking-tight">Xenofield</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15">
            <img src="/xenofield-icon.png" alt="Xenofield" className="w-6 h-6 object-contain" />
          </div>
        )}
        {/* Collapse/Expand toggle — desktop only */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-tertiary hover:text-text-secondary hidden md:block"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
        {/* Mobile close */}
        {!collapsed && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-tertiary hover:text-text-secondary md:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-border/30">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-tertiary hover:text-text-secondary"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-1.5' : 'px-3'} py-3 space-y-0.5 overflow-y-auto`}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            route={item.route}
            isActive={pathname === item.route}
            collapsed={collapsed}
            onClick={handleNavClick}
          />
        ))}
        {/* Admin link — only for admin users */}
        {user?.isAdmin && (
          <>
            <div className="h-px bg-border/30 my-2" />
            <SidebarItem
              label="Admin"
              icon="ShieldCheck"
              route="/admin"
              isActive={pathname === '/admin'}
              collapsed={collapsed}
              onClick={handleNavClick}
            />
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className={`${collapsed ? 'px-1.5' : 'px-3'} pb-3 space-y-1 border-t border-border pt-3`}>
        {/* Billing */}
        <Link
          href="/billing"
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0' : 'px-3'} py-2.5 rounded-xl text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all`}
          title={collapsed ? 'Billing' : undefined}
        >
          <Wallet size={18} className="text-text-tertiary shrink-0" />
          {!collapsed && <span>Billing</span>}
        </Link>

        {/* User */}
        {!collapsed && (
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
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0" title={user?.email || 'User'}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )}

        {/* Add Funds */}
        <Link
          href="/billing"
          className={`w-full flex items-center justify-center gap-2 ${collapsed ? 'px-1' : 'px-3'} py-2.5 rounded-xl bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.98]`}
          title={collapsed ? 'Add funds' : undefined}
        >
          <Sparkles size={14} />
          {!collapsed && <span>Add funds</span>}
        </Link>

        {/* Sign Out */}
        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 ${collapsed ? 'px-1' : 'px-3'} py-2 rounded-xl text-[12px] text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all`}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={14} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile drawer — overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden animate-slide-in-left">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
