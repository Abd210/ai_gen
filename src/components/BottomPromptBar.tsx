'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Square, Heart, AtSign, Pencil, ChevronDown } from 'lucide-react';
import { imageModels, ImageModel } from '@/data/models';
import GenerateButton from './GenerateButton';
import SelectorChip from './SelectorChip';
import ToggleChip from './ToggleChip';
import ImageCountStepper from './ImageCountStepper';
import ModelDropdown from './ModelDropdown';

export default function BottomPromptBar() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ImageModel>(
    imageModels.find((m) => m.id === 'nano-banana-pro')!
  );
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [imageCount, setImageCount] = useState(1);
  const [extraFreeGens, setExtraFreeGens] = useState(true);
  const [resolution] = useState('2K');

  const handleModelSelect = useCallback((model: ImageModel) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  }, []);

  return (
    <div className="fixed bottom-0 left-[240px] right-0 z-30 px-6 pb-5 pointer-events-none">
      <div className="max-w-[900px] mx-auto pointer-events-auto">
        <div className="bg-bg-tertiary border border-border rounded-2xl shadow-elevated overflow-hidden">
          {/* Prompt Input Row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <button className="p-2 rounded-lg bg-surface border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all shrink-0">
              <Plus size={16} />
            </button>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene you imagine"
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
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium
                    transition-all duration-150 border
                    ${showModelDropdown
                      ? 'border-accent/40 bg-accent-dim text-accent'
                      : 'border-accent/30 bg-accent-dim text-accent'
                    }
                  `}
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

              {/* Auto */}
              <SelectorChip
                icon={<Square size={10} />}
                label="Auto"
              />

              {/* Resolution */}
              <SelectorChip
                icon={<Heart size={10} />}
                label={resolution}
              />

              {/* Image Count */}
              <ImageCountStepper
                count={imageCount}
                max={4}
                onIncrement={() => setImageCount((c) => Math.min(c + 1, 4))}
                onDecrement={() => setImageCount((c) => Math.max(c - 1, 1))}
              />

              {/* Settings */}
              <button className="p-1.5 rounded-lg border border-border text-text-tertiary hover:text-text-primary transition-colors">
                <AtSign size={14} />
              </button>

              {/* Extra free gens toggle */}
              <ToggleChip
                label="Extra free gens"
                isOn={extraFreeGens}
                onToggle={() => setExtraFreeGens(!extraFreeGens)}
              />

              {/* Draw */}
              <SelectorChip
                icon={<Pencil size={10} />}
                label="Draw"
              />
            </div>

            {/* Generate Button */}
            <GenerateButton cost={selectedModel.costPerImage * imageCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
