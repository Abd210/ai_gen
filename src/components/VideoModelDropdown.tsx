'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, Sparkles, Volume2, Clock } from 'lucide-react';
import { VideoModel } from '@/data/video-models';

interface VideoModelDropdownProps {
  models: VideoModel[];
  selectedModelId: string;
  onSelect: (model: VideoModel) => void;
  onClose: () => void;
}

function VideoModelBadge({ tag }: { tag: string }) {
  if (tag === 'NEW') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-accent text-bg-primary">
        NEW
      </span>
    );
  }
  if (tag === 'PREMIUM') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-accent/40 text-accent">
        PREMIUM
      </span>
    );
  }
  if (tag === 'BUSINESS') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
        BUSINESS
      </span>
    );
  }
  return null;
}

function VideoModelCard({
  model,
  isSelected,
  onSelect,
}: {
  model: VideoModel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left
        transition-all duration-150
        ${isSelected ? 'bg-accent-dim' : 'hover:bg-surface-hover'}
      `}
    >
      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-sm shrink-0 mt-0.5">
        {model.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-medium text-text-primary">{model.name}</span>
          {model.tags.map((tag) => (
            <VideoModelBadge key={tag} tag={tag} />
          ))}
        </div>
        <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">{model.description}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="flex items-center gap-0.5 text-[10px] text-accent font-medium">
            <Sparkles size={8} />
            {model.costPerGeneration}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-text-tertiary">
            <Clock size={8} />
            {model.generationTime}
          </span>
          <span className="text-[10px] text-text-tertiary">
            {model.durationRange[0]}–{model.durationRange[1]}s
          </span>
          <span className="text-[10px] text-text-tertiary">
            {model.resolutions.join(' / ')}
          </span>
          {model.soundSupport && (
            <span className="flex items-center gap-0.5 text-[10px] text-text-tertiary">
              <Volume2 size={8} />
              Sound
            </span>
          )}
        </div>
      </div>
      {isSelected && (
        <Check size={16} className="text-accent shrink-0 mt-1" />
      )}
    </button>
  );
}

export default function VideoModelDropdown({ models, selectedModelId, onSelect, onClose }: VideoModelDropdownProps) {
  const [search, setSearch] = useState('');

  const featuredModels = useMemo(
    () => models.filter((m) => m.category === 'featured' && m.name.toLowerCase().includes(search.toLowerCase())),
    [models, search]
  );

  const allModels = useMemo(
    () => models.filter((m) => m.category === 'all' && m.name.toLowerCase().includes(search.toLowerCase())),
    [models, search]
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown — fixed position to avoid clipping */}
      <div className="fixed bottom-[70px] left-[calc(240px+24px)] w-[380px] max-h-[520px] bg-bg-secondary border border-border rounded-2xl shadow-dropdown z-50 flex flex-col animate-scale-in overflow-hidden">
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border">
            <Search size={14} className="text-text-tertiary shrink-0" />
            <input
              type="text"
              placeholder="Search video models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-tertiary"
              autoFocus
            />
          </div>
        </div>

        {/* Model list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Featured */}
          {featuredModels.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Sparkles size={12} className="text-accent" />
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Featured models</span>
              </div>
              {featuredModels.map((model) => (
                <VideoModelCard
                  key={model.id}
                  model={model}
                  isSelected={model.id === selectedModelId}
                  onSelect={() => onSelect(model)}
                />
              ))}
            </div>
          )}

          {/* All Models */}
          {allModels.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">All models</span>
              </div>
              {allModels.map((model) => (
                <VideoModelCard
                  key={model.id}
                  model={model}
                  isSelected={model.id === selectedModelId}
                  onSelect={() => onSelect(model)}
                />
              ))}
            </div>
          )}

          {featuredModels.length === 0 && allModels.length === 0 && (
            <p className="text-center text-text-tertiary text-[12px] py-8">No models found</p>
          )}
        </div>
      </div>
    </>
  );
}
