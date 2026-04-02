'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, Sparkles } from 'lucide-react';
import { ImageModel } from '@/data/models';

interface ModelDropdownProps {
  models: ImageModel[];
  selectedModelId: string;
  onSelect: (model: ImageModel) => void;
  onClose: () => void;
}

function ModelBadge({ tag }: { tag: string }) {
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
      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
        FOR BUSINESS PLANS
      </span>
    );
  }
  return null;
}

function ModelCard({
  model,
  isSelected,
  onSelect,
}: {
  model: ImageModel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left
        transition-all duration-150
        ${isSelected
          ? 'bg-accent-dim'
          : 'hover:bg-surface-hover'
        }
      `}
    >
      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-sm shrink-0 mt-0.5">
        {model.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-medium text-text-primary">{model.name}</span>
          {model.tags.map((tag) => (
            <ModelBadge key={tag} tag={tag} />
          ))}
        </div>
        <p className="text-[11px] text-text-tertiary mt-0.5 truncate">{model.description}</p>
      </div>
      {isSelected && (
        <Check size={16} className="text-accent shrink-0 mt-1" />
      )}
    </button>
  );
}

export default function ModelDropdown({ models, selectedModelId, onSelect, onClose }: ModelDropdownProps) {
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

      {/* Dropdown */}
      <div className="absolute bottom-full left-0 mb-2 w-[320px] max-h-[480px] bg-bg-secondary border border-border rounded-2xl shadow-dropdown z-50 flex flex-col animate-scale-in overflow-hidden">
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border">
            <Search size={14} className="text-text-tertiary shrink-0" />
            <input
              type="text"
              placeholder="Search..."
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
                <ModelCard
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
                <ModelCard
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
