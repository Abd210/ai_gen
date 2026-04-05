'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Generation } from '@/data/generations';

interface GenerationContextType {
  generations: Generation[];
  addGeneration: (gen: Generation) => void;
  clearGenerations: () => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

const SESSION_KEY = 'xenofield_generations';

export function GenerationProvider({ children }: { children: React.ReactNode }) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          setGenerations(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
    setLoaded(true);
  }, []);

  // Save to sessionStorage on every change
  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(generations));
    }
  }, [generations, loaded]);

  const addGeneration = useCallback((gen: Generation) => {
    setGenerations((prev) => [gen, ...prev]);
  }, []);

  const clearGenerations = useCallback(() => {
    setGenerations([]);
  }, []);

  return (
    <GenerationContext.Provider value={{ generations, addGeneration, clearGenerations }}>
      {children}
    </GenerationContext.Provider>
  );
}

export function useGenerations() {
  const context = useContext(GenerationContext);
  if (!context) throw new Error('useGenerations must be used within GenerationProvider');
  return context;
}
