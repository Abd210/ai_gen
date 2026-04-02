'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Square, Heart, Pencil, ChevronDown } from 'lucide-react';
import { imageModels, ImageModel } from '@/data/models';
import GenerateButton from './GenerateButton';
import SelectorChip from './SelectorChip';
import ImageCountStepper from './ImageCountStepper';
import ModelDropdown from './ModelDropdown';
import AspectRatioDropdown from './AspectRatioDropdown';
import QualityDropdown from './QualityDropdown';
import DrawToEditOverlay from './DrawToEditOverlay';

export default function BottomPromptBar() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ImageModel>(
    imageModels.find((m) => m.id === 'nano-banana-pro')!
  );
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAspectDropdown, setShowAspectDropdown] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [showDrawOverlay, setShowDrawOverlay] = useState(false);

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
      <div className="fixed bottom-0 left-[240px] right-0 z-30 px-6 pb-5 pointer-events-none">
        <div className="max-w-[900px] mx-auto pointer-events-auto">
          <div className="bg-bg-tertiary border border-border rounded-2xl shadow-elevated overflow-visible">
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
                  max={4}
                  onIncrement={() => setImageCount((c) => Math.min(c + 1, 4))}
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
              <GenerateButton cost={totalCost} />
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
