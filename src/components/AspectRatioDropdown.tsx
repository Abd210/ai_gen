'use client';

import React from 'react';
import { Check, Square } from 'lucide-react';

interface AspectRatioDropdownProps {
  options: string[];
  selected: string;
  onSelect: (ratio: string) => void;
  onClose: () => void;
}

const ratioIcons: Record<string, React.ReactNode> = {
  'Auto': <div className="w-3.5 h-3.5 rounded-[3px] border border-current" />,
  '1:1': <div className="w-3 h-3 border border-current" />,
  '3:4': <div className="w-2.5 h-3.5 border border-current" />,
  '4:3': <div className="w-3.5 h-2.5 border border-current" />,
  '2:3': <div className="w-2 h-3.5 border border-current" />,
  '3:2': <div className="w-3.5 h-2 border border-current" />,
  '9:16': <div className="w-2 h-3.5 border border-current rounded-[1px]" />,
  '16:9': <div className="w-3.5 h-2 border border-current rounded-[1px]" />,
  '5:4': <div className="w-3.5 h-3 border border-current" />,
  '4:5': <div className="w-3 h-3.5 border border-current" />,
  '21:9': <div className="w-4 h-1.5 border border-current rounded-[1px]" />,
};

export default function AspectRatioDropdown({ options, selected, onSelect, onClose }: AspectRatioDropdownProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-[180px] bg-bg-secondary border border-border rounded-2xl shadow-dropdown z-50 animate-scale-in overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <span className="text-[13px] font-medium text-text-primary">Aspect ratio</span>
        </div>
        <div className="py-1 max-h-[380px] overflow-y-auto">
          {options.map((ratio) => (
            <button
              key={ratio}
              onClick={() => onSelect(ratio)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all
                ${selected === ratio
                  ? 'bg-accent-dim text-accent'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }
              `}
            >
              <span className="w-5 flex items-center justify-center shrink-0">
                {ratioIcons[ratio] || <Square size={12} />}
              </span>
              <span className="text-[13px] font-medium flex-1">{ratio}</span>
              {selected === ratio && (
                <Check size={14} className="text-accent shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
