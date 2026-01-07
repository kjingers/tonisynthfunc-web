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

// Style descriptions for better UX
const STYLE_DESCRIPTIONS: Record<VoiceStyle, string> = {
  angry: 'Expresses anger and displeasure',
  cheerful: 'Positive and happy tone',
  excited: 'Upbeat and hopeful tone',
  friendly: 'Warm and approachable',
  hopeful: 'Warmth and longing',
  sad: 'Sorrow and unhappiness',
  shouting: 'Loud and emphatic',
  terrified: 'Very scared tone',
  unfriendly: 'Cold and indifferent',
  whispering: 'Soft and secretive',
  newscast: 'Professional broadcast style',
  assistant: 'Digital assistant style',
  chat: 'Casual conversation',
  customerservice: 'Customer support style',
};

// Voice descriptions
const VOICE_DESCRIPTIONS: Record<VoiceName, string> = {
  'en-US-GuyNeural': 'Professional male voice',
  'en-US-JennyNeural': 'Versatile female voice',
  'en-US-AriaNeural': 'Expressive female voice',
  'en-US-DavisNeural': 'Warm male voice',
  'en-US-SaraNeural': 'Friendly female voice',
};

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
        <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1.5">
          Voice
        </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={(e) => {
            onVoiceChange(e.target.value as VoiceName);
            onStyleChange(undefined);
          }}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
        >
          {AVAILABLE_VOICES.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.displayName}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">{VOICE_DESCRIPTIONS[selectedVoice]}</p>
      </div>

      {/* Style Selection */}
      <div>
        <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-1.5">
          Speaking Style <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <select
          id="style-select"
          value={selectedStyle || ''}
          onChange={(e) => onStyleChange(e.target.value as VoiceStyle || undefined)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
        >
          <option value="">Natural (Default)</option>
          {currentVoiceConfig?.styles.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {selectedStyle ? STYLE_DESCRIPTIONS[selectedStyle] : 'Natural speaking style'}
        </p>
      </div>

      {/* Styles count */}
      <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        {currentVoiceConfig?.styles.length} styles available
      </p>
    </div>
  );
};
