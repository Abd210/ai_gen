'use client';

import React, { useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import AmbientBackground from '@/components/AmbientBackground';
import { useCharacters } from '@/context/CharacterContext';
import { Character } from '@/data/characters';
import {
  Plus, Sparkles, Upload, Camera, MessageSquare,
  X, User, Trash2, Eye, Tag,
} from 'lucide-react';

function CharacterCard({
  character,
  onDelete,
}: {
  character: Character;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `${character.avatar}`,
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      <div className="relative bg-gradient-to-br from-[#1a1a1e] to-[#141416] border border-border/60 rounded-2xl p-5 h-full">
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: character.avatar }}
        />

        {/* Delete button */}
        <button
          onClick={() => onDelete(character.id)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface/50 border border-border/30 text-text-tertiary hover:text-danger hover:border-danger/30 hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={12} />
        </button>

        {/* Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl shrink-0 overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl relative"
            style={{
              boxShadow: hovered
                ? `0 8px 32px ${character.avatar.includes('#a855f7') ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,255,0.2)'}`
                : 'none',
            }}
          >
            {character.photo ? (
              <img src={character.photo} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                style={{ background: character.avatar }}
              >
                {character.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-[15px] font-bold text-text-primary truncate">{character.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/8 text-[9px] text-accent border border-accent/15">
                {character.createdFrom === 'photo' ? <Camera size={8} /> : <Sparkles size={8} />}
                {character.createdFrom}
              </span>
              <span className="text-[9px] text-text-tertiary">
                {new Date(character.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-3 mb-4">
          {character.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {character.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface/50 text-[9px] text-text-tertiary border border-border/30"
            >
              <Tag size={7} />
              {tag}
            </span>
          ))}
        </div>

        {/* Usage hint */}
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-[7px] text-accent font-bold">@</span>
          </div>
          <span className="text-[10px] text-text-tertiary">
            Type <span className="text-accent font-medium">@{character.name}</span> in any prompt
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CharactersPage() {
  const { characters, addCharacter, removeCharacter } = useCharacters();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<'prompt' | 'photo'>('prompt');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const gradients = [
    'linear-gradient(135deg, #a855f7, #ec4899)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #14b8a6)',
    'linear-gradient(135deg, #8b5cf6, #6366f1)',
    'linear-gradient(135deg, #f43f5e, #fb923c)',
    'linear-gradient(135deg, #06b6d4, #a855f7)',
  ];

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCharacter({
      name: newName.trim(),
      description: newDescription.trim() || 'A custom character',
      avatar: uploadedPhoto || gradients[Math.floor(Math.random() * gradients.length)],
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      createdFrom: createMode,
    });
    setNewName('');
    setNewDescription('');
    setNewTags('');
    setUploadedPhoto(null);
    setShowCreateModal(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPhoto(url);
    }
  };

  return (
    <AppShell>
      <div className="relative min-h-screen flex flex-col">
        {/* Background glows */}
        <AmbientBackground planet="neptune" intensity={0.5} />

        {/* Content */}
        <div className="relative z-10 px-4 md:px-8 py-6 md:py-8 max-w-[1200px] mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center border border-accent/15 shadow-glow-accent">
                <User size={18} className="text-accent" />
              </div>
              <div>
                <h1 className="text-[18px] md:text-[22px] font-bold text-text-primary tracking-tight">Characters</h1>
                <p className="text-[12px] text-text-tertiary">Create persistent characters and use them anywhere with @mention</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-all active:scale-[0.97] shadow-glow-accent"
            >
              <Plus size={16} />
              Create Character
            </button>
          </div>

          {/* How it works banner */}
          <div className="glass rounded-2xl p-5 mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center">
                <Sparkles size={12} className="text-accent" />
              </div>
              <h2 className="text-[13px] font-semibold text-text-primary">How Characters Work</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Create', desc: 'Define a character with a prompt or upload a photo' },
                { step: '2', title: 'Mention', desc: 'Type @ in any prompt bar to reference your character' },
                { step: '3', title: 'Generate', desc: 'Your character\'s traits are injected into the generation' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center text-[11px] font-bold text-accent shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-text-primary">{item.title}</p>
                    <p className="text-[10px] text-text-tertiary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} onDelete={removeCharacter} />
            ))}

            {/* Add New Card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-2xl border-2 border-dashed border-border/40 bg-surface/20 p-5 flex flex-col items-center justify-center gap-3 min-h-[240px] hover:border-accent/30 hover:bg-accent/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent/10 transition-all">
                <Plus size={22} className="text-text-tertiary group-hover:text-accent transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                  New Character
                </p>
                <p className="text-[10px] text-text-tertiary mt-1">From prompt or photo</p>
              </div>
            </button>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setShowCreateModal(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
              <div
                className="pointer-events-auto w-full max-w-[520px] bg-bg-secondary border border-border rounded-2xl shadow-elevated overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
                      <Sparkles size={14} className="text-accent" />
                    </div>
                    <h2 className="text-[16px] font-bold text-text-primary">Create Character</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-hover text-text-tertiary hover:text-text-primary transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Mode Tabs */}
                <div className="px-6 pt-4">
                  <div className="flex items-center bg-surface rounded-xl p-1 mb-5">
                    <button
                      onClick={() => setCreateMode('prompt')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-medium transition-all ${
                        createMode === 'prompt'
                          ? 'bg-accent/15 text-accent shadow-sm'
                          : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      <MessageSquare size={13} />
                      From Prompt
                    </button>
                    <button
                      onClick={() => setCreateMode('photo')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-medium transition-all ${
                        createMode === 'photo'
                          ? 'bg-accent/15 text-accent shadow-sm'
                          : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      <Camera size={13} />
                      From Photo
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="px-6 pb-6 space-y-4">
                  {/* Photo Upload (photo mode) */}
                  {createMode === 'photo' && (
                    <div>
                      <input
                        ref={photoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      {uploadedPhoto ? (
                        <div className="relative rounded-xl overflow-hidden border border-border">
                          <img src={uploadedPhoto} alt="Character" className="w-full h-40 object-cover" />
                          <button
                            onClick={() => setUploadedPhoto(null)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/70 hover:text-white transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => photoRef.current?.click()}
                          className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-accent/30 hover:bg-accent/5 transition-all"
                        >
                          <Upload size={20} className="text-text-tertiary" />
                          <span className="text-[12px] text-text-secondary">Upload a reference photo</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary mb-1.5 block">Character Name</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Zara Nebula"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary mb-1.5 block">
                      {createMode === 'prompt' ? 'Describe the character' : 'Additional details'}
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe appearance, style, personality..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent/40 transition-colors resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-[11px] font-medium text-text-secondary mb-1.5 block">Tags (comma separated)</label>
                    <input
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. sci-fi, female, cyberpunk"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-bold transition-all ${
                      newName.trim()
                        ? 'bg-accent text-white hover:bg-accent-hover active:scale-[0.98] shadow-glow-accent'
                        : 'bg-accent/20 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles size={16} />
                    Create Character
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
