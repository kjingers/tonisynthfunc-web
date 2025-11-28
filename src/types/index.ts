// Voice options available in Azure Speech Service
export type VoiceName = 
  | 'en-US-AriaNeural'
  | 'en-US-DavisNeural'
  | 'en-US-GuyNeural'
  | 'en-US-JennyNeural'
  | 'en-US-SaraNeural';

export type VoiceStyle = 
  | 'angry' | 'cheerful' | 'excited' | 'friendly' | 'hopeful'
  | 'sad' | 'shouting' | 'terrified' | 'unfriendly' | 'whispering'
  | 'newscast' | 'assistant' | 'chat' | 'customerservice';

// Request to start batch synthesis
export interface BatchStartRequest {
  text: string;
  voice?: VoiceName;
  style?: VoiceStyle;
}

// Response from batch-start endpoint
export interface BatchStartResponse {
  status: 'started';
  synthesis_id: string;
  audio_url: string;
  status_check_url: string;
  voice: string;
  text_length: number;
  estimated_duration_minutes: number;
  message: string;
}

// Response from batch-check endpoint
export interface BatchCheckResponse {
  status: 'completed' | 'timeout' | 'failed';
  synthesis_id: string;
  audio_url?: string;
  size_bytes?: number;
  duration_seconds?: number;
  message: string;
  error?: string;
}

// Voice configuration
export interface VoiceConfig {
  name: VoiceName;
  displayName: string;
  styles: VoiceStyle[];
}

export const AVAILABLE_VOICES: VoiceConfig[] = [
  {
    name: 'en-US-GuyNeural',
    displayName: 'Guy (Male)',
    styles: ['angry', 'cheerful', 'excited', 'friendly', 'hopeful', 'newscast', 'sad', 'shouting', 'terrified', 'unfriendly', 'whispering'],
  },
  {
    name: 'en-US-JennyNeural',
    displayName: 'Jenny (Female)',
    styles: ['angry', 'assistant', 'chat', 'cheerful', 'customerservice', 'excited', 'friendly', 'hopeful', 'newscast', 'sad', 'shouting', 'terrified', 'unfriendly', 'whispering'],
  },
  {
    name: 'en-US-AriaNeural',
    displayName: 'Aria (Female)',
    styles: ['angry', 'cheerful', 'excited', 'friendly', 'hopeful', 'sad', 'shouting', 'terrified', 'unfriendly', 'whispering'],
  },
  {
    name: 'en-US-DavisNeural',
    displayName: 'Davis (Male)',
    styles: ['angry', 'cheerful', 'excited', 'friendly', 'hopeful', 'sad', 'shouting', 'terrified', 'unfriendly', 'whispering'],
  },
  {
    name: 'en-US-SaraNeural',
    displayName: 'Sara (Female)',
    styles: ['angry', 'cheerful', 'excited', 'friendly', 'hopeful', 'sad', 'shouting', 'terrified', 'unfriendly', 'whispering'],
  },
];
