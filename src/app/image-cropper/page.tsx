'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { useToast } from '@/components/ToastProvider';
import {
  Crop, Upload, RotateCw, FlipHorizontal, FlipVertical,
  ZoomIn, Download, X, Check, Square, Smartphone,
  Monitor, Image as ImageIcon, Maximize,
} from 'lucide-react';

const presets = [
  { id: 'free', label: 'Free', icon: <Maximize size={12} />, ratio: null },
  { id: '1:1', label: '1:1', icon: <Square size={12} />, ratio: 1 },
  { id: '4:5', label: '4:5', icon: <Smartphone size={12} />, ratio: 4 / 5 },
  { id: '9:16', label: '9:16', icon: <Smartphone size={12} />, ratio: 9 / 16 },
  { id: '16:9', label: '16:9', icon: <Monitor size={12} />, ratio: 16 / 9 },
  { id: '4:3', label: '4:3', icon: <Monitor size={12} />, ratio: 4 / 3 },
];

const formats = ['PNG', 'JPEG', 'WebP'];

export default function ImageCropperPage() {
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [preset, setPreset] = useState('free');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [format, setFormat] = useState('PNG');
  const [dragging, setDragging] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [dragMode, setDragMode] = useState<null | 'move' | 'nw' | 'ne' | 'sw' | 'se'>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      const img = new window.Image();
      img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
      setCropArea({ x: 10, y: 10, w: 80, h: 80 });
      setRotation(0); setFlipH(false); setFlipV(false); setZoom(100);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImage(url);
      const img = new window.Image();
      img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = url;
      setCropArea({ x: 10, y: 10, w: 80, h: 80 });
    }
  };

  // Apply preset ratio
  useEffect(() => {
    const p = presets.find((pr) => pr.id === preset);
    if (p?.ratio && image) {
      const ratio = p.ratio;
      let w = 70, h = w / ratio;
      if (h > 80) { h = 80; w = h * ratio; }
      setCropArea({ x: (100 - w) / 2, y: (100 - h) / 2, w, h });
    }
  }, [preset, image]);

  // Drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent, mode: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault(); e.stopPropagation();
    setDragMode(mode);
    setDragStart({ x: e.clientX, y: e.clientY, cx: cropArea.x, cy: cropArea.y, cw: cropArea.w, ch: cropArea.h });
  }, [cropArea]);

  useEffect(() => {
    if (!dragMode) return;
    const onMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

      if (dragMode === 'move') {
        const nx = Math.max(0, Math.min(100 - dragStart.cw, dragStart.cx + dx));
        const ny = Math.max(0, Math.min(100 - dragStart.ch, dragStart.cy + dy));
        setCropArea((p) => ({ ...p, x: nx, y: ny }));
      } else {
        let { cx, cy, cw, ch } = dragStart;
        if (dragMode.includes('e')) cw = Math.max(5, cw + dx);
        if (dragMode.includes('w')) { cx = cx + dx; cw = Math.max(5, cw - dx); }
        if (dragMode.includes('s')) ch = Math.max(5, ch + dy);
        if (dragMode.includes('n')) { cy = cy + dy; ch = Math.max(5, ch - dy); }
        cx = Math.max(0, cx); cy = Math.max(0, cy);
        if (cx + cw > 100) cw = 100 - cx;
        if (cy + ch > 100) ch = 100 - cy;
        setCropArea({ x: cx, y: cy, w: cw, h: ch });
      }
    };
    const onUp = () => setDragMode(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragMode, dragStart]);

  const cropW = Math.round(imgSize.w * cropArea.w / 100);
  const cropH = Math.round(imgSize.h * cropArea.h / 100);

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] right-[30%] w-[500px] h-[400px] rounded-full animate-glow-pulse" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-8 py-5 flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-accent/10 flex items-center justify-center border border-cyan-500/15"><Crop size={18} className="text-cyan-400" /></div>
              <div>
                <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Image Cropper</h1>
                <p className="text-[12px] text-text-tertiary">Crop, rotate, and export your images</p>
              </div>
            </div>
            {image && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-tertiary">{cropW} × {cropH}px</span>
                <button
                  onClick={() => toast(`Exported as ${format} (${cropW}×${cropH}px)`, 'success')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.97] shadow-glow-accent"
                ><Download size={14} />Export {format}</button>
              </div>
            )}
          </div>

          {!image ? (
            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <div
                className={`w-full max-w-[600px] rounded-2xl border-2 border-dashed p-16 flex flex-col items-center gap-5 cursor-pointer animate-slide-up transition-all ${dragging ? 'border-cyan-400 bg-cyan-500/5' : 'border-border/40 bg-surface/20 hover:border-cyan-400/30'}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-accent/10 border border-cyan-500/15 flex items-center justify-center">
                  <Crop size={32} className="text-cyan-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-[18px] font-bold text-text-primary mb-2">Drop an image to crop</h2>
                  <p className="text-[13px] text-text-secondary">Click or drag & drop</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden px-8 pb-6 gap-5 animate-fade-in">
              {/* Canvas */}
              <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-[#0d0d0d] relative" ref={canvasRef}>
                <div className="relative" style={{ transform: `scale(${zoom/100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`, transition: 'transform 0.3s ease' }}>
                  <img src={image} alt="Crop target" className="max-w-full max-h-[65vh] select-none pointer-events-none" draggable={false} />
                  {/* Overlay */}
                  <div className="absolute inset-0">
                    {/* Darkened areas */}
                    <div className="absolute inset-0 bg-black/50" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${cropArea.x}% ${cropArea.y}%, ${cropArea.x}% ${cropArea.y+cropArea.h}%, ${cropArea.x+cropArea.w}% ${cropArea.y+cropArea.h}%, ${cropArea.x+cropArea.w}% ${cropArea.y}%, ${cropArea.x}% ${cropArea.y}%)` }} />
                    {/* Crop box */}
                    <div
                      className="absolute border-2 border-white/80 cursor-move"
                      style={{ left: `${cropArea.x}%`, top: `${cropArea.y}%`, width: `${cropArea.w}%`, height: `${cropArea.h}%` }}
                      onMouseDown={(e) => onMouseDown(e, 'move')}
                    >
                      {/* Grid lines */}
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px) 33.33% 0 / 33.33% 100%, linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px) 0 33.33% / 100% 33.33%' }} />
                      {/* Corner handles */}
                      {(['nw','ne','sw','se'] as const).map((c) => (
                        <div key={c} className={`absolute w-3 h-3 bg-white rounded-sm shadow-md ${c === 'nw' ? '-top-1.5 -left-1.5 cursor-nw-resize' : c === 'ne' ? '-top-1.5 -right-1.5 cursor-ne-resize' : c === 'sw' ? '-bottom-1.5 -left-1.5 cursor-sw-resize' : '-bottom-1.5 -right-1.5 cursor-se-resize'}`}
                          onMouseDown={(e) => onMouseDown(e, c)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="w-[240px] shrink-0 flex flex-col gap-4 overflow-y-auto">
                {/* Aspect Ratio */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4">
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -mt-4 mb-3 -mx-4" style={{ width: 'calc(100% + 2rem)' }} />
                  <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Aspect Ratio</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {presets.map((p) => (
                      <button key={p.id} onClick={() => setPreset(p.id)} className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all ${preset === p.id ? 'bg-accent/15 text-accent border border-accent/20' : 'bg-surface/50 text-text-tertiary border border-border/30 hover:text-text-secondary hover:border-border'}`}>
                        {p.icon}<span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4">
                  <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Transform</p>
                  {/* Rotation */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-text-secondary flex items-center gap-1"><RotateCw size={10} />Rotation</span>
                      <span className="text-[10px] text-accent font-medium">{rotation}°</span>
                    </div>
                    <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-accent h-1" />
                  </div>
                  {/* Flip */}
                  <div className="flex gap-2">
                    <button onClick={() => setFlipH(!flipH)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-medium border transition-all ${flipH ? 'bg-accent/15 text-accent border-accent/20' : 'bg-surface/50 text-text-tertiary border-border/30 hover:text-text-secondary'}`}><FlipHorizontal size={12} />Flip H</button>
                    <button onClick={() => setFlipV(!flipV)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-medium border transition-all ${flipV ? 'bg-accent/15 text-accent border-accent/20' : 'bg-surface/50 text-text-tertiary border-border/30 hover:text-text-secondary'}`}><FlipVertical size={12} />Flip V</button>
                  </div>
                </div>

                {/* Zoom */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1"><ZoomIn size={10} />Zoom</span>
                    <span className="text-[10px] text-accent font-medium">{zoom}%</span>
                  </div>
                  <input type="range" min={50} max={200} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-accent h-1" />
                </div>

                {/* Export */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] p-4">
                  <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Export Format</p>
                  <div className="flex gap-1.5">
                    {formats.map((f) => (
                      <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-2 rounded-lg text-[10px] font-medium border transition-all ${format === f ? 'bg-accent/15 text-accent border-accent/20' : 'bg-surface/50 text-text-tertiary border-border/30 hover:text-text-secondary'}`}>{f}</button>
                    ))}
                  </div>
                </div>

                {/* Change image */}
                <button onClick={() => { setImage(null); }} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/40 text-[11px] text-text-tertiary hover:text-text-secondary hover:border-border transition-all"><X size={12} />Change Image</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
