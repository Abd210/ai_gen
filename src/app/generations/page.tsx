'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useToast } from '@/components/ToastProvider';
import { generationHistory, GenerationItem } from '@/data/history';
import { Image, Video, Clock, Sparkles, MoreHorizontal, Filter, Download, Trash2, Copy, ExternalLink, X } from 'lucide-react';

function GenerationCard({ item, onSelect }: { item: GenerationItem; onSelect: (item: GenerationItem) => void }) {
  return (
    <div
      className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-border-strong transition-all cursor-pointer"
      onClick={() => onSelect(item)}
    >
      {/* Thumbnail */}
      <div
        className="aspect-square relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${item.thumbnailColor}, ${item.thumbnailColor}88)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {item.type === 'image' ? (
            <Image size={32} className="text-white/20" />
          ) : (
            <Video size={32} className="text-white/20" />
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            item.status === 'completed' ? 'bg-success/20 text-success' :
            item.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
            'bg-danger/20 text-danger'
          }`}>
            {item.status === 'processing' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 animate-pulse" />
            )}
            {item.status}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium uppercase">
            {item.type}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
            <ExternalLink size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[12px] text-text-primary line-clamp-2 leading-relaxed mb-2">
          {item.prompt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-text-tertiary">
            <Clock size={10} />
            <span className="text-[10px]">{item.createdAt}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-text-tertiary">{item.model}</span>
            <span className="flex items-center gap-0.5 text-[10px] text-accent">
              <Sparkles size={8} />
              {item.cost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerationsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selected, setSelected] = useState<GenerationItem | null>(null);

  const filtered = filter === 'all'
    ? generationHistory
    : generationHistory.filter((g) => g.type === filter);

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary mb-1 md:mb-2">Generations</h1>
            <p className="text-sm text-text-tertiary">Your generation history and results</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'image', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                filter === f
                  ? 'bg-accent-dim text-accent border border-accent/20'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {f === 'image' && <Image size={12} />}
              {f === 'video' && <Video size={12} />}
              {f === 'all' && <Filter size={12} />}
              <span className="capitalize">{f}</span>
            </button>
          ))}

          <span className="text-[12px] text-text-tertiary ml-2">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <GenerationCard key={item.id} item={item} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {/* Detail Panel Overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-bg-secondary border border-border rounded-2xl shadow-elevated animate-scale-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-[15px] font-bold text-text-primary">Generation Details</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-tertiary hover:text-text-primary transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Thumbnail */}
            <div
              className="aspect-video w-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${selected.thumbnailColor}, ${selected.thumbnailColor}88)` }}
            >
              {selected.type === 'image' ? <Image size={40} className="text-white/20" /> : <Video size={40} className="text-white/20" />}
            </div>

            {/* Info */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-[13px] text-text-primary leading-relaxed">{selected.prompt}</p>

              <div className="space-y-2">
                {[
                  ['Type', selected.type.charAt(0).toUpperCase() + selected.type.slice(1)],
                  ['Model', selected.model],
                  ['Status', selected.status],
                  ['Cost', `${selected.cost} credits`],
                  ['Created', selected.createdAt],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-text-tertiary">{label}</span>
                    <span className="text-[11px] text-text-primary font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(selected.prompt).catch(() => {}); toast('Prompt copied!', 'success'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
                >
                  <Copy size={12} /> Copy Prompt
                </button>
                <button
                  onClick={() => { toast('Downloaded!', 'success'); setSelected(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent text-white text-[12px] font-medium hover:bg-accent-hover transition-all"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
