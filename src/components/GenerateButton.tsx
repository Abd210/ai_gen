'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  cost: number;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export default function GenerateButton({ cost, onClick, disabled, label = 'Generate' }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-xl
        text-[14px] font-bold transition-all duration-200
        ${disabled
          ? 'bg-accent/30 text-white/50 cursor-not-allowed'
          : 'bg-accent text-white hover:bg-accent-hover active:scale-[0.97] shadow-glow-accent'
        }
      `}
    >
      <span>{label}</span>
      <Sparkles size={14} />
      <span>{cost}</span>
    </button>
  );
}
