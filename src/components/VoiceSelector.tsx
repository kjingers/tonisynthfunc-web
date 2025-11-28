import React from 'react';
import type { VoiceName, VoiceStyle, VoiceConfig } from '../types';
import { AVAILABLE_VOICES } from '../types';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  selectedStyle: VoiceStyle | undefined;
  onVoiceChange: (voice: VoiceName) => void;
  onStyleChange: (style: VoiceStyle | undefined) => void;
  disabled?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  selectedStyle,
  onVoiceChange,
  onStyleChange,
  disabled = false,
}) => {
  const currentVoiceConfig = AVAILABLE_VOICES.find(v => v.name === selectedVoice) as VoiceConfig;

  return (
    <div className="space-y-4">
      {/* Voice Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Voice
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => {
            onVoiceChange(e.target.value as VoiceName);
            onStyleChange(undefined); // Reset style when voice changes
          }}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {AVAILABLE_VOICES.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speaking Style (optional)
        </label>
        <select
          value={selectedStyle || ''}
          onChange={(e) => onStyleChange(e.target.value as VoiceStyle || undefined)}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Default (Natural)</option>
          {currentVoiceConfig?.styles.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
