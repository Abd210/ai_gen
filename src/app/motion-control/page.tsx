'use client';

import React, { useState, useRef, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import {
  Joystick, Play, Image as ImageIcon, Film, ChevronDown,
  Upload, X, Sparkles, Move, MoveHorizontal, ArrowUpRight,
  ArrowDownRight, RotateCw, Orbit, Focus, Maximize2,
  SlidersHorizontal, Eye, Clock, Square, Heart, Info,
  Plus, Repeat, ArrowRight, Layers, Camera, Axis3D,
  Cpu, Gauge,
} from 'lucide-react';
import { videoModels, VideoModel } from '@/data/video-models';

// ─── Motion Presets ─────────────────────────────────
const cameraMotions = [
  { id: 'pan-left', label: 'Pan Left', icon: <MoveHorizontal size={16} />, intensity: 'medium' },
  { id: 'pan-right', label: 'Pan Right', icon: <MoveHorizontal size={16} className="scale-x-[-1]" />, intensity: 'medium' },
  { id: 'tilt-up', label: 'Tilt Up', icon: <ArrowUpRight size={16} />, intensity: 'medium' },
  { id: 'tilt-down', label: 'Tilt Down', icon: <ArrowDownRight size={16} />, intensity: 'medium' },
  { id: 'zoom-in', label: 'Zoom In', icon: <Focus size={16} />, intensity: 'slow' },
  { id: 'zoom-out', label: 'Zoom Out', icon: <Maximize2 size={16} />, intensity: 'slow' },
  { id: 'orbit', label: 'Orbit', icon: <Orbit size={16} />, intensity: 'fast' },
  { id: 'tracking', label: 'Tracking', icon: <Move size={16} />, intensity: 'medium' },
  { id: 'dolly', label: 'Dolly In', icon: <ArrowRight size={16} />, intensity: 'slow' },
  { id: 'rotate', label: 'Rotate', icon: <RotateCw size={16} />, intensity: 'fast' },
];

const orientations = [
  { id: 'landscape', label: '16:9', desc: 'Landscape' },
  { id: 'portrait', label: '9:16', desc: 'Portrait' },
  { id: 'square', label: '1:1', desc: 'Square' },
];

export default function MotionControlPage() {
  const [motionVideo, setMotionVideo] = useState<string | null>(null);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedMotions, setSelectedMotions] = useState<string[]>(['pan-left']);
  const [sceneControl, setSceneControl] = useState(true);
  const [sceneType, setSceneType] = useState<'video' | 'image'>('video');
  const [orientationType, setOrientationType] = useState<'video' | 'image'>('video');
  const [selectedOrientation, setSelectedOrientation] = useState('landscape');
  const [selectedModel, setSelectedModel] = useState(videoModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [motionIntensity, setMotionIntensity] = useState(50);
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const motionVideoRef = useRef<HTMLInputElement>(null);
  const characterImageRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const toggleMotion = (id: string) => {
    setSelectedMotions((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  // Cost calculation
  const baseCost = 10;
  const qualityMultiplier = quality === '1080p' ? 1.5 : 1;
  const motionMultiplier = selectedMotions.length > 2 ? 1.3 : 1;
  const totalCost = Math.ceil(baseCost * qualityMultiplier * motionMultiplier);

  return (
    <AppShell>
      <div className="relative h-screen flex overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full animate-glow-pulse"
            style={{ background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.05) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full animate-glow-pulse"
            style={{ background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.03) 0%, transparent 70%)', animationDelay: '2s' }}
          />
        </div>

        {/* ═══════════════ LEFT PANEL ═══════════════ */}
        <div className="w-[300px] min-w-[300px] h-full border-r border-border/40 bg-[#111113] flex flex-col z-10 overflow-y-auto">
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15">
              <Joystick size={13} className="text-accent" />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-text-primary leading-tight">Motion Control</h2>
              <p className="text-[9px] text-text-tertiary leading-tight">Camera & character animation</p>
            </div>
          </div>

          {/* ── Upload Cards ─── */}
          <div className="px-3 pt-3 grid grid-cols-2 gap-2">
            {/* Motion Video */}
            <div className="relative group/up">
              <input ref={motionVideoRef} type="file" accept="video/*,image/*" className="hidden" onChange={(e) => handleFileUpload(e, setMotionVideo)} />
              {motionVideo ? (
                <div className="relative rounded-xl border border-border overflow-hidden aspect-[3/4]">
                  <img src={motionVideo} alt="Motion" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[8px] font-medium text-white/80 flex items-center gap-0.5"><Film size={7} /> Motion</span>
                  <button onClick={() => setMotionVideo(null)} className="absolute top-1 right-1 p-0.5 rounded bg-black/50 text-white/70 hover:text-white opacity-0 group-hover/up:opacity-100 transition-all"><X size={8} /></button>
                </div>
              ) : (
                <button onClick={() => motionVideoRef.current?.click()} className="w-full aspect-[3/4] rounded-xl border border-dashed border-border/50 bg-surface/20 flex flex-col items-center justify-center gap-1.5 hover:border-accent/30 hover:bg-accent/3 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                    <Play size={14} className="text-text-tertiary ml-0.5" />
                  </div>
                  <span className="text-[10px] font-medium text-text-secondary">Motion video</span>
                  <span className="text-[8px] text-text-tertiary">Upload source</span>
                </button>
              )}
            </div>

            {/* Character Image */}
            <div className="relative group/up">
              <input ref={characterImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setCharacterImage)} />
              {characterImage ? (
                <div className="relative rounded-xl border border-border overflow-hidden aspect-[3/4]">
                  <img src={characterImage} alt="Character" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[8px] font-medium text-white/80 flex items-center gap-0.5"><ImageIcon size={7} /> Character</span>
                  <button onClick={() => setCharacterImage(null)} className="absolute top-1 right-1 p-0.5 rounded bg-black/50 text-white/70 hover:text-white opacity-0 group-hover/up:opacity-100 transition-all"><X size={8} /></button>
                </div>
              ) : (
                <button onClick={() => characterImageRef.current?.click()} className="w-full aspect-[3/4] rounded-xl border border-dashed border-border/50 bg-surface/20 flex flex-col items-center justify-center gap-1.5 hover:border-accent/30 hover:bg-accent/3 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center">
                    <ImageIcon size={14} className="text-text-tertiary" />
                  </div>
                  <span className="text-[10px] font-medium text-text-secondary">Character image</span>
                  <span className="text-[8px] text-text-tertiary">Upload reference</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Model & Quality Row ─── */}
          <div className="px-3 pt-3 grid grid-cols-2 gap-2">
            {/* Model */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full flex flex-col items-start px-3 py-2 rounded-xl border border-border/50 bg-[#1a1a1e] hover:border-border transition-all"
              >
                <span className="text-[8px] text-text-tertiary uppercase tracking-wider font-semibold">Model</span>
                <span className="text-[12px] text-text-primary font-medium flex items-center gap-1">
                  {selectedModel.name}
                  <ChevronDown size={9} className={`text-text-tertiary transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {showModelDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 w-[220px] bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 py-1 animate-scale-in max-h-[260px] overflow-y-auto">
                    {videoModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedModel(m); setShowModelDropdown(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[11px] transition-all ${
                          selectedModel.id === m.id ? 'bg-accent/8 text-accent' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }`}
                      >
                        <span>{m.icon}</span>
                        <span className="flex-1 font-medium">{m.name}</span>
                        <span className="text-[9px] text-accent flex items-center gap-0.5"><Sparkles size={7} />{m.costPerGeneration}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quality */}
            <button
              onClick={() => setQuality(quality === '720p' ? '1080p' : '720p')}
              className="w-full flex flex-col items-start px-3 py-2 rounded-xl border border-border/50 bg-[#1a1a1e] hover:border-border transition-all"
            >
              <span className="text-[8px] text-text-tertiary uppercase tracking-wider font-semibold">Quality</span>
              <span className={`text-[12px] font-medium ${quality === '1080p' ? 'text-accent' : 'text-text-primary'}`}>
                {quality}
              </span>
            </button>
          </div>

          {/* ── Prompt ─── */}
          <div className="px-3 pt-3">
            <div className="rounded-xl border border-border/50 bg-[#1a1a1e] overflow-hidden">
              <div className="px-3 pt-2 pb-0.5">
                <span className="text-[8px] text-text-tertiary uppercase tracking-wider font-semibold">Prompt</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe background and scene details..."
                rows={3}
                className="w-full px-3 pb-2.5 bg-transparent text-[12px] text-text-primary placeholder:text-text-tertiary outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* ── Scene Control ─── */}
          <div className="px-3 pt-3">
            <div className="rounded-xl border border-border/50 bg-[#1a1a1e] px-3 py-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-text-primary">Scene control</span>
                <div
                  className={`w-8 h-[18px] rounded-full relative transition-all duration-200 cursor-pointer ${sceneControl ? 'bg-accent' : 'bg-surface-active'}`}
                  onClick={() => setSceneControl(!sceneControl)}
                >
                  <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all duration-200 ${sceneControl ? 'left-[14px]' : 'left-[2px]'}`} />
                </div>
              </div>
              {sceneControl && (
                <div className="flex items-center bg-surface rounded-lg p-0.5">
                  <button
                    onClick={() => setSceneType('video')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                      sceneType === 'video' ? 'bg-accent/15 text-accent' : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                  >
                    <Film size={10} /> Video
                  </button>
                  <button
                    onClick={() => setSceneType('image')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                      sceneType === 'image' ? 'bg-accent/15 text-accent' : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                  >
                    <ImageIcon size={10} /> Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Orientation ─── */}
          <div className="px-3 pt-2">
            <div className="rounded-xl border border-border/50 bg-[#1a1a1e] px-3 py-2.5">
              <span className="text-[11px] font-medium text-text-primary block mb-2">Orientation</span>
              <div className="flex items-center bg-surface rounded-lg p-0.5">
                <button
                  onClick={() => setOrientationType('video')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                    orientationType === 'video' ? 'bg-accent/15 text-accent' : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <Film size={10} /> Video
                </button>
                <button
                  onClick={() => setOrientationType('image')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                    orientationType === 'image' ? 'bg-accent/15 text-accent' : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <ImageIcon size={10} /> Image
                </button>
              </div>
            </div>
          </div>

          {/* ── Motion Intensity Slider ─── */}
          <div className="px-3 pt-2">
            <div className="rounded-xl border border-border/50 bg-[#1a1a1e] px-3 py-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-text-primary">Motion Intensity</span>
                <span className="text-[10px] text-accent font-semibold">{motionIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={motionIntensity}
                onChange={(e) => setMotionIntensity(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${motionIntensity}%, #2a2a2a ${motionIntensity}%, #2a2a2a 100%)`,
                }}
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-[8px] text-text-tertiary">Subtle</span>
                <span className="text-[8px] text-text-tertiary">Dramatic</span>
              </div>
            </div>
          </div>

          {/* ── Duration ─── */}
          <div className="px-3 pt-2">
            <div className="rounded-xl border border-border/50 bg-[#1a1a1e] px-3 py-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-text-primary flex items-center gap-1"><Clock size={10} /> Duration</span>
                <span className="text-[10px] text-accent font-semibold">{duration}s</span>
              </div>
              <div className="flex items-center gap-1">
                {[3, 5, 8, 10].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-medium transition-all ${
                      duration === d
                        ? 'bg-accent/15 text-accent border border-accent/25'
                        : 'bg-surface text-text-tertiary border border-border/30 hover:border-border hover:text-text-secondary'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Generate Button ─── */}
          <div className="px-3 pt-3 pb-4 mt-auto">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all active:scale-[0.98] ${
                isGenerating
                  ? 'bg-accent/30 text-white/50 cursor-wait'
                  : 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                  <Sparkles size={14} />
                  <span className="text-white/70">{totalCost}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ═══════════════ RIGHT PANEL ═══════════════ */}
        <div className="flex-1 flex flex-col h-full z-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/40 bg-[#0d0d0f]/80 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-[13px] font-semibold text-text-primary">Camera Motions</h3>
              <span className="text-[10px] text-accent bg-accent/8 px-2 py-0.5 rounded-md border border-accent/15">
                {selectedMotions.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-tertiary flex items-center gap-1">
                <Gauge size={10} /> {motionIntensity}% intensity
              </span>
              <span className="text-[10px] text-text-tertiary flex items-center gap-1">
                <Clock size={10} /> {duration}s
              </span>
            </div>
          </div>

          {/* Camera Motion Grid */}
          <div className="px-5 pt-4 pb-3">
            <div className="grid grid-cols-5 gap-2">
              {cameraMotions.map((motion) => {
                const isSelected = selectedMotions.includes(motion.id);
                return (
                  <button
                    key={motion.id}
                    onClick={() => toggleMotion(motion.id)}
                    className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-accent/40 bg-accent/8 shadow-sm shadow-accent/10'
                        : 'border-border/40 bg-[#1a1a1e] hover:border-border hover:bg-surface-hover'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected ? 'bg-accent/15 text-accent' : 'bg-surface text-text-tertiary group-hover:text-text-secondary'
                    }`}>
                      {motion.icon}
                    </div>
                    <span className={`text-[10px] font-medium transition-all ${
                      isSelected ? 'text-accent' : 'text-text-secondary'
                    }`}>
                      {motion.label}
                    </span>
                    {isSelected && (
                      <span className="text-[7px] text-accent/60 uppercase tracking-wider">{motion.intensity}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center px-5 pb-5">
            <div className="w-full max-w-[580px] aspect-video rounded-2xl border border-border/40 bg-[#111113] flex items-center justify-center relative overflow-hidden group">
              {/* Grid overlay */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              {/* Crosshair center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-px h-12 bg-accent/10" />
                <div className="absolute w-12 h-px bg-accent/10" />
              </div>

              {/* Motion path preview (example arcs) */}
              {selectedMotions.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  {selectedMotions.includes('pan-left') && (
                    <path d="M 70 50 Q 50 45 30 50" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" fill="none" strokeDasharray="2 2">
                      <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="1s" repeatCount="indefinite" />
                    </path>
                  )}
                  {selectedMotions.includes('pan-right') && (
                    <path d="M 30 50 Q 50 45 70 50" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" fill="none" strokeDasharray="2 2">
                      <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="1s" repeatCount="indefinite" />
                    </path>
                  )}
                  {selectedMotions.includes('orbit') && (
                    <ellipse cx="50" cy="50" rx="25" ry="15" stroke="rgba(168,85,247,0.25)" strokeWidth="0.5" fill="none" strokeDasharray="2 2">
                      <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="2s" repeatCount="indefinite" />
                    </ellipse>
                  )}
                  {selectedMotions.includes('zoom-in') && (
                    <>
                      <line x1="50" y1="20" x2="50" y2="50" stroke="rgba(168,85,247,0.2)" strokeWidth="0.3" strokeDasharray="1 2" />
                      <circle cx="50" cy="50" r="8" stroke="rgba(168,85,247,0.15)" strokeWidth="0.3" fill="none">
                        <animate attributeName="r" values="15;5;15" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  {selectedMotions.includes('rotate') && (
                    <circle cx="50" cy="50" r="20" stroke="rgba(168,85,247,0.2)" strokeWidth="0.4" fill="none" strokeDasharray="3 3">
                      <animate attributeName="stroke-dashoffset" from="0" to="-6" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </svg>
              )}

              {/* Center play / empty state */}
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 z-10">
                  <div className="w-12 h-12 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
                  <span className="text-[12px] text-accent font-medium">Generating motion video...</span>
                  <div className="w-40 h-1 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-surface/60 border border-border/40 flex items-center justify-center group-hover:border-accent/20 transition-all">
                    <Play size={22} className="text-text-tertiary ml-0.5 group-hover:text-accent/40 transition-all" />
                  </div>
                  <span className="text-[12px] text-text-tertiary font-medium">Generations will appear here</span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedMotions.map((id) => {
                      const m = cameraMotions.find((cm) => cm.id === id);
                      return m ? (
                        <span key={id} className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-accent/8 text-accent text-[8px] font-medium border border-accent/15">
                          {m.icon} {m.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Aspect ratio badge */}
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/40 text-[9px] text-white/50 backdrop-blur-sm border border-white/5">
                {orientations.find((o) => o.id === selectedOrientation)?.label || '16:9'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
