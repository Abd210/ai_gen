'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { Generation, GeneratedImage } from '@/data/generations';
import {
  X, Copy, Download, Heart, Share2, Sparkles,
  Info, ChevronDown, Wand2, Maximize, ZoomIn,
  Image as ImageIcon, Video,
} from 'lucide-react';

interface ImageDetailOverlayProps {
  generation: Generation;
  imageIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageDetailOverlay({
  generation,
  imageIndex,
  onClose,
  onPrev,
  onNext,
}: ImageDetailOverlayProps) {
  const image = generation.images[imageIndex];
  const isVideo = generation.type === 'video';
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-[1100px] max-h-[90vh] flex flex-col md:flex-row bg-bg-secondary border border-border rounded-2xl shadow-elevated overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Area */}
          <div className="flex-1 bg-black/40 flex items-center justify-center relative min-w-0 overflow-hidden min-h-[200px] md:min-h-0">
            {/* The generated "image" */}
            <div
              className="w-full h-full min-h-[200px] md:min-h-[500px]"
              style={{
                background: image.gradient,
                aspectRatio: `${image.width}/${image.height}`,
                maxHeight: '85vh',
              }}
            />

            {/* Nav arrows */}
            {generation.images.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  ›
                </button>
              </>
            )}

            {/* Bottom toolbar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-start md:justify-center gap-2 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent overflow-x-auto scrollbar-hide">
              {['Overview', 'Upscale', 'Enhancer', 'Relight', 'Inpaint', 'Angles'].map((tool) => (
                <button
                  key={tool}
                  onClick={() => toast(`${tool} tool activated`, 'info')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  {tool === 'Overview' && <ImageIcon size={11} />}
                  {tool === 'Upscale' && <ZoomIn size={11} />}
                  {tool === 'Enhancer' && <Sparkles size={11} />}
                  {tool === 'Relight' && <Wand2 size={11} />}
                  {tool === 'Inpaint' && <Wand2 size={11} />}
                  {tool === 'Angles' && <Maximize size={11} />}
                  {tool}
                </button>
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white/70 border border-white/10">
              {imageIndex + 1} / {generation.images.length}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-full md:w-[320px] shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-border overflow-y-auto max-h-[40vh] md:max-h-none">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  U
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-primary">You</p>
                  <p className="text-[9px] text-text-tertiary">Author</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface-hover text-text-tertiary hover:text-text-primary transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface text-[11px] font-medium text-text-primary border border-border">
                <Info size={11} />
                Details
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all">
                Comments
              </button>
            </div>

            {/* Prompt Section */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-accent" />
                  <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Prompt</span>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(generation.prompt).catch(() => {}); toast('Prompt copied!', 'success'); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface border border-border text-[10px] font-medium text-text-secondary hover:text-text-primary transition-all"
                >
                  <Copy size={9} />
                  Copy
                </button>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                {generation.prompt}
              </p>
            </div>

            {/* Info Section */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-1.5 mb-3">
                <Info size={11} className="text-text-tertiary" />
                <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Information</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Model', value: generation.model },
                  { label: 'Quality', value: generation.quality },
                  { label: 'Size', value: `${image.width}×${image.height}` },
                  { label: 'Aspect', value: generation.aspectRatio },
                  { label: 'Type', value: isVideo ? 'Video' : 'Image' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-text-tertiary">{item.label}</span>
                    <span className="text-[11px] font-medium text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1.5 mt-3 text-[10px] text-text-tertiary hover:text-text-secondary transition-all">
                See all <ChevronDown size={10} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="px-5 py-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => toast('Opening animator...', 'info')} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover transition-all">
                  <Video size={12} />
                  Animate
                </button>
                <button onClick={() => toast('Published to community!', 'success')} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all">
                  <Share2 size={12} />
                  Publish
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => toast('Opening in editor...', 'info')} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all">
                  <Maximize size={12} />
                  Open in
                </button>
                <button onClick={() => toast('Added as reference', 'success')} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all">
                  <ImageIcon size={12} />
                  Reference
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toast('Image downloaded!', 'success')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all">
                  <Download size={12} />
                  Download
                </button>
                <button
                  onClick={() => { setLiked(!liked); toast(liked ? 'Removed from favorites' : 'Added to favorites!', liked ? 'info' : 'success'); }}
                  className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center transition-all"
                >
                  <Heart size={14} className={liked ? 'text-red-400 fill-red-400' : 'text-text-tertiary hover:text-red-400'} />
                </button>
                <button onClick={() => toast('Share link copied!', 'success')} className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary transition-all">
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
