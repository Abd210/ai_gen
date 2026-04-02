'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import PageHero from '@/components/PageHero';
import VideoPromptBar from '@/components/VideoPromptBar';
import { Joystick, ArrowUpRight, ArrowDownRight, RotateCw, MoveHorizontal, Move } from 'lucide-react';

const motionTypes = [
  { id: 'pan-left', label: 'Pan Left', icon: <MoveHorizontal size={20} />, description: 'Smooth camera pan left' },
  { id: 'pan-right', label: 'Pan Right', icon: <MoveHorizontal size={20} className="rotate-180" />, description: 'Smooth camera pan right' },
  { id: 'zoom-in', label: 'Zoom In', icon: <ArrowUpRight size={20} />, description: 'Gradual zoom into subject' },
  { id: 'zoom-out', label: 'Zoom Out', icon: <ArrowDownRight size={20} />, description: 'Pull back from the scene' },
  { id: 'rotate', label: 'Rotate', icon: <RotateCw size={20} />, description: '360° orbit around subject' },
  { id: 'tracking', label: 'Tracking', icon: <Move size={20} />, description: 'Follow subject movement' },
];

export default function MotionControlPage() {
  return (
    <AppShell>
      <div className="relative min-h-screen flex flex-col">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(200, 255, 0, 0.04) 0%, transparent 60%)',
            }}
          />
        </div>

        <div className="flex-1 relative z-10 pb-40">
          <div className="max-w-4xl mx-auto px-8 pt-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Motion Control</h1>
              <p className="text-sm text-text-tertiary">Control camera movement and animation trajectories</p>
            </div>

            {/* Motion Type Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {motionTypes.map((motion, i) => (
                <button
                  key={motion.id}
                  className={`group p-5 rounded-2xl border transition-all duration-200 text-left ${
                    i === 0
                      ? 'border-accent/30 bg-accent-dim'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    i === 0
                      ? 'bg-accent/10 text-accent'
                      : 'bg-bg-tertiary text-text-tertiary group-hover:text-text-primary'
                  }`}>
                    {motion.icon}
                  </div>
                  <h3 className={`text-[13px] font-semibold mb-1 ${
                    i === 0 ? 'text-accent' : 'text-text-primary'
                  }`}>
                    {motion.label}
                  </h3>
                  <p className="text-[11px] text-text-tertiary">{motion.description}</p>
                </button>
              ))}
            </div>

            {/* Trajectory Canvas Placeholder */}
            <div className="rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="border-2 border-dashed border-border rounded-xl py-16 px-8">
                <Joystick size={32} className="text-text-tertiary mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-text-secondary mb-1">Trajectory Canvas</h3>
                <p className="text-[12px] text-text-tertiary max-w-sm mx-auto">
                  Draw or select a camera motion path. The AI will apply this movement to your generated video.
                </p>
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
