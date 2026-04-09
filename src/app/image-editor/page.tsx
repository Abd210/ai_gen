'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import AmbientBackground from '@/components/AmbientBackground';
import { useToast } from '@/components/ToastProvider';
import {
  SlidersHorizontal, Upload, X, Download, Check, AlertTriangle,
  Eye, EyeOff, Image as ImageIcon, Video, Trash2, FileText,
  MapPin, Camera as CameraIcon, Calendar, Info,
  Sun, Contrast, Droplets, Thermometer, Palette, Shield,
  Sparkles, ZoomIn, RotateCw, FlipHorizontal, FlipVertical,
  Square, Smartphone, Monitor, Maximize, Crop,
  ShieldOff, CircleDot, Focus, Aperture,
} from 'lucide-react';

// ─── Adjustment Sliders Config ──────────────────────
const adjustments = [
  { id: 'exposure', label: 'Exposure', icon: Sun, min: -100, max: 100, default: 0, filter: 'brightness', unit: '%', convert: (v: number) => 100 + v * 0.5 },
  { id: 'brilliance', label: 'Brilliance', icon: Sparkles, min: -100, max: 100, default: 0, filter: 'contrast', unit: '%', convert: (v: number) => 100 + v * 0.3 },
  { id: 'highlights', label: 'Highlights', icon: Sun, min: -100, max: 100, default: 0, filter: 'brightness', unit: '%', convert: (v: number) => 100 + v * 0.2 },
  { id: 'shadows', label: 'Shadows', icon: CircleDot, min: -100, max: 100, default: 0, filter: 'brightness', unit: '%', convert: (v: number) => 100 + v * 0.15 },
  { id: 'contrast', label: 'Contrast', icon: Contrast, min: -100, max: 100, default: 0, filter: 'contrast', unit: '%', convert: (v: number) => 100 + v * 0.5 },
  { id: 'brightness', label: 'Brightness', icon: Sun, min: -100, max: 100, default: 0, filter: 'brightness', unit: '%', convert: (v: number) => 100 + v * 0.5 },
  { id: 'blackpoint', label: 'Black Point', icon: CircleDot, min: -100, max: 100, default: 0, filter: 'brightness', unit: '%', convert: (v: number) => 100 + v * 0.1 },
  { id: 'saturation', label: 'Saturation', icon: Droplets, min: -100, max: 100, default: 0, filter: 'saturate', unit: '%', convert: (v: number) => 100 + v },
  { id: 'vibrance', label: 'Vibrance', icon: Palette, min: -100, max: 100, default: 0, filter: 'saturate', unit: '%', convert: (v: number) => 100 + v * 0.5 },
  { id: 'warmth', label: 'Warmth', icon: Thermometer, min: -100, max: 100, default: 0, filter: 'sepia', unit: '%', convert: (v: number) => Math.max(0, v * 0.3) },
  { id: 'tint', label: 'Tint', icon: Palette, min: -100, max: 100, default: 0, filter: 'hue-rotate', unit: 'deg', convert: (v: number) => v * 0.5 },
  { id: 'sharpness', label: 'Sharpness', icon: Focus, min: 0, max: 100, default: 0, filter: 'contrast', unit: '%', convert: (v: number) => 100 + v * 0.1 },
  { id: 'definition', label: 'Definition', icon: Aperture, min: 0, max: 100, default: 0, filter: 'contrast', unit: '%', convert: (v: number) => 100 + v * 0.15 },
  { id: 'noisereduction', label: 'Noise Reduction', icon: Shield, min: 0, max: 100, default: 0, filter: 'blur', unit: 'px', convert: (v: number) => v * 0.02 },
  { id: 'vignette', label: 'Vignette', icon: CircleDot, min: 0, max: 100, default: 0, filter: null, unit: '', convert: (v: number) => v },
];

// ─── Crop Presets ───────────────────────────────────
const cropPresets = [
  { id: 'free', label: 'Free', icon: <Maximize size={12} />, ratio: null },
  { id: '1:1', label: '1:1', icon: <Square size={12} />, ratio: 1 },
  { id: '4:5', label: '4:5', icon: <Smartphone size={12} />, ratio: 4 / 5 },
  { id: '9:16', label: '9:16', icon: <Smartphone size={12} />, ratio: 9 / 16 },
  { id: '16:9', label: '16:9', icon: <Monitor size={12} />, ratio: 16 / 9 },
  { id: '4:3', label: '4:3', icon: <Monitor size={12} />, ratio: 4 / 3 },
];

// ─── Metadata Types ──────────────────────────────────
interface MetaField {
  key: string;
  value: string;
  category: 'location' | 'camera' | 'date' | 'software' | 'other';
  sensitive: boolean;
}

function generateFakeMetadata(): MetaField[] {
  return [
    { key: 'GPS Latitude', value: '37.7749° N', category: 'location', sensitive: true },
    { key: 'GPS Longitude', value: '122.4194° W', category: 'location', sensitive: true },
    { key: 'Camera Make', value: 'Apple', category: 'camera', sensitive: false },
    { key: 'Camera Model', value: 'iPhone 15 Pro Max', category: 'camera', sensitive: false },
    { key: 'Date Taken', value: '2026-03-28 14:32:07', category: 'date', sensitive: false },
    { key: 'DateTime Original', value: '2026-03-28T14:32:07+03:00', category: 'date', sensitive: true },
    { key: 'Software', value: 'Adobe Photoshop 2026', category: 'software', sensitive: false },
    { key: 'Lens Model', value: 'iPhone 15 Pro back triple camera', category: 'camera', sensitive: false },
    { key: 'ISO Speed', value: '100', category: 'camera', sensitive: false },
    { key: 'F-Number', value: 'f/1.8', category: 'camera', sensitive: false },
    { key: 'Owner Name', value: 'abd', category: 'other', sensitive: true },
  ];
}

const catIcons: Record<string, React.ReactNode> = {
  location: <MapPin size={10} />, camera: <CameraIcon size={10} />,
  date: <Calendar size={10} />, software: <FileText size={10} />,
  other: <Info size={10} />,
};
const catColors: Record<string, string> = {
  location: 'text-red-400 bg-red-500/10 border-red-500/20',
  camera: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  date: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  software: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  other: 'text-text-tertiary bg-surface/50 border-border/30',
};

type BottomTab = 'adjust' | 'metadata';

export default function ImageEditorPage() {
  const { toast } = useToast();

  // Image state
  const [image, setImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Bottom tab state
  const [activeTab, setActiveTab] = useState<BottomTab>('adjust');

  // ─── Adjust state ───
  const [adjustValues, setAdjustValues] = useState<Record<string, number>>(
    Object.fromEntries(adjustments.map((a) => [a.id, a.default]))
  );
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [cropPreset, setCropPreset] = useState('free');

  // ─── Metadata state ───
  const [metadata, setMetadata] = useState<MetaField[]>(generateFakeMetadata());
  const [metaStatus, setMetaStatus] = useState<'pending' | 'processing' | 'cleaned'>('pending');
  const [sensOnly, setSensOnly] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      resetAll();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      resetAll();
    }
  };

  const resetAll = () => {
    setAdjustValues(Object.fromEntries(adjustments.map((a) => [a.id, a.default])));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setMetadata(generateFakeMetadata());
    setMetaStatus('pending');
  };

  const handleCleanMeta = () => {
    setMetaStatus('processing');
    setTimeout(() => {
      setMetaStatus('cleaned');
      setMetadata([]);
      toast('All metadata stripped successfully', 'success');
    }, 1500);
  };

  // Build CSS filter string from adjustment values
  const buildFilter = () => {
    const parts: string[] = [];
    // Combine brightness-affecting sliders
    const brightnessTotal = 100
      + adjustValues.exposure * 0.5
      + adjustValues.highlights * 0.2
      + adjustValues.shadows * 0.15
      + adjustValues.brightness * 0.5
      + adjustValues.blackpoint * 0.1;
    parts.push(`brightness(${brightnessTotal}%)`);
    // Contrast
    const contrastTotal = 100 + adjustValues.brilliance * 0.3 + adjustValues.contrast * 0.5 + adjustValues.sharpness * 0.1 + adjustValues.definition * 0.15;
    parts.push(`contrast(${contrastTotal}%)`);
    // Saturation
    const satTotal = 100 + adjustValues.saturation + adjustValues.vibrance * 0.5;
    parts.push(`saturate(${satTotal}%)`);
    // Warmth (sepia)
    if (adjustValues.warmth > 0) parts.push(`sepia(${adjustValues.warmth * 0.3}%)`);
    // Tint (hue-rotate)
    if (adjustValues.tint !== 0) parts.push(`hue-rotate(${adjustValues.tint * 0.5}deg)`);
    // Noise reduction (blur)
    if (adjustValues.noisereduction > 0) parts.push(`blur(${adjustValues.noisereduction * 0.02}px)`);
    return parts.join(' ');
  };

  const vignetteOpacity = (adjustValues.vignette || 0) / 100;

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Background */}
        <AmbientBackground planet="venus" intensity={0.5} />

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-8 py-5 flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/15">
                <SlidersHorizontal size={18} className="text-accent" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Image Editor</h1>
                <p className="text-[12px] text-text-tertiary">Adjust, crop, and clean your images</p>
              </div>
            </div>
            {image && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast('Image exported successfully', 'success')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.97] shadow-glow-accent"
                >
                  <Download size={14} />Export
                </button>
                <button
                  onClick={() => { setImage(null); resetAll(); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/40 text-[12px] text-text-tertiary hover:text-text-secondary hover:border-border transition-all"
                >
                  <X size={12} />Change
                </button>
              </div>
            )}
          </div>

          {!image ? (
            /* ─── Upload Area ─── */
            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <div
                className={`w-full max-w-[600px] rounded-2xl border-2 border-dashed p-16 flex flex-col items-center gap-5 cursor-pointer animate-slide-up transition-all ${
                  dragging ? 'border-accent bg-accent/5' : 'border-border/40 bg-surface/20 hover:border-accent/30'
                }`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/15 flex items-center justify-center">
                    <SlidersHorizontal size={32} className="text-accent" />
                  </div>
                  <div className="absolute -inset-2 rounded-2xl border border-accent/10 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                <div className="text-center">
                  <h2 className="text-[18px] font-bold text-text-primary mb-2">Drop an image to edit</h2>
                  <p className="text-[13px] text-text-secondary">Click or drag & drop • Adjust, crop, or remove metadata</p>
                </div>
              </div>
            </div>
          ) : (
            /* ─── Editor Main Area ─── */
            <div className="flex-1 flex overflow-hidden px-6 pb-4 gap-5 animate-fade-in">
              {/* ── Image Preview (Center) ── */}
              <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-[#0d0d0d] relative">
                <div
                  className="relative transition-transform duration-300"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    filter: buildFilter(),
                  }}
                >
                  <img src={image} alt="Edit target" className="max-w-full max-h-[60vh] select-none" draggable={false} />
                  {/* Vignette overlay */}
                  {vignetteOpacity > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity * 0.7}) 100%)`,
                      }}
                    />
                  )}
                </div>

                {/* Quick transform controls floating */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <button onClick={() => setRotation((r) => r - 90)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all" title="Rotate left">
                    <RotateCw size={14} className="scale-x-[-1]" />
                  </button>
                  <button onClick={() => setRotation((r) => r + 90)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all" title="Rotate right">
                    <RotateCw size={14} />
                  </button>
                  <div className="w-px h-4 bg-white/15" />
                  <button onClick={() => setFlipH(!flipH)} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${flipH ? 'text-accent' : 'text-white/70 hover:text-white'}`} title="Flip H">
                    <FlipHorizontal size={14} />
                  </button>
                  <button onClick={() => setFlipV(!flipV)} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${flipV ? 'text-accent' : 'text-white/70 hover:text-white'}`} title="Flip V">
                    <FlipVertical size={14} />
                  </button>
                  <div className="w-px h-4 bg-white/15" />
                  <button
                    onClick={() => { resetAll(); toast('Adjustments reset', 'info'); }}
                    className="px-2 py-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white text-[9px] font-medium transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ── Right Controls Panel ── */}
              <div className="w-[280px] shrink-0 flex flex-col overflow-hidden">
                {/* Tab Switcher */}
                <div className="flex items-center bg-surface rounded-xl p-1 mb-4">
                  <button
                    onClick={() => setActiveTab('adjust')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                      activeTab === 'adjust'
                        ? 'bg-accent/15 text-accent shadow-sm'
                        : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                  >
                    <SlidersHorizontal size={13} />
                    Adjust Image
                  </button>
                  <button
                    onClick={() => setActiveTab('metadata')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                      activeTab === 'metadata'
                        ? 'bg-accent/15 text-accent shadow-sm'
                        : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                  >
                    <ShieldOff size={13} />
                    Remove Metadata
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {activeTab === 'adjust' ? (
                    /* ─── ADJUST IMAGE TAB ─── */
                    <div className="space-y-2">
                      {adjustments.map((adj) => {
                        const Icon = adj.icon;
                        const val = adjustValues[adj.id];
                        const isModified = val !== adj.default;
                        return (
                          <div
                            key={adj.id}
                            className={`rounded-xl border px-3 py-2.5 transition-all ${
                              isModified
                                ? 'border-accent/20 bg-accent/[0.03]'
                                : 'border-border/30 bg-[#1a1a1e]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] text-text-secondary flex items-center gap-1.5 font-medium">
                                <Icon size={11} className={isModified ? 'text-accent' : 'text-text-tertiary'} />
                                {adj.label}
                              </span>
                              <span className={`text-[10px] font-semibold ${isModified ? 'text-accent' : 'text-text-tertiary'}`}>
                                {val > 0 ? '+' : ''}{val}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={adj.min}
                              max={adj.max}
                              value={val}
                              onChange={(e) => setAdjustValues((prev) => ({ ...prev, [adj.id]: Number(e.target.value) }))}
                              className="w-full h-1 rounded-full appearance-none cursor-pointer"
                              style={{
                                background: adj.min < 0
                                  ? `linear-gradient(to right, #2a2a2a 0%, #2a2a2a ${((0 - adj.min) / (adj.max - adj.min)) * 100}%, #a855f7 ${((0 - adj.min) / (adj.max - adj.min)) * 100}%, #a855f7 ${((val - adj.min) / (adj.max - adj.min)) * 100}%, #2a2a2a ${((val - adj.min) / (adj.max - adj.min)) * 100}%, #2a2a2a 100%)`
                                  : `linear-gradient(to right, #a855f7 0%, #a855f7 ${((val - adj.min) / (adj.max - adj.min)) * 100}%, #2a2a2a ${((val - adj.min) / (adj.max - adj.min)) * 100}%, #2a2a2a 100%)`,
                              }}
                            />
                          </div>
                        );
                      })}

                      {/* Crop Section */}
                      <div className="rounded-xl border border-border/30 bg-[#1a1a1e] p-3 mt-3">
                        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">Crop Preset</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {cropPresets.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setCropPreset(p.id)}
                              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all border ${
                                cropPreset === p.id
                                  ? 'bg-accent/15 text-accent border-accent/20'
                                  : 'bg-surface/50 text-text-tertiary border-border/30 hover:text-text-secondary'
                              }`}
                            >
                              {p.icon}
                              <span>{p.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ─── REMOVE METADATA TAB ─── */
                    <div>
                      {metaStatus === 'cleaned' ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12">
                          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Check size={24} className="text-green-400" />
                          </div>
                          <p className="text-[14px] font-semibold text-green-400">All Clean!</p>
                          <p className="text-[12px] text-text-tertiary max-w-[220px] text-center">
                            All metadata stripped. Safe to share.
                          </p>
                        </div>
                      ) : metaStatus === 'processing' ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12">
                          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse">
                            <ShieldOff size={24} className="text-accent" />
                          </div>
                          <p className="text-[14px] font-semibold text-accent">Stripping metadata...</p>
                        </div>
                      ) : (
                        <>
                          {/* Strip button */}
                          <button
                            onClick={handleCleanMeta}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-[12px] font-semibold hover:bg-red-500/25 transition-all mb-4"
                          >
                            <Trash2 size={14} />
                            Strip All Metadata ({metadata.length} fields)
                          </button>

                          {/* Filter */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                              Detected ({metadata.length})
                            </span>
                            <button
                              onClick={() => setSensOnly(!sensOnly)}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                                sensOnly
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : 'bg-surface border border-border text-text-tertiary'
                              }`}
                            >
                              {sensOnly ? <EyeOff size={10} /> : <Eye size={10} />}
                              {sensOnly ? 'Sensitive' : 'All'}
                            </button>
                          </div>

                          {/* Metadata fields */}
                          <div className="space-y-1.5">
                            {metadata
                              .filter((m) => !sensOnly || m.sensitive)
                              .map((m, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                                    m.sensitive
                                      ? 'border-red-500/15 bg-red-500/[0.03]'
                                      : 'border-border/30 bg-surface/20'
                                  }`}
                                >
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${catColors[m.category]}`}>
                                    {catIcons[m.category]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-medium text-text-secondary">{m.key}</p>
                                    <p className="text-[10px] text-text-tertiary truncate">{m.value}</p>
                                  </div>
                                  {m.sensitive && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 shrink-0">
                                      SENSITIVE
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
