'use client';

import React from 'react';

interface HighlightedPromptProps {
  text: string;
  className?: string;
}

/** 
 * Overlay that sits behind a textarea and highlights @mentions in accent color.
 * The textarea must have transparent background so this shows through.
 */
export default function HighlightedPrompt({ text, className = '' }: HighlightedPromptProps) {
  // Split text by @mentions (word characters + spaces within a name, limited)
  const parts = text.split(/(@[\w\s]+?)(?=\s|$)/g);

  return (
    <div
      className={`pointer-events-none whitespace-pre-wrap break-words ${className}`}
      aria-hidden="true"
    >
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <span key={i} className="text-accent font-semibold bg-accent/10 rounded px-0.5">
            {part}
          </span>
        ) : (
          <span key={i} className="text-transparent">{part}</span>
        )
      )}
    </div>
  );
}
