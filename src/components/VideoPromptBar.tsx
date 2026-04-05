'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Clock, Square, Heart, Volume2, Sparkles } from 'lucide-react';
import { videoModels, VideoModel } from '@/data/video-models';
import GenerateButton from './GenerateButton';
import SelectorChip from './SelectorChip';
import ToggleChip from './ToggleChip';
import VideoModelDropdown from './VideoModelDropdown';
import DurationDropdown from './DurationDropdown';
import AspectRatioDropdown from './AspectRatioDropdown';
import CharacterMentionPopup from './CharacterMentionPopup';
import HighlightedPrompt from './HighlightedPrompt';
import { Character } from '@/data/characters';

type ActiveDropdown = null | 'model' | 'duration' | 'aspect' | 'resolution';

const resolutionLabels: Record<string, string> = {
  '720p': '720p',
  '1080p': '1080p',
};

interface VideoPromptBarProps {
  onGenerate?: (prompt: string, model: string, quality: string, aspect: string) => void;
}

export default function VideoPromptBar({ onGenerate }: VideoPromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<VideoModel>(videoModels[0]);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);

  const [duration, setDuration] = useState(selectedModel.defaultDuration);
  const [aspectRatio, setAspectRatio] = useState(selectedModel.aspectRatios[0]);
  const [resolution, setResolution] = useState(selectedModel.resolutions[0]);
  const [soundOn, setSoundOn] = useState(true);
  const [enhanceOn, setEnhanceOn] = useState(true);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptRowRef = useRef<HTMLDivElement>(null);

  // Sync settings when model changes
  useEffect(() => {
    setDuration(selectedModel.defaultDuration);
    if (!selectedModel.aspectRatios.includes(aspectRatio)) {
      setAspectRatio(selectedModel.aspectRatios[0]);
    }
    if (!selectedModel.resolutions.includes(resolution)) {
      setResolution(selectedModel.resolutions[0]);
    }
    if (!selectedModel.soundSupport) {
      setSoundOn(false);
    } else {
      setSoundOn(true);
    }
    if (!selectedModel.enhanceSupport) {
      setEnhanceOn(false);
    }
  }, [selectedModel]);

  const handleModelSelect = useCallback((model: VideoModel) => {
    setSelectedModel(model);
    setActiveDropdown(null);
  }, []);

  const toggleDropdown = useCallback((dropdown: ActiveDropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  }, []);

  // Compute cost dynamically
  const isHD = resolution === '1080p';
  const baseCost = selectedModel.costPerGeneration;
  const totalCost = Math.ceil(baseCost * (isHD ? selectedModel.hdCostMultiplier : 1));

  return (
    <div className="fixed bottom-0 left-0 md:left-[240px] right-0 z-30 px-3 md:px-6 pb-3 md:pb-5 pointer-events-none">
      <div className="max-w-[900px] mx-auto pointer-events-auto">
        <div className="bg-bg-tertiary border border-border rounded-2xl shadow-elevated overflow-visible">
          <div ref={promptRowRef} className="flex items-center gap-3 px-4 py-3 border-b border-border relative">
            <button className="p-2 rounded-lg bg-surface border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all shrink-0">
              <Plus size={16} />
            </button>
            <div className="flex-1 relative min-h-[24px]">
              <HighlightedPrompt
                text={prompt}
                className="absolute inset-0 text-[14px] leading-6 py-0"
              />
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  const val = e.target.value;
                  setPrompt(val);
                  const cursor = e.target.selectionStart;
                  const before = val.slice(0, cursor);
                  const atIdx = before.lastIndexOf('@');
                  if (atIdx !== -1 && (atIdx === 0 || before[atIdx - 1] === ' ')) {
                    const query = before.slice(atIdx + 1);
                    if (!query.includes(' ') || query.length < 20) {
                      setMentionQuery(query);
                      setMentionStart(atIdx);
                    } else {
                      setMentionQuery(null);
                    }
                  } else {
                    setMentionQuery(null);
                  }
                }}
                placeholder="Describe the video you want to create... type @ to mention a character"
                rows={1}
                className="relative w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none resize-none min-h-[24px] max-h-[100px] leading-6 caret-text-primary"
                style={{ color: prompt.includes('@') ? 'transparent' : undefined, caretColor: 'var(--text-primary)' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 100) + 'px';
                }}
              />
            </div>
          </div>

          {/* Character Mention Popup */}
          {mentionQuery !== null && (
            <div className="relative">
              <CharacterMentionPopup
                query={mentionQuery}
                anchorRef={promptRowRef}
                onSelect={(char: Character) => {
                  const before = prompt.slice(0, mentionStart);
                  const after = prompt.slice(mentionStart + 1 + mentionQuery.length);
                  setPrompt(`${before}@${char.name}${after}`);
                  setMentionQuery(null);
                }}
                onClose={() => setMentionQuery(null)}
              />
            </div>
          )}

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2 px-3 md:px-4 py-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
              {/* Model Selector */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('model')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border border-accent/30 bg-accent-dim text-accent"
                >
                  <span className="text-sm">{selectedModel.icon}</span>
                  <span>{selectedModel.name}</span>
                  <ChevronDown size={12} className={`transition-transform ${activeDropdown === 'model' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'model' && (
                  <VideoModelDropdown
                    models={videoModels}
                    selectedModelId={selectedModel.id}
                    onSelect={handleModelSelect}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>

              {/* Duration — with drag slider */}
              <div className="relative">
                <SelectorChip
                  icon={<Clock size={10} />}
                  label={`${duration}s`}
                  onClick={() => toggleDropdown('duration')}
                  isActive={activeDropdown === 'duration'}
                />
                {activeDropdown === 'duration' && (
                  <DurationDropdown
                    min={selectedModel.durationRange[0]}
                    max={selectedModel.durationRange[1]}
                    step={selectedModel.durationStep}
                    value={duration}
                    onChange={setDuration}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>

              {/* Aspect Ratio */}
              <div className="relative">
                <SelectorChip
                  icon={<Square size={10} />}
                  label={aspectRatio}
                  onClick={() => toggleDropdown('aspect')}
                  isActive={activeDropdown === 'aspect'}
                />
                {activeDropdown === 'aspect' && (
                  <AspectRatioDropdown
                    options={selectedModel.aspectRatios}
                    selected={aspectRatio}
                    onSelect={(r) => {
                      setAspectRatio(r);
                      setActiveDropdown(null);
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>

              {/* Resolution */}
              <div className="relative">
                <SelectorChip
                  icon={<Heart size={10} />}
                  label={resolutionLabels[resolution] || resolution}
                  onClick={() => {
                    if (selectedModel.resolutions.length > 1) {
                      // cycle between resolutions
                      const idx = selectedModel.resolutions.indexOf(resolution);
                      const next = selectedModel.resolutions[(idx + 1) % selectedModel.resolutions.length];
                      setResolution(next);
                    }
                  }}
                  isActive={resolution === '1080p'}
                />
              </div>

              {/* Sound */}
              {selectedModel.soundSupport && (
                <ToggleChip
                  label="Sound"
                  isOn={soundOn}
                  onToggle={() => setSoundOn(!soundOn)}
                />
              )}

              {/* Enhance */}
              {selectedModel.enhanceSupport && (
                <SelectorChip
                  icon={<Sparkles size={10} />}
                  label={enhanceOn ? 'Enhance on' : 'Enhance off'}
                  isActive={enhanceOn}
                  onClick={() => setEnhanceOn(!enhanceOn)}
                />
              )}
            </div>

            {/* Generate Button */}
            <GenerateButton
              cost={totalCost}
              onClick={() => {
                if (prompt.trim() && onGenerate) {
                  onGenerate(prompt.trim(), selectedModel.name, resolution, aspectRatio);
                  setPrompt('');
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
