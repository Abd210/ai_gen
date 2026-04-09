'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary relative">
      {/* ── Global Ambient Animated Background ── */}
      <div className="ambient-bg">
        <div
          className="ambient-orb"
          style={{
            width: '600px', height: '600px',
            top: '5%', left: '55%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(120, 40, 200, 0.06) 40%, transparent 65%)',
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: '500px', height: '500px',
            bottom: '15%', left: '5%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 65%)',
            animationDelay: '5s',
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: '450px', height: '450px',
            top: '45%', right: '0%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 65%)',
            animationDelay: '10s',
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: '350px', height: '350px',
            top: '70%', left: '40%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
            animationDelay: '15s',
          }}
        />
        <div className="noise-overlay" style={{ opacity: 0.02 }} />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-[1]">
        {/* Mobile top bar — only visible on small screens */}
        <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-border bg-bg-secondary shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15">
              <img src="/xenofield-icon.png" alt="Xenofield" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[14px] font-semibold text-text-primary tracking-tight">Xenofield</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
