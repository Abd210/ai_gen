'use client';

import React from 'react';

interface SelectorChipProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SelectorChip({ icon, label, isActive, onClick }: SelectorChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
        transition-all duration-150 whitespace-nowrap
        border
        ${isActive
          ? 'border-accent/40 bg-accent-dim text-accent'
          : 'border-border bg-transparent text-text-secondary hover:text-text-primary hover:border-border-strong'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
