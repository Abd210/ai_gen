'use client';

import React, { useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import AmbientBackground from '@/components/AmbientBackground';
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

  const handleGenerate = () => {
    if (!photo) return;
    setIsGenerating(true);
    setTimeout(() => {
      const posts = Array.from({ length: carousel }, (_, i) => {
        const hue1 = Math.random() * 360;
        const hue2 = hue1 + 60 + Math.random() * 60;
        return `linear-gradient(${Math.random() * 360}deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 40%))`;
      });
      setGeneratedPosts((prev) => [...posts, ...prev]);
      setIsGenerating(false);
      toast(`${carousel} post${carousel > 1 ? 's' : ''} generated!`, 'success');
    }, 2500);
  };

  return (
    <AppShell>
      <div className="relative h-screen flex overflow-hidden" onPaste={handlePaste}>
        {/* Background */}
        <AmbientBackground planet="mars" intensity={0.6} />

        {/* ═══ LEFT PANEL — Config ═══ */}
        <div className="w-[340px] min-w-[340px] h-full border-r border-border/40 bg-[#111113] flex flex-col z-10 overflow-y-auto">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center border border-accent/15 shadow-glow-accent">
              <ImageIcon size={16} className="text-accent" />
            </div>
            <div>
              <h1 className="text-[16px] font-bold text-text-primary tracking-tight">Post Studio</h1>
              <p className="text-[10px] text-text-tertiary">Create stunning social media posts</p>
            </div>
          </div>

          <div className="px-4 py-4 flex-1 flex flex-col">
            {/* Mode indicator */}
            <div className="flex items-center mb-5">
              <div className="flex items-center bg-surface rounded-xl p-1 w-full">
                <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-accent/15 text-accent text-[12px] font-medium shadow-sm">
                  <ImageIcon size={13} />
                  Photo Only
                </div>
              </div>
            </div>

            {/* 1. YOUR PHOTO */}
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-text-primary tracking-wide mb-2.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent">1</span>
                YOUR PHOTO
              </h2>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              {photo ? (
                <div className="relative rounded-xl border border-border/60 overflow-hidden group">
                  <img src={photo} alt="Selected" className="w-full aspect-[4/5] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <X size={12} />
                  </button>
                  <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Upload size={10} /> Change
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent/30 hover:bg-accent/[0.02] transition-all min-h-[180px]"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center">
                    <Plus size={18} className="text-text-tertiary" />
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-medium text-text-secondary">Select Photo</p>
                    <p className="text-[10px] text-text-tertiary mt-1">
                      drop, click, or paste <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[8px]">Ctrl+V</kbd>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. CONFIGURATION */}
            <div className="mb-5">
              <h2 className="text-[12px] font-bold text-text-primary tracking-wide mb-2.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent">2</span>
                CONFIGURATION
              </h2>

              {/* Quality */}
              <div className="rounded-xl border border-border/50 bg-[#1a1a1e] p-3 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-text-primary">Quality</span>
                  <div className="flex items-center gap-1">
                    {(['2K', '4K'] as const).map((q) => (
                      <button key={q} onClick={() => setQuality(q)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${quality === q ? 'bg-accent/15 text-accent border-accent/25' : 'bg-surface/50 text-text-tertiary border-border/30 hover:text-text-secondary'}`}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="rounded-xl border border-border/50 bg-[#1a1a1e] p-3 mb-2">
                <span className="text-[11px] font-medium text-text-primary mb-2 block">Aspect Ratio</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {aspects.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAspect(a.id)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all border ${
                        aspect === a.id
                          ? 'bg-accent/10 border-accent/25 text-text-primary'
                          : 'bg-surface/30 border-border/30 text-text-secondary hover:border-border hover:text-text-primary'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${aspect === a.id ? 'bg-accent/20 text-accent' : 'bg-surface text-text-tertiary'}`}>
                        {aspect === a.id ? <Check size={8} /> : a.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold">{a.label}</p>
                        <p className="text-[8px] text-text-tertiary">{a.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carousel Count */}
              <div className="rounded-xl border border-border/50 bg-[#1a1a1e] p-3 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-text-primary">Carousel Images</span>
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-bold text-accent bg-accent/10 border border-accent/15">BETA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setCarousel((c) => Math.max(1, c - 1))} className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary transition-all">
                      <Minus size={10} />
                    </button>
                    <span className="text-[13px] font-bold text-text-primary w-5 text-center">{carousel}</span>
                    <button onClick={() => setCarousel((c) => Math.min(10, c + 1))} className="w-6 h-6 rounded-md bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary transition-all">
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="rounded-xl border border-border/50 bg-[#1a1a1e] p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-secondary">Cost</span>
                  <span className="flex items-center gap-1 text-[12px] font-bold text-accent">
                    <Zap size={11} className="text-amber-400" />
                    {totalCost} Credits
                  </span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              disabled={!photo || isGenerating}
              onClick={handleGenerate}
              className={`w-full py-3.5 rounded-xl text-[14px] font-extrabold uppercase tracking-wider transition-all mt-auto ${
                !photo || isGenerating
                  ? 'bg-surface border border-border text-text-tertiary cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent to-purple-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent/30'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  GENERATING...
                </span>
              ) : 'GENERATE POST'}
            </button>
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Gallery ═══ */}
        <div className="flex-1 h-full z-10 flex flex-col overflow-hidden">
          {/* Gallery Header */}
          <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between shrink-0 bg-bg-primary/50 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[14px] font-bold text-text-primary">Your Creations</h2>
              {generatedPosts.length > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-semibold border border-accent/15">
                  {generatedPosts.length}
                </span>
              )}
            </div>
            {generatedPosts.length > 0 && (
              <button
                onClick={() => { setGeneratedPosts([]); toast('Gallery cleared', 'info'); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] text-text-tertiary hover:text-text-secondary border border-border/30 hover:border-border transition-all"
              >
                <X size={10} />
                Clear
              </button>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 overflow-y-auto p-5">
            {generatedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface/50 border border-border/30 flex items-center justify-center">
                  <ImageIcon size={24} className="text-text-tertiary" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-text-secondary mb-1">No creations yet</p>
                  <p className="text-[12px] text-text-tertiary max-w-[260px]">
                    Upload a photo and click Generate to create stunning social media posts
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {generatedPosts.map((gradient, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-border/40 group relative cursor-pointer hover:border-border transition-all">
                    <div className="aspect-[4/5]" style={{ background: gradient }} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => toast('Post downloaded!', 'success')}
                        className="p-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => toast('Post shared!', 'info')}
                        className="p-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all"
                      >
                        <Upload size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/40 text-[9px] text-white/60 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                      Post #{generatedPosts.length - i}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
