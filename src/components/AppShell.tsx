'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar — only visible on small screens */}
        <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-border bg-bg-secondary shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border border-accent/20">
              <span className="text-[11px] font-bold text-accent">Sn</span>
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
