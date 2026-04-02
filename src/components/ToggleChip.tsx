'use client';

import React from 'react';

interface ToggleChipProps {
  label: string;
  isOn: boolean;
  onToggle: () => void;
}

export default function ToggleChip({ label, isOn, onToggle }: ToggleChipProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 text-[12px] text-text-secondary whitespace-nowrap"
    >
      <span>{label}</span>
      <div
        className={`
          w-9 h-5 rounded-full relative transition-colors duration-200 shrink-0
          ${isOn ? 'bg-success' : 'bg-surface-active'}
        `}
      >
        <div
          className={`
            absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${isOn ? 'translate-x-[18px]' : 'translate-x-0.5'}
          `}
        />
      </div>
    </button>
  );
}
