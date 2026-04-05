'use client';

import React, { useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { useToast } from '@/components/ToastProvider';
import {
  Image as ImageIcon, Upload, X, Sparkles, Info,
  Square, Smartphone, Monitor, Plus, Minus,
  Zap, Check, Download, RefreshCw,
} from 'lucide-react';

const aspects = [
  { id: '4:5', label: '4:5', sub: 'Instagram Feed', icon: <Smartphone size={12} />, ratio: '4/5' },
  { id: '9:16', label: '9:16', sub: 'Stories / Reels', icon: <Smartphone size={12} />, ratio: '9/16' },
  { id: '1:1', label: '1:1', sub: 'Square', icon: <Square size={12} />, ratio: '1/1' },
  { id: '16:9', label: '16:9', sub: 'Landscape', icon: <Monitor size={12} />, ratio: '16/9' },
];

export default function PostStudioPage() {
  const { toast } = useToast();
  const [photo, setPhoto] = useState<string | null>(null);
  const [quality, setQuality] = useState<'2K' | '4K'>('2K');
  const [aspect, setAspect] = useState('4:5');
  const [carousel, setCarousel] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const cost = quality === '4K' ? 6 : 4;
  const totalCost = cost * carousel;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) setPhoto(URL.createObjectURL(file));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) setPhoto(URL.createObjectURL(file));
        break;
      }
    }
  };

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden" onPaste={handlePaste}>
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] rounded-full animate-glow-pulse" style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, rgba(120,40,200,0.03) 40%, transparent 70%)' }} />
          <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full animate-glow-pulse" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)', animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-8 py-6 flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center border border-accent/15 shadow-glow-accent">
              <ImageIcon size={18} className="text-accent" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Post Studio</h1>
              <p className="text-[12px] text-text-tertiary">Create stunning social media posts from your photos</p>
            </div>
          </div>

          {/* Main Panel — Single column centered */}
          <div className="max-w-[420px] mx-auto px-6 pb-32 animate-slide-up">
            {/* ─── Mode indicator (Photo Only) ─── */}
            <div className="flex items-center mb-6">
              <div className="flex items-center bg-surface rounded-xl p-1 w-full">
                <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent/15 text-accent text-[12px] font-medium shadow-sm">
                  <ImageIcon size={13} />
                  Photo Only
                </div>
              </div>
            </div>

            {/* ─── 1. YOUR PHOTO ─── */}
            <div className="mb-6">
              <h2 className="text-[13px] font-bold text-text-primary tracking-wide mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent">1</span>
                YOUR PHOTO
              </h2>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

              {photo ? (
                <div className="relative rounded-xl border border-border/60 overflow-hidden group">
                  <img src={photo} alt="Selected" className="w-full aspect-[4/5] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => setPhoto(null)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-[11px] text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Upload size={11} /> Change
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border/40 rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent/30 hover:bg-accent/[0.02] transition-all min-h-[250px]"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center">
                    <Plus size={20} className="text-text-tertiary" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-text-secondary">Select Photo</p>
                    <p className="text-[11px] text-text-tertiary mt-1">
                      drop, click, or paste <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px]">Ctrl+V</kbd>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ─── 2. CONFIGURATION ─── */}
            <div className="mb-6">
              <h2 className="text-[13px] font-bold text-text-primary tracking-wide mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent">2</span>
                CONFIGURATION
                <div className="relative group/tip ml-1">
                  <Info size={12} className="text-text-tertiary cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block z-50">
                    <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[10px] text-text-secondary whitespace-nowrap shadow-dropdown">
                      Configure output quality and format
                    </div>
                  </div>
                </div>
              </h2>

              {/* Quality */}
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-text-primary">Quality</span>
                    <div className="relative group/tip">
                      <Info size={10} className="text-text-tertiary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block z-50">
                        <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[10px] text-text-secondary whitespace-nowrap shadow-dropdown">
                          Higher quality uses more credits
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['2K', '4K'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                          quality === q
                            ? 'bg-accent/15 text-accent border-accent/25'
                            : 'bg-surface/50 text-text-tertiary border-border/30 hover:text-text-secondary'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[12px] font-medium text-text-primary">Aspect Ratio</span>
                  <div className="relative group/tip">
                    <Info size={10} className="text-text-tertiary cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block z-50">
                      <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[10px] text-text-secondary whitespace-nowrap shadow-dropdown">
                        Choose the output aspect ratio
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {aspects.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAspect(a.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all border ${
                        aspect === a.id
                          ? 'bg-accent/10 border-accent/25 text-text-primary'
                          : 'bg-surface/30 border-border/30 text-text-secondary hover:border-border hover:text-text-primary'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${aspect === a.id ? 'bg-accent/20 text-accent' : 'bg-surface text-text-tertiary'}`}>
                        {aspect === a.id ? <Check size={10} /> : a.icon}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold">{a.label}</p>
                        <p className="text-[9px] text-text-tertiary">{a.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carousel Count */}
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-text-primary">Carousel Images</span>
                    <div className="relative group/tip">
                      <Info size={10} className="text-text-tertiary cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block z-50">
                        <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[10px] text-text-secondary whitespace-nowrap shadow-dropdown">
                          Generate multiple carousel slides
                        </div>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-accent bg-accent/10 border border-accent/15">BETA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCarousel((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-strong transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-[14px] font-bold text-text-primary w-6 text-center">{carousel}</span>
                    <button
                      onClick={() => setCarousel((c) => Math.min(10, c + 1))}
                      className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary hover:border-border-strong transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-text-secondary">Cost</span>
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-accent">
                    <Zap size={12} className="text-amber-400" />
                    {totalCost} Credits
                  </span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              disabled={!photo || isGenerating}
              onClick={() => {
                if (!photo) return;
                setIsGenerating(true);
                setTimeout(() => {
                  const posts = Array.from({ length: carousel }, (_, i) => {
                    const hue1 = Math.random() * 360;
                    const hue2 = hue1 + 60 + Math.random() * 60;
                    return `linear-gradient(${Math.random() * 360}deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 40%))`;
                  });
                  setGeneratedPosts(posts);
                  setIsGenerating(false);
                  toast(`${carousel} post${carousel > 1 ? 's' : ''} generated!`, 'success');
                }, 2500);
              }}
              className={`w-full py-4 rounded-2xl text-[16px] font-extrabold uppercase tracking-wider transition-all ${
                !photo || isGenerating
                  ? 'bg-surface border border-border text-text-tertiary cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent to-purple-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent/30'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  GENERATING...
                </span>
              ) : 'GENERATE POST'}
            </button>

            {/* Generated Posts */}
            {generatedPosts.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-[12px] font-bold text-text-primary flex items-center gap-2">
                  <Check size={14} className="text-green-400" />
                  Generated Posts ({generatedPosts.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {generatedPosts.map((gradient, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-border/60 group relative">
                      <div className="aspect-[4/5]" style={{ background: gradient }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button onClick={() => toast('Post downloaded!', 'success')} className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 hover:text-white"><Download size={14} /></button>
                        <button onClick={() => toast('Post shared!', 'info')} className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 hover:text-white"><Upload size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insufficient credits notice */}
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] text-red-400">●</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-red-400">Insufficient Credits</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">
                  You need <span className="text-red-400 font-medium">{totalCost} credits</span> but only have <span className="text-text-secondary font-medium">0 available</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
