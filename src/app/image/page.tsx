'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import PageHero from '@/components/PageHero';
import BottomPromptBar from '@/components/BottomPromptBar';
import GenerationGallery from '@/components/GenerationGallery';
import AmbientBackground from '@/components/AmbientBackground';
import { generateDemoImages } from '@/data/generations';
import { useGenerations } from '@/context/GenerationContext';
import { History, Users } from 'lucide-react';

export default function ImagePage() {
  const { generations, addGeneration } = useGenerations();
  const [activeTab, setActiveTab] = useState<'history' | 'community'>('history');
  const [columns, setColumns] = useState(4);

  const imageGenerations = generations.filter((g) => g.type === 'image');

  const handleGenerate = (prompt: string, model: string, quality: string, aspect: string, count: number) => {
    const gen = generateDemoImages(prompt, count, model, quality, aspect, 'image');
    addGeneration(gen);
  };

  const hasGenerations = imageGenerations.length > 0;

  return (
    <AppShell>
      <div className="relative min-h-screen flex flex-col">
        {/* Animated Background */}
        <AmbientBackground planet="jupiter" intensity={0.7} />

        {/* Content */}
        <div className="flex-1 relative z-10 pb-40">
          {hasGenerations ? (
            <>
              {/* Tab Switcher */}
              <div className="sticky top-0 z-20 px-4 md:px-6 py-3 flex items-center gap-2 bg-bg-primary/80 backdrop-blur-md border-b border-border/30">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                    activeTab === 'history'
                      ? 'bg-surface border border-border text-text-primary'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <History size={13} />
                  History
                </button>
                <button
                  onClick={() => setActiveTab('community')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                    activeTab === 'community'
                      ? 'bg-surface border border-border text-text-primary'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <Users size={13} />
                  Community
                </button>
              </div>

              {/* Generation Gallery */}
              <div className="px-3 md:px-6 pt-4">
                <GenerationGallery
                  generations={imageGenerations}
                  columns={columns}
                  onColumnsChange={setColumns}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-200px)]">
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
          )}
        </div>

        {/* Bottom Prompt Bar */}
        <BottomPromptBar onGenerate={handleGenerate} />
      </div>
    </AppShell>
  );
}
