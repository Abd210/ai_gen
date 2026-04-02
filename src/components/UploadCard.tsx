'use client';

import React from 'react';
import { Upload, Image as ImageIcon, Clipboard } from 'lucide-react';

interface UploadCardProps {
  label?: string;
  sublabel?: string;
  isOptional?: boolean;
}

export default function UploadCard({ label = 'Upload image', sublabel = 'or paste from clipboard', isOptional = true }: UploadCardProps) {
  return (
    <div className="relative group">
      {isOptional && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] text-text-tertiary bg-bg-tertiary px-2 z-10">
          Optional
        </span>
      )}
      <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-border-strong hover:bg-surface-hover/50 transition-all cursor-pointer min-h-[120px]">
        <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center group-hover:border-border-strong transition-colors">
          <ImageIcon size={18} className="text-text-tertiary" />
        </div>
        <div className="text-center">
          <p className="text-[12px] font-medium text-text-secondary">{label}</p>
          <p className="text-[10px] text-text-tertiary mt-1">{sublabel}</p>
        </div>
      </div>
    </div>
  );
}
