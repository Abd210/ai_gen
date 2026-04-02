'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import {
  Mic, Play, Pause, Volume2, VolumeX, ChevronDown,
  Sparkles, Globe, RefreshCw, Music, Headphones,
  Plus, Upload,
} from 'lucide-react';

const voices = [
  { id: 'aria', name: 'Aria', accent: 'American', gender: 'Female', style: 'Warm, Expressive' },
  { id: 'roger', name: 'Roger', accent: 'British', gender: 'Male', style: 'Deep, Authoritative' },
  { id: 'luna', name: 'Luna', accent: 'American', gender: 'Female', style: 'Soft, Calming' },
  { id: 'atlas', name: 'Atlas', accent: 'American', gender: 'Male', style: 'Energetic, Bold' },
  { id: 'echo', name: 'Echo', accent: 'Neutral', gender: 'Non-binary', style: 'Clear, Modern' },
  { id: 'iris', name: 'Iris', accent: 'British', gender: 'Female', style: 'Elegant, Refined' },
];

const audioModels = [
  { id: 'eleven-v3', name: 'Eleven v3', icon: '🔊', cost: 4 },
  { id: 'eleven-turbo', name: 'Eleven Turbo', icon: '⚡', cost: 2 },
  { id: 'bark-v2', name: 'Bark v2', icon: '🌊', cost: 3 },
];

type Tab = 'voiceover' | 'sound' | 'music';

function WaveformBar({ delay, active }: { delay: number; active: boolean }) {
  return (
    <div
      className="w-[3px] rounded-full transition-all duration-300"
      style={{
        backgroundColor: active ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255,255,255,0.06)',
        height: active ? `${20 + Math.random() * 60}%` : '15%',
        animationDelay: `${delay}ms`,
        animation: active ? `waveform ${0.6 + Math.random() * 0.8}s ease-in-out infinite ${delay}ms` : 'none',
      }}
    />
  );
}

export default function AudioPage() {
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('voiceover');
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [selectedModel, setSelectedModel] = useState(audioModels[0]);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'voiceover', label: 'Voiceover', icon: <Mic size={13} /> },
    { id: 'sound', label: 'Sound FX', icon: <Volume2 size={13} /> },
    { id: 'music', label: 'Music', icon: <Music size={13} /> },
  ];

  const waveformBars = Array.from({ length: 48 }, (_, i) => i);

  return (
    <AppShell>
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.06) 0%, rgba(120, 40, 200, 0.03) 40%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] rounded-full animate-glow-pulse"
            style={{
              background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.04) 0%, transparent 70%)',
              animationDelay: '2s',
            }}
          />
        </div>

        {/* Waveform Background Art */}
        <div className="absolute bottom-[120px] left-0 right-0 h-[200px] pointer-events-none z-0 flex items-end justify-center gap-[3px] px-8 opacity-30">
          {waveformBars.map((i) => (
            <WaveformBar key={i} delay={i * 60} active={isPlaying} />
          ))}
        </div>

        {/* Main Content — centered hero */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center pb-40">
          {/* Hero */}
          <div className="text-center animate-fade-in mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-text-tertiary mb-3">
              Audio Studio
            </p>
            <h1 className="text-[32px] font-bold leading-tight">
              <span className="text-text-secondary">Ready to give your</span>
              <br />
              <span className="text-gradient">scene a voice?</span>
            </h1>
            <p className="text-[13px] text-text-tertiary mt-3 max-w-md">
              Generate voiceovers, sound effects, and music — powered by AI
            </p>
          </div>

          {/* Animated voice preview orb */}
          <div className="relative mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.15))'
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(100, 40, 180, 0.06))',
                border: `1px solid ${isPlaying ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)'}`,
                boxShadow: isPlaying ? '0 0 40px rgba(168, 85, 247, 0.2)' : 'none',
              }}
            >
              {isPlaying ? (
                <Pause size={24} className="text-accent" />
              ) : (
                <Play size={24} className="text-accent ml-1" />
              )}
            </div>
            {/* Pulse rings */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute -inset-3 rounded-full border border-accent/10 animate-ping" style={{ animationDuration: '3s' }} />
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-[240px] right-0 z-30 px-6 pb-5 pointer-events-none">
          <div className="max-w-[900px] mx-auto pointer-events-auto">
            <div className="bg-bg-tertiary border border-border rounded-2xl shadow-elevated overflow-visible">
              {/* Top row — Tab selector + Voice info */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                {/* Tab buttons */}
                <div className="flex items-center bg-surface rounded-xl p-0.5 mr-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-accent/15 text-accent shadow-sm'
                          : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Voice selector — only for voiceover tab */}
                {activeTab === 'voiceover' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowVoicePicker(!showVoicePicker)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[11px] font-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white">
                        {selectedVoice.name[0]}
                      </div>
                      <span>{selectedVoice.name}</span>
                      <span className="text-[9px] text-text-tertiary">· {selectedVoice.accent}</span>
                      <ChevronDown size={10} className={`transition-transform ${showVoicePicker ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Voice Picker Dropdown */}
                    {showVoicePicker && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowVoicePicker(false)} />
                        <div className="absolute bottom-full left-0 mb-2 w-[280px] bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 overflow-hidden animate-scale-in">
                          <div className="px-3 py-2 border-b border-border">
                            <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Choose Voice</p>
                          </div>
                          <div className="max-h-[220px] overflow-y-auto py-1">
                            {voices.map((voice) => (
                              <button
                                key={voice.id}
                                onClick={() => { setSelectedVoice(voice); setShowVoicePicker(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all ${
                                  selectedVoice.id === voice.id
                                    ? 'bg-accent/8 text-text-primary'
                                    : 'hover:bg-surface-hover text-text-secondary'
                                }`}
                              >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                  {voice.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-medium">{voice.name}</span>
                                    <span className="text-[9px] text-text-tertiary">{voice.accent} · {voice.gender}</span>
                                  </div>
                                  <p className="text-[10px] text-text-tertiary">{voice.style}</p>
                                </div>
                                {selectedVoice.id === voice.id && (
                                  <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex-1" />

                {/* Translate button — voiceover only */}
                {activeTab === 'voiceover' && (
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all">
                    <Globe size={11} />
                    Translate
                  </button>
                )}
              </div>

              {/* Prompt Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <button className="p-2 rounded-lg bg-surface border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all shrink-0">
                  <Plus size={16} />
                </button>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    activeTab === 'voiceover'
                      ? 'Type or paste the text to speak...'
                      : activeTab === 'sound'
                      ? 'Describe the sound you imagine...'
                      : 'Describe the music you want to create...'
                  }
                  rows={1}
                  className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none resize-none min-h-[24px] max-h-[100px] leading-6"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 100) + 'px';
                  }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-2 px-4 py-2.5">
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  {/* Model Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border border-accent/30 bg-accent-dim text-accent"
                    >
                      <span>{selectedModel.icon}</span>
                      <span>{selectedModel.name}</span>
                      <ChevronDown size={10} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showModelDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
                        <div className="absolute bottom-full left-0 mb-2 w-[200px] bg-bg-secondary border border-border rounded-xl shadow-dropdown z-50 overflow-hidden py-1 animate-scale-in">
                          {audioModels.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => { setSelectedModel(m); setShowModelDropdown(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-[12px] transition-all ${
                                selectedModel.id === m.id
                                  ? 'bg-accent/8 text-accent'
                                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                              }`}
                            >
                              <span>{m.icon}</span>
                              <span className="flex-1 font-medium">{m.name}</span>
                              <span className="text-[10px] text-accent flex items-center gap-0.5">
                                <Sparkles size={8} />{m.cost}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Voice quality chip — voiceover only */}
                  {activeTab === 'voiceover' && (
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all">
                      <Sparkles size={10} />
                      HD Quality
                    </button>
                  )}

                  {/* SFX category chip — sound only */}
                  {activeTab === 'sound' && (
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all">
                      <Headphones size={10} />
                      Ambient
                    </button>
                  )}

                  {/* Music genre chip — music only */}
                  {activeTab === 'music' && (
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-all">
                      <Music size={10} />
                      Cinematic
                    </button>
                  )}
                </div>

                {/* Generate Button */}
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-[13px] font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-accent/20">
                  Generate
                  <Sparkles size={14} />
                  <span className="text-white/80">{selectedModel.cost}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
