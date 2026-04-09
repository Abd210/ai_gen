'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, Square, Heart, Pencil, ChevronDown } from 'lucide-react';
import { imageModels, ImageModel } from '@/data/models';
import GenerateButton from './GenerateButton';
import SelectorChip from './SelectorChip';
import ImageCountStepper from './ImageCountStepper';
import ModelDropdown from './ModelDropdown';
import AspectRatioDropdown from './AspectRatioDropdown';
import QualityDropdown from './QualityDropdown';
import DrawToEditOverlay from './DrawToEditOverlay';
import CharacterMentionPopup from './CharacterMentionPopup';
import HighlightedPrompt from './HighlightedPrompt';
import { Character } from '@/data/characters';

interface BottomPromptBarProps {
  onGenerate?: (prompt: string, model: string, quality: string, aspect: string, count: number) => void;
}

export default function BottomPromptBar({ onGenerate }: BottomPromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ImageModel>(
    imageModels.find((m) => m.id === 'nano-banana-pro')!
  );
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAspectDropdown, setShowAspectDropdown] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [showDrawOverlay, setShowDrawOverlay] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStart, setMentionStart] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptRowRef = useRef<HTMLDivElement>(null);

  const [imageCount, setImageCount] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('Auto');
  const [quality, setQuality] = useState(selectedModel.defaultQuality);

  // sync quality/aspect when model changes
  useEffect(() => {
    setQuality(selectedModel.defaultQuality);
    if (!selectedModel.aspectRatios.includes(aspectRatio)) {
      setAspectRatio('Auto');
    }
  }, [selectedModel]);

  const handleModelSelect = useCallback((model: ImageModel) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  }, []);

  // compute cost
  const qualityOption = selectedModel.qualityOptions.find((q) => q.label === quality);
  const costPerImage = Math.ceil(selectedModel.costPerImage * (qualityOption?.costMultiplier ?? 1));
  const totalCost = costPerImage * imageCount;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[60] px-3 md:px-6 pb-3 md:pb-5 pointer-events-none">
        <div className="max-w-[900px] mx-auto pointer-events-auto">
          <div className="bg-bg-tertiary border border-border rounded-2xl shadow-elevated" style={{ overflow: 'visible' }}>
            {/* Prompt Input Row */}
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
                    // Detect @ mention
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
                  placeholder="Describe the scene you imagine — type @ to mention a character"
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
                    onClick={() => {
                      setShowModelDropdown(!showModelDropdown);
                      setShowAspectDropdown(false);
                      setShowQualityDropdown(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border border-accent/30 bg-accent-dim text-accent"
                  >
                    <span className="text-sm">{selectedModel.icon}</span>
                    <span>{selectedModel.name}</span>
                    <ChevronDown size={12} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showModelDropdown && (
                    <ModelDropdown
                      models={imageModels}
                      selectedModelId={selectedModel.id}
                      onSelect={handleModelSelect}
                      onClose={() => setShowModelDropdown(false)}
                    />
                  )}
                </div>

                {/* Aspect Ratio */}
                <div className="relative">
                  <SelectorChip
                    icon={<Square size={10} />}
                    label={aspectRatio}
                    onClick={() => {
                      setShowAspectDropdown(!showAspectDropdown);
                      setShowModelDropdown(false);
                      setShowQualityDropdown(false);
                    }}
                    isActive={showAspectDropdown}
                  />
                  {showAspectDropdown && (
                    <AspectRatioDropdown
                      options={selectedModel.aspectRatios}
                      selected={aspectRatio}
                      onSelect={(r) => {
                        setAspectRatio(r);
                        setShowAspectDropdown(false);
                      }}
                      onClose={() => setShowAspectDropdown(false)}
                    />
                  )}
                </div>

                {/* Quality */}
                <div className="relative">
                  <SelectorChip
                    icon={<Heart size={10} />}
                    label={quality}
                    onClick={() => {
                      setShowQualityDropdown(!showQualityDropdown);
                      setShowModelDropdown(false);
                      setShowAspectDropdown(false);
                    }}
                    isActive={showQualityDropdown}
                  />
                  {showQualityDropdown && (
                    <QualityDropdown
                      options={selectedModel.qualityOptions}
                      selected={quality}
                      onSelect={(q) => {
                        setQuality(q);
                        setShowQualityDropdown(false);
                      }}
                      onClose={() => setShowQualityDropdown(false)}
                    />
                  )}
                </div>

                {/* Image Count */}
                <ImageCountStepper
                  count={imageCount}
                  max={6}
                  onIncrement={() => setImageCount((c) => Math.min(c + 1, 6))}
                  onDecrement={() => setImageCount((c) => Math.max(c - 1, 1))}
                />

                {/* Draw */}
                <SelectorChip
                  icon={<Pencil size={10} />}
                  label="Draw"
                  onClick={() => setShowDrawOverlay(true)}
                />
              </div>

              {/* Generate Button */}
              <GenerateButton
                cost={totalCost}
                onClick={() => {
                  if (prompt.trim() && onGenerate) {
                    onGenerate(prompt.trim(), selectedModel.name, quality, aspectRatio, imageCount);
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

      {/* Draw to Edit Overlay */}
      {showDrawOverlay && (
        <DrawToEditOverlay onClose={() => setShowDrawOverlay(false)} />
      )}
    </>
  );
}
