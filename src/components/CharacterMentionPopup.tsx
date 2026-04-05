'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCharacters } from '@/context/CharacterContext';
import { Character } from '@/data/characters';

interface CharacterMentionPopupProps {
  query: string; // text after @
  onSelect: (character: Character) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export default function CharacterMentionPopup({
  query,
  onSelect,
  onClose,
  anchorRef,
}: CharacterMentionPopupProps) {
  const { characters } = useCharacters();
  const popupRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  // Reset index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        onSelect(filtered[activeIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [filtered, activeIndex, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full left-0 mb-2 w-[300px] bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 overflow-hidden animate-scale-in"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-[8px] text-accent font-bold">@</span>
        </div>
        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
          Mention Character
        </p>
      </div>

      {/* Character List */}
      <div className="max-h-[240px] overflow-y-auto py-1">
        {filtered.map((char, index) => (
          <button
            key={char.id}
            onClick={() => onSelect(char)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all ${
              index === activeIndex
                ? 'bg-accent/10 text-text-primary'
                : 'hover:bg-surface-hover text-text-secondary'
            }`}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
              style={{ background: char.avatar }}
            >
              {char.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-medium truncate">{char.name}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-surface border border-border text-text-tertiary shrink-0">
                  {char.createdFrom === 'photo' ? '📷' : '✨'} {char.createdFrom}
                </span>
              </div>
              <p className="text-[10px] text-text-tertiary truncate">{char.description}</p>
            </div>

            {/* Active indicator */}
            {index === activeIndex && (
              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1.5 border-t border-border flex items-center gap-3">
        <span className="text-[9px] text-text-tertiary">
          <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[8px]">↑↓</kbd> navigate
        </span>
        <span className="text-[9px] text-text-tertiary">
          <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[8px]">↵</kbd> select
        </span>
        <span className="text-[9px] text-text-tertiary">
          <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[8px]">esc</kbd> dismiss
        </span>
      </div>
    </div>
  );
}
