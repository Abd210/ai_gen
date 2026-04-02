'use client';

import React, { useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import VideoPromptBar from '@/components/VideoPromptBar';
import UploadCard from '@/components/UploadCard';
import {
  Video, Sparkles, Layers, Wand2, ChevronRight,
  Eye, Image as ImageIcon, PlayCircle, Info,
  Clapperboard, Film, Camera, SlidersHorizontal,
  Upload, X, Check,
} from 'lucide-react';

export default function VideoPage() {
  const [multiShot, setMultiShot] = useState(false);
  const [enhanceOn, setEnhanceOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [startFrame, setStartFrame] = useState<string | null>(null);
  const [endFrame, setEndFrame] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'model' | 'frames' | 'settings' | null>(null);
  const startFrameRef = useRef<HTMLInputElement>(null);
  const endFrameRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setter(url);
    }
  };

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(100, 20, 180, 0.06) 0%, rgba(50, 10, 100, 0.03) 40%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(200, 255, 0, 0.03) 0%, transparent 70%)',
              animationDelay: '2s',
            }}
          />
        </div>

        {/* Main Content — Left-aligned panel, pushed down */}
        <div className="flex-1 relative z-10 overflow-y-auto pb-36 flex flex-col justify-end">
          <div className="max-w-[480px] px-6 pb-4">
            {/* Page Header */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border border-purple-500/15">
                <Video size={14} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-[16px] font-bold text-text-primary leading-tight">Create Video</h1>
                <p className="text-[10px] text-text-tertiary leading-tight">Generate cinematic AI videos</p>
              </div>
            </div>

            {/* ─── Model Card ────────────────────────────────── */}
            <div
              className="relative rounded-xl overflow-hidden mb-3 border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] group cursor-pointer hover:border-border-strong transition-all duration-200"
              onClick={() => setActiveSection(activeSection === 'model' ? null : 'model')}
            >
              {/* Top accent */}
              <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/15 to-transparent border border-purple-500/10 flex items-center justify-center">
                    <Clapperboard size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest leading-tight">General</p>
                    <p className="text-[13px] text-text-primary font-medium leading-tight">Kling 3.0</p>
                  </div>
                </div>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface/80 border border-border text-[10px] font-medium text-accent hover:bg-surface-hover transition-all">
                  <Wand2 size={9} />
                  Change
                </button>
              </div>

              {/* Mini stats */}
              <div className="px-4 pb-3 flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface/50 text-[9px] text-text-tertiary border border-border/30">
                  <Film size={8} /> 5-10s range
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface/50 text-[9px] text-text-tertiary border border-border/30">
                  <Camera size={8} /> 720p / 1080p
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/8 text-[9px] text-accent border border-accent/15">
                  <Sparkles size={8} /> 14 credits
                </span>
              </div>
            </div>

            {/* ─── Frame Uploads ─────────────────────────────── */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Layers size={11} className="text-text-tertiary" />
                <span className="text-[11px] font-medium text-text-secondary">Reference Frames</span>
                <span className="text-[9px] text-text-tertiary bg-surface px-1.5 py-0.5 rounded border border-border/30">Optional</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Start Frame */}
                <div className="relative group/frame">
                  <input
                    ref={startFrameRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setStartFrame)}
                  />
                  {startFrame ? (
                    <div className="relative rounded-xl border border-border overflow-hidden aspect-[4/3]">
                      <img src={startFrame} alt="Start frame" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[9px] font-medium text-white/80">Start frame</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setStartFrame(null); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/50 text-white/70 hover:text-white transition-all opacity-0 group-hover/frame:opacity-100"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startFrameRef.current?.click()}
                      className="w-full aspect-[4/3] rounded-xl border border-dashed border-border/60 bg-surface/30 flex flex-col items-center justify-center gap-1.5 hover:border-border-strong hover:bg-surface-hover/40 transition-all group/btn"
                    >
                      <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center group-hover/btn:border-border-strong transition-all">
                        <ImageIcon size={12} className="text-text-tertiary" />
                      </div>
                      <span className="text-[10px] font-medium text-text-secondary">Start frame</span>
                      <span className="text-[8px] text-text-tertiary">Upload image</span>
                    </button>
                  )}
                </div>

                {/* End Frame */}
                <div className="relative group/frame">
                  <input
                    ref={endFrameRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setEndFrame)}
                  />
                  {endFrame ? (
                    <div className="relative rounded-xl border border-border overflow-hidden aspect-[4/3]">
                      <img src={endFrame} alt="End frame" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[9px] font-medium text-white/80">End frame</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEndFrame(null); }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/50 text-white/70 hover:text-white transition-all opacity-0 group-hover/frame:opacity-100"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => endFrameRef.current?.click()}
                      className="w-full aspect-[4/3] rounded-xl border border-dashed border-border/60 bg-surface/30 flex flex-col items-center justify-center gap-1.5 hover:border-border-strong hover:bg-surface-hover/40 transition-all group/btn"
                    >
                      <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center group-hover/btn:border-border-strong transition-all">
                        <ImageIcon size={12} className="text-text-tertiary" />
                      </div>
                      <span className="text-[10px] font-medium text-text-secondary">End frame</span>
                      <span className="text-[8px] text-text-tertiary">Upload image</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Quick Settings Row ────────────────────────── */}
            <div className="flex flex-col gap-2 mb-3">
              {/* Multi-shot toggle */}
              <div
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-border/60 bg-[#1a1a1e] hover:border-border transition-all cursor-pointer"
                onClick={() => setMultiShot(!multiShot)}
              >
                <div className="flex items-center gap-2">
                  <PlayCircle size={13} className={multiShot ? 'text-accent' : 'text-text-tertiary'} />
                  <span className="text-[12px] text-text-primary font-medium">Multi-shot</span>
                  <div className="relative group/tip">
                    <Info size={10} className="text-text-tertiary cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block z-50">
                      <div className="bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[10px] text-text-secondary whitespace-nowrap shadow-dropdown">
                        Generate multiple shots from a single prompt
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-8 h-[18px] rounded-full relative transition-all duration-200 ${
                    multiShot ? 'bg-accent' : 'bg-surface-active'
                  }`}
                >
                  <div
                    className={`absolute top-[2px] w-[14px] h-[14px] rounded-full shadow-sm transition-all duration-200 ${
                      multiShot ? 'left-[14px] bg-bg-primary' : 'left-[2px] bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Enhance & Sound row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEnhanceOn(!enhanceOn)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-medium transition-all ${
                    enhanceOn
                      ? 'border-accent/25 bg-accent/8 text-accent'
                      : 'border-border/60 bg-[#1a1a1e] text-text-secondary hover:border-border'
                  }`}
                >
                  <Sparkles size={11} />
                  Enhance {enhanceOn ? 'on' : 'off'}
                </button>
                <button
                  onClick={() => setSoundOn(!soundOn)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-medium transition-all ${
                    soundOn
                      ? 'border-purple-500/25 bg-purple-500/8 text-purple-400'
                      : 'border-border/60 bg-[#1a1a1e] text-text-secondary hover:border-border'
                  }`}
                >
                  🔊 Sound {soundOn ? 'on' : 'off'}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-[#1a1a1e] text-text-secondary text-[11px] font-medium hover:border-border transition-all">
                  <SlidersHorizontal size={11} />
                  Elements
                </button>
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="rounded-xl border border-border/60 bg-[#1a1a1e] p-3.5 mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Eye size={10} className="text-text-tertiary" />
                <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">Prompt Preview</span>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                Your prompt will appear here after entering it in the generation bar below...
              </p>
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {enhanceOn && (
                  <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[9px] font-medium flex items-center gap-1 border border-accent/15">
                    <Sparkles size={7} /> Enhanced
                  </span>
                )}
                {soundOn && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[9px] font-medium border border-purple-500/15">
                    🔊 Audio
                  </span>
                )}
                {multiShot && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[9px] font-medium border border-blue-500/15">
                    <PlayCircle size={7} className="inline mr-0.5" /> Multi-shot
                  </span>
                )}
                {startFrame && (
                  <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[9px] font-medium border border-green-500/15">
                    <Check size={7} className="inline mr-0.5" /> Start frame
                  </span>
                )}
                {endFrame && (
                  <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[9px] font-medium border border-green-500/15">
                    <Check size={7} className="inline mr-0.5" /> End frame
                  </span>
                )}
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
