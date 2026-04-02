'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DurationDropdownProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  onClose: () => void;
}

export default function DurationDropdown({ min, max, step, value, onChange, onClose }: DurationDropdownProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const range = max - min;
  const percent = range > 0 ? ((value - min) / range) * 100 : 0;

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || range === 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const raw = min + (x / rect.width) * range;
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.max(min, Math.min(max, stepped));
      onChange(clamped);
    },
    [min, max, step, range, onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDragging(true);
      updateValue(e.clientX);
    },
    [updateValue]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX);
    };
    const handleMouseUp = () => {
      setDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, updateValue]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-[220px] bg-bg-secondary border border-border rounded-2xl shadow-dropdown z-50 animate-scale-in overflow-hidden">
        {/* Title */}
        <div className="px-4 py-3 border-b border-border">
          <span className="text-[13px] font-medium text-text-primary">Choose duration</span>
        </div>

        {/* Duration display + slider */}
        <div className="px-4 pt-4 pb-5">
          {/* Current value + track  */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-surface border border-border rounded-lg px-3 py-2">
              <span className="text-[14px] font-semibold text-text-primary">{value}s</span>
            </div>
            <div
              ref={trackRef}
              className="flex-1 h-2 bg-surface rounded-full relative cursor-pointer touch-none"
              onMouseDown={handleMouseDown}
            >
              {/* Filled portion */}
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-accent transition-[width] duration-75"
                style={{ width: `${percent}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-accent shadow-sm transition-[left] duration-75 cursor-grab active:cursor-grabbing"
                style={{ left: `calc(${percent}% - 8px)` }}
              />
            </div>
          </div>

          {/* Min / Max labels */}
          <div className="flex items-center justify-between text-[10px] text-text-tertiary px-1">
            <span>{min}s</span>
            <span>{max}s</span>
          </div>
        </div>
      </div>
    </>
  );
}
