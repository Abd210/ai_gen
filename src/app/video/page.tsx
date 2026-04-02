'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import PageHero from '@/components/PageHero';
import VideoPromptBar from '@/components/VideoPromptBar';
import UploadCard from '@/components/UploadCard';
import { Video } from 'lucide-react';

export default function VideoPage() {
  return (
    <AppShell>
      <div className="relative min-h-screen flex flex-col">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(100, 20, 180, 0.08) 0%, rgba(50, 10, 100, 0.04) 40%, transparent 70%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 relative z-10 pb-40">
          <div className="max-w-2xl mx-auto px-6 pt-12">
            {/* Page Title */}
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-xl font-bold text-text-primary">Create Video</h1>
            </div>

            {/* Model Preview Card */}
            <div className="relative rounded-2xl overflow-hidden mb-6 border border-border bg-gradient-to-br from-surface to-bg-tertiary">
              <div className="aspect-video flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4 mx-auto">
                    <Video size={24} className="text-text-tertiary" />
                  </div>
                  <p className="text-lg font-bold text-accent uppercase tracking-wider">GENERAL</p>
                  <p className="text-sm text-text-secondary mt-1">Kling 3.0</p>
                </div>
                <button className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/80 border border-border text-[12px] font-medium text-accent hover:bg-surface transition-all">
                  <span>✏️</span>
                  <span>Change</span>
                </button>
              </div>
            </div>

            {/* Frame Upload Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <UploadCard label="Start frame" sublabel="Upload an image" />
              <UploadCard label="End frame" sublabel="Upload an image" />
            </div>

            {/* Multi-shot Toggle */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-surface mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-text-primary font-medium">Multi-shot</span>
                <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[9px] text-text-tertiary cursor-help">?</span>
              </div>
              <div className="w-9 h-5 rounded-full bg-surface-active relative cursor-pointer">
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="rounded-xl border border-border bg-surface p-4 mb-6">
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Your prompt will appear here after entering it in the generation bar below...
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-accent-dim text-accent text-[11px] font-medium flex items-center gap-1">
                  ✨ Enhance on
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-hover text-text-secondary text-[11px] font-medium flex items-center gap-1">
                  🔊 On
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-hover text-text-secondary text-[11px] font-medium flex items-center gap-1">
                  ⊕ Elements
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Prompt Bar */}
        <VideoPromptBar />
      </div>
    </AppShell>
  );
}
