'use client';

import React, { useState, useRef, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { useToast } from '@/components/ToastProvider';
import {
  ShieldOff, Upload, X, Download, MapPin, Camera as CameraIcon,
  Calendar, Info, Sparkles, Check, AlertTriangle, Eye, EyeOff,
  Image as ImageIcon, Video, Trash2, FileText,
} from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  status: 'pending' | 'cleaned' | 'processing';
  metadata: MetaField[];
  originalSize: number;
  cleanedSize?: number;
}

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

const fmt = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b/1024).toFixed(1)} KB` : `${(b/1048576).toFixed(1)} MB`;

export default function RemoveMetaPage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sensOnly, setSensOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fl: FileList) => {
    const nf: FileItem[] = Array.from(fl)
      .filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
      .map((f) => ({
        id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file: f, preview: URL.createObjectURL(f),
        type: (f.type.startsWith('image/') ? 'image' : 'video') as 'image' | 'video',
        status: 'pending' as const, metadata: generateFakeMetadata(),
        originalSize: f.size,
      }));
    setFiles((p) => [...p, ...nf]);
    if (nf.length > 0) setSel((s) => s || nf[0].id);
  }, []);

  const clean = (id: string) => {
    setFiles((p) => p.map((f) => f.id === id ? { ...f, status: 'processing' as const } : f));
    setTimeout(() => {
      setFiles((p) => p.map((f) => f.id === id ? { ...f, status: 'cleaned' as const, cleanedSize: Math.floor(f.originalSize * 0.85), metadata: [] } : f));
    }, 1500);
  };

  const remove = (id: string) => {
    setFiles((p) => p.filter((f) => f.id !== id));
    if (sel === id) setSel(null);
  };

  const af = files.find((f) => f.id === sel);
  const pending = files.filter((f) => f.status === 'pending').length;

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[60%] w-[500px] h-[500px] rounded-full animate-glow-pulse" style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.05) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-accent/10 flex items-center justify-center border border-red-500/15"><ShieldOff size={18} className="text-red-400" /></div>
              <div>
                <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Remove Metadata</h1>
                <p className="text-[12px] text-text-tertiary">Strip EXIF, GPS, camera data from your files</p>
              </div>
            </div>
            {pending > 0 && (
              <button onClick={() => files.filter((f) => f.status === 'pending').forEach((f) => clean(f.id))} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-[12px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.97] shadow-glow-accent">
                <ShieldOff size={14} />Clean All ({pending})
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-8 pb-8">
              <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
              <div
                className={`w-full max-w-[700px] rounded-2xl border-2 border-dashed transition-all p-16 flex flex-col items-center gap-5 cursor-pointer animate-slide-up ${dragging ? 'border-accent bg-accent/5' : 'border-border/40 bg-surface/20 hover:border-accent/30'}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/15 to-accent/10 border border-red-500/15 flex items-center justify-center"><ShieldOff size={32} className="text-red-400" /></div>
                  <div className="absolute -inset-2 rounded-2xl border border-accent/10 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                <div className="text-center">
                  <h2 className="text-[18px] font-bold text-text-primary mb-2">Drop your files here</h2>
                  <p className="text-[13px] text-text-secondary">Images & videos — we&apos;ll strip all metadata</p>
                  <p className="text-[11px] text-text-tertiary mt-1">GPS • Camera info • Dates • Personal data</p>
                </div>
                <div className="flex gap-3 mt-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[11px] text-text-secondary"><ImageIcon size={12} />Images</span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-[11px] text-text-secondary"><Video size={12} />Videos</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden px-8 pb-6 gap-5 animate-fade-in">
              {/* File List */}
              <div className="w-[260px] shrink-0 flex flex-col gap-2 overflow-y-auto pr-2">
                <button onClick={() => inputRef.current?.click()} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border/40 bg-surface/20 text-[12px] text-text-secondary hover:border-accent/30 transition-all"><Upload size={14} />Add more</button>
                <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
                {files.map((f) => (
                  <div key={f.id} onClick={() => setSel(f.id)} className={`relative group rounded-xl border overflow-hidden cursor-pointer transition-all ${sel === f.id ? 'border-accent/40 bg-accent/[0.03]' : 'border-border/60 bg-[#1a1a1e] hover:border-border-strong'}`}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-border/30">
                        {f.type === 'image' ? <img src={f.preview} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface flex items-center justify-center"><Video size={14} className="text-text-tertiary" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-primary truncate">{f.file.name}</p>
                        <p className="text-[9px] text-text-tertiary">{fmt(f.originalSize)}</p>
                        {f.status === 'pending' && <span className="flex items-center gap-1 text-[9px] text-amber-400 mt-0.5"><AlertTriangle size={8} />{f.metadata.length} fields</span>}
                        {f.status === 'processing' && <span className="text-[9px] text-accent animate-pulse mt-0.5">Cleaning...</span>}
                        {f.status === 'cleaned' && <span className="flex items-center gap-1 text-[9px] text-green-400 mt-0.5"><Check size={8} />Clean</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); remove(f.id); }} className="p-1 rounded-md text-text-tertiary hover:text-danger opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspector */}
              {af && (
                <div className="flex-1 flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-[#1a1a1e] to-[#141416] overflow-hidden">
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                  <div className="relative h-[180px] shrink-0 bg-bg-primary flex items-center justify-center overflow-hidden border-b border-border/30">
                    {af.type === 'image' ? <img src={af.preview} alt="" className="h-full object-contain" /> : <video src={af.preview} className="h-full object-contain" controls />}
                    {af.status === 'cleaned' && <div className="absolute inset-0 bg-green-500/5 flex items-center justify-center"><div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm"><Check size={16} className="text-green-400" /><span className="text-[13px] font-medium text-green-400">Metadata Removed</span></div></div>}
                  </div>
                  <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{af.file.name}</p>
                      <p className="text-[10px] text-text-tertiary">{fmt(af.originalSize)}{af.cleanedSize && <span className="text-green-400">{' → '}{fmt(af.cleanedSize)}</span>}</p>
                    </div>
                    {af.status === 'pending' && <button onClick={() => clean(af.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-[11px] font-semibold hover:bg-red-500/25 transition-all"><Trash2 size={12} />Strip Metadata</button>}
                    {af.status === 'cleaned' && <button onClick={() => toast(`${af.file.name} downloaded (clean)`, 'success')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover transition-all"><Download size={12} />Download</button>}
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-3">
                    {af.status === 'cleaned' ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"><Check size={24} className="text-green-400" /></div>
                        <p className="text-[14px] font-semibold text-green-400">All Clean!</p>
                        <p className="text-[12px] text-text-tertiary max-w-[280px] text-center">All metadata stripped. Safe to share.</p>
                      </div>
                    ) : af.status === 'processing' ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center animate-pulse"><ShieldOff size={24} className="text-accent" /></div>
                        <p className="text-[14px] font-semibold text-accent">Stripping metadata...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Detected ({af.metadata.length})</span>
                          <button onClick={() => setSensOnly(!sensOnly)} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${sensOnly ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-surface border border-border text-text-tertiary'}`}>
                            {sensOnly ? <EyeOff size={10} /> : <Eye size={10} />}{sensOnly ? 'Sensitive' : 'All'}
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {af.metadata.filter((m) => !sensOnly || m.sensitive).map((m, i) => (
                            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${m.sensitive ? 'border-red-500/15 bg-red-500/[0.03]' : 'border-border/30 bg-surface/20'}`}>
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${catColors[m.category]}`}>{catIcons[m.category]}</div>
                              <div className="flex-1 min-w-0"><p className="text-[11px] font-medium text-text-secondary">{m.key}</p><p className="text-[10px] text-text-tertiary truncate">{m.value}</p></div>
                              {m.sensitive && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 shrink-0">SENSITIVE</span>}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
