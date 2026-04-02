'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { QualityOption } from '@/data/models';

interface QualityDropdownProps {
  options: QualityOption[];
  selected: string;
  onSelect: (quality: string) => void;
  onClose: () => void;
}

export default function QualityDropdown({ options, selected, onSelect, onClose }: QualityDropdownProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-[180px] bg-bg-secondary border border-border rounded-2xl shadow-dropdown z-50 animate-scale-in overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-[13px] font-medium text-text-primary">Select quality</span>
        </div>
        <div className="py-1">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => onSelect(option.label)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left transition-all
                ${selected === option.label
                  ? 'bg-accent-dim text-accent'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }
              `}
            >
              <span className="text-[14px] font-medium flex-1">{option.label}</span>
              {option.tag && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border border-accent/40 text-accent">
                  {option.tag}
                </span>
              )}
              {selected === option.label && (
                <Check size={14} className="text-accent shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
