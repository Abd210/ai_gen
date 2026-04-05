'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Generation, GeneratedImage } from '@/data/generations';
import { Info, EyeOff, Play, Sparkles } from 'lucide-react';
import ImageDetailOverlay from './ImageDetailOverlay';

interface FlatImage {
  image: GeneratedImage;
  generation: Generation;
  globalIndex: number;
}

interface GenerationGalleryProps {
  generations: Generation[];
  columns: number;
  onColumnsChange: (cols: number) => void;
}

export default function GenerationGallery({ generations, columns, onColumnsChange }: GenerationGalleryProps) {
  const [selectedGen, setSelectedGen] = useState<Generation | null>(null);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Flatten all images into a single array
  const flatImages: FlatImage[] = [];
  generations.forEach((gen) => {
    gen.images.forEach((img, idx) => {
      flatImages.push({ image: img, generation: gen, globalIndex: flatImages.length });
    });
  });

  if (flatImages.length === 0) return null;

  const openDetail = (gen: Generation, imgIdx: number) => {
    setSelectedGen(gen);
    setSelectedImgIdx(imgIdx);
  };

  const closeDetail = () => {
    setSelectedGen(null);
    setSelectedImgIdx(0);
  };

  const handlePrev = () => {
    if (!selectedGen) return;
    setSelectedImgIdx((i) => (i - 1 + selectedGen.images.length) % selectedGen.images.length);
  };

  const handleNext = () => {
    if (!selectedGen) return;
    setSelectedImgIdx((i) => (i + 1) % selectedGen.images.length);
  };

  // Slider drag logic
  const handleSliderDrag = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // Map 0-1 to 2-6 columns. Left = more columns (smaller), right = fewer columns (bigger)
    const cols = Math.round(6 - pct * 4); // 6 at left, 2 at right
    onColumnsChange(Math.max(2, Math.min(6, cols)));
  }, [onColumnsChange]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    handleSliderDrag(e.clientX);
    const onMove = (ev: MouseEvent) => {
      if (isDragging.current) handleSliderDrag(ev.clientX);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [handleSliderDrag]);

  // Slider position (columns 6=left, 2=right)
  const sliderPct = ((6 - columns) / 4) * 100;

  return (
    <>
      {/* Draggable Column Size Slider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="grid grid-cols-3 gap-[2px]">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-[3px] h-[3px] rounded-[1px] bg-text-tertiary/40" />
            ))}
          </div>
        </div>
        <div
          ref={sliderRef}
          className="relative w-28 h-2 rounded-full bg-surface cursor-pointer select-none"
          onMouseDown={onMouseDown}
        >
          {/* Track fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-accent/60 transition-[width] duration-75"
            style={{ width: `${sliderPct}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-accent border-2 border-bg-primary shadow-md cursor-grab active:cursor-grabbing transition-[left] duration-75"
            style={{ left: `calc(${sliderPct}% - 7px)` }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-text-tertiary/40" />
        </div>
      </div>

      {/* Image Grid — flat continuous flow */}
      <style>{`
        .gen-grid {
          grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
        }
        @media (min-width: 768px) {
          .gen-grid {
            grid-template-columns: repeat(${columns}, 1fr);
          }
        }
      `}</style>
      <div className="gen-grid grid gap-[3px]">
        {flatImages.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          // Find the index of this image within its generation
          const imgIdxInGen = item.generation.images.findIndex((img) => img.id === item.image.id);

          return (
            <div
              key={item.image.id}
              className="relative cursor-pointer group/img overflow-hidden rounded-[4px]"
              style={{ aspectRatio: '1/1' }}
              onClick={() => openDetail(item.generation, imgIdxInGen)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* The generated "image" (gradient placeholder) */}
              <div
                className="absolute inset-0 transition-transform duration-300 group-hover/img:scale-105"
                style={{ background: item.image.gradient }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all duration-200" />

              {/* Prompt tooltip on hover */}
              {isHovered && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                  <p className="text-[9px] text-white/80 line-clamp-2 leading-tight">{item.generation.prompt}</p>
                </div>
              )}

              {/* Video play indicator */}
              {item.generation.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Play size={14} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
              )}

              {/* Action buttons on hover */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-all">
                <button 
                  className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white border border-white/10 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EyeOff size={10} />
                </button>
                <button 
                  className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white border border-white/10 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Overlay */}
      {selectedGen && (
        <ImageDetailOverlay
          generation={selectedGen}
          imageIndex={selectedImgIdx}
          onClose={closeDetail}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
