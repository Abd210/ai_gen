'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Upload, Image as ImageIcon, ChevronDown, Clock, Square, Heart, Volume2, Pencil } from 'lucide-react';
import { videoModels, VideoModel } from '@/data/video-models';
import GenerateButton from './GenerateButton';
import SelectorChip from './SelectorChip';
import ToggleChip from './ToggleChip';

export default function VideoPromptBar() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<VideoModel>(videoModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [duration, setDuration] = useState('8s');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [enhanceOn, setEnhanceOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  const handleModelSelect = useCallback((model: VideoModel) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
    setDuration(model.durations[1] || model.durations[0]);
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
              placeholder="Describe the video you want to create..."
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border border-accent/30 bg-accent-dim text-accent"
                >
                  <span className="text-sm">{selectedModel.icon}</span>
                  <span>{selectedModel.name}</span>
                  <ChevronDown size={12} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showModelDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
                    <div className="absolute bottom-full left-0 mb-2 w-[280px] max-h-[360px] bg-bg-secondary border border-border rounded-2xl shadow-dropdown z-50 overflow-y-auto animate-scale-in py-2 px-2">
                      {videoModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model)}
                          className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            model.id === selectedModel.id ? 'bg-accent-dim' : 'hover:bg-surface-hover'
                          }`}
                        >
                          <span className="text-lg shrink-0">{model.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[12px] font-medium text-text-primary">{model.name}</span>
                              {model.tags.map((tag) => (
                                <span key={tag} className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  tag === 'NEW' ? 'bg-accent text-bg-primary' :
                                  tag === 'BUSINESS' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                  'border border-accent/40 text-accent'
                                }`}>{tag === 'BUSINESS' ? 'FOR BUSINESS PLANS' : tag}</span>
                              ))}
                            </div>
                            <p className="text-[10px] text-text-tertiary mt-0.5">{model.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Duration */}
              <SelectorChip
                icon={<Clock size={10} />}
                label={duration}
              />

              {/* Aspect Ratio */}
              <SelectorChip
                icon={<Square size={10} />}
                label={aspectRatio}
              />

              {/* Resolution */}
              <SelectorChip
                icon={<Heart size={10} />}
                label={resolution}
              />

              {/* Sound */}
              {selectedModel.soundSupport && (
                <ToggleChip
                  label="Sound"
                  isOn={soundOn}
                  onToggle={() => setSoundOn(!soundOn)}
                />
              )}

              {/* Enhance */}
              <SelectorChip
                icon={<Pencil size={10} />}
                label={enhanceOn ? 'Enhance on' : 'Enhance off'}
                isActive={enhanceOn}
                onClick={() => setEnhanceOn(!enhanceOn)}
              />
            </div>

            {/* Generate Button */}
            <GenerateButton cost={selectedModel.costPerGeneration} />
          </div>
        </div>
      </div>
    </div>
  );
}
