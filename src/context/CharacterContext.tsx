'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Character, dummyCharacters } from '@/data/characters';

interface CharacterContextType {
  characters: Character[];
  addCharacter: (character: Omit<Character, 'id' | 'createdAt'>) => void;
  removeCharacter: (id: string) => void;
  getCharacterByName: (name: string) => Character | undefined;
}

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>(dummyCharacters);

  const addCharacter = useCallback((char: Omit<Character, 'id' | 'createdAt'>) => {
    const newChar: Character = {
      ...char,
      id: `char-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCharacters((prev) => [newChar, ...prev]);
  }, []);

  const removeCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCharacterByName = useCallback(
    (name: string) => characters.find((c) => c.name.toLowerCase() === name.toLowerCase()),
    [characters]
  );

  return (
    <CharacterContext.Provider value={{ characters, addCharacter, removeCharacter, getCharacterByName }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacters() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacters must be used within CharacterProvider');
  return ctx;
}
