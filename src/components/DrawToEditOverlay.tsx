'use client';

import React, { useState } from 'react';
import { X, Upload, Monitor, Scissors, Pencil, Film } from 'lucide-react';

type DrawTab = 'sketch-to-video' | 'draw-to-video' | 'draw-to-edit';

export default function DrawToEditOverlay({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<DrawTab>('draw-to-edit');

  const tabs: { id: DrawTab; label: string; icon: React.ReactNode; isNew?: boolean }[] = [
    { id: 'sketch-to-video', label: 'Sketch to Video', icon: <Scissors size={14} />, isNew: true },
    { id: 'draw-to-video', label: 'Draw to Video', icon: <Film size={14} /> },
    { id: 'draw-to-edit', label: 'Draw to Edit', icon: <Pencil size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-6 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
        >
          <X size={14} />
        </button>

        {/* Tab bar */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="flex items-center gap-1 bg-bg-tertiary border border-border rounded-full px-1.5 py-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-surface border border-border text-text-primary shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.isNew && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-accent text-bg-primary leading-none">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
          <div className="border-2 border-dashed border-border/60 rounded-xl m-6 p-8 flex flex-col items-center justify-center min-h-[360px]">
            {/* Preview image placeholder */}
            <div className="w-48 h-36 rounded-xl bg-surface border border-border flex items-center justify-center mb-6 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-amber-900/30 via-stone-800/40 to-stone-900/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-black/30 flex items-center justify-center mb-2">
                    <Pencil size={18} className="text-text-tertiary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide mb-2">
              {activeTab === 'draw-to-edit' && 'Draw to Edit'}
              {activeTab === 'draw-to-video' && 'Draw to Video'}
              {activeTab === 'sketch-to-video' && 'Sketch to Video'}
            </h2>

            {/* Description */}
            <p className="text-[13px] text-text-tertiary text-center max-w-xs mb-6">
              {activeTab === 'draw-to-edit' && 'From sketch to a complete picture in a second. No prompt needed.'}
              {activeTab === 'draw-to-video' && 'Draw a simple sketch and transform it into a dynamic video.'}
              {activeTab === 'sketch-to-video' && 'Convert rough sketches into polished animated videos.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-primary text-[13px] font-medium transition-all">
                <Upload size={14} />
                <span>Upload Media</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover text-text-primary text-[13px] font-medium transition-all">
                <Monitor size={14} />
                <span>Create blank</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
