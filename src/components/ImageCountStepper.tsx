'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ImageCountStepperProps {
  count: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function ImageCountStepper({ count, max, onIncrement, onDecrement }: ImageCountStepperProps) {
  return (
    <div className="flex items-center gap-1 border border-border rounded-lg px-1 py-0.5">
      <button
        onClick={onDecrement}
        disabled={count <= 1}
        className="p-1 rounded text-text-tertiary hover:text-text-primary disabled:opacity-30 transition-colors"
      >
        <Minus size={12} />
      </button>
      <span className="text-[12px] font-medium text-text-secondary min-w-[28px] text-center">
        {count}/{max}
      </span>
      <button
        onClick={onIncrement}
        disabled={count >= max}
        className="p-1 rounded text-text-tertiary hover:text-text-primary disabled:opacity-30 transition-colors"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
