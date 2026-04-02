'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { savedPrompts, SavedPrompt } from '@/data/prompts';
import { Heart, Copy, Trash2, Star, Tag, BarChart3, Search } from 'lucide-react';

function PromptCard({ prompt }: { prompt: SavedPrompt }) {
  const [isFav, setIsFav] = useState(prompt.isFavorite);

  return (
    <div className="group rounded-2xl border border-border bg-surface hover:border-border-strong transition-all p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-accent transition-colors">
          {prompt.title}
        </h3>
        <button
          onClick={() => setIsFav(!isFav)}
          className="p-1 rounded-lg hover:bg-surface-hover transition-colors shrink-0"
        >
          <Heart
            size={14}
            className={isFav ? 'text-accent fill-accent' : 'text-text-tertiary'}
          />
        </button>
      </div>

      {/* Prompt text */}
      <p className="text-[12px] text-text-tertiary leading-relaxed mb-4 line-clamp-3">
        {prompt.prompt}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-bg-tertiary text-[10px] text-text-tertiary font-medium flex items-center gap-1"
          >
            <Tag size={8} />
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
            <BarChart3 size={10} />
            Used {prompt.usageCount}x
          </span>
          <span className="text-[10px] text-text-tertiary">{prompt.createdAt}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-tertiary hover:text-text-primary">
            <Copy size={12} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-tertiary hover:text-danger">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyPromptsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = savedPrompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">My Prompts</h1>
            <p className="text-sm text-text-tertiary">Your saved and favorite prompts for quick reuse</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border flex-1 max-w-md focus-within:border-accent/30 transition-colors">
            <Search size={14} className="text-text-tertiary shrink-0" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all flex items-center gap-1.5">
            <Star size={12} />
            Favorites
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-tertiary text-sm">No prompts found</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
