'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import PageHero from '@/components/PageHero';
import BottomPromptBar from '@/components/BottomPromptBar';

export default function ImagePage() {
  return (
    <AppShell>
      <div className="relative min-h-screen flex flex-col">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(20, 60, 140, 0.12) 0%, rgba(10, 30, 80, 0.06) 40%, transparent 70%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center relative z-10 pb-40">
          <PageHero
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
                <path d="M12 3c-1.2 2-3 3.5-5 4.5S3 10 3 12s1.5 3.5 2 4.5 3.8 2.5 5 4.5c1.2-2 3-3.5 5-4.5s4-2.5 4-4.5-1.5-3.5-2-4.5-3.8-2.5-5-4.5Z" />
              </svg>
            }
            title="START CREATING WITH"
            subtitle="NANO BANANA PRO"
            description="Describe a scene, character, mood, or style — and watch it come to life"
          />
        </div>

        {/* Bottom Prompt Bar */}
        <BottomPromptBar />
      </div>
    </AppShell>
  );
}
