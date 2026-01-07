import { useState, useCallback } from 'react';
import { VoiceSelector } from './components/VoiceSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { startBatchSynthesis, checkBatchSynthesis } from './utils/api';
import type { VoiceName, VoiceStyle, BatchCheckResponse } from './types';
import './App.css';

type SynthesisStatus = 'idle' | 'starting' | 'processing' | 'completed' | 'error';

function App() {
  // Text input
  const [text, setText] = useState('');
  
  // Voice settings
  const [voice, setVoice] = useState<VoiceName>('en-US-GuyNeural');
  const [style, setStyle] = useState<VoiceStyle | undefined>('hopeful');
  
  // Synthesis state
  const [status, setStatus] = useState<SynthesisStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Result
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [synthesisId, setSynthesisId] = useState<string | null>(null);
  const [result, setResult] = useState<BatchCheckResponse | null>(null);

  // Clear error with animation feedback
  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  // Clear text helper
  const clearText = useCallback(() => {
    setText('');
  }, []);

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }

    setStatus('starting');
    setStatusMessage('Initializing speech synthesis...');
    setError(null);
    setAudioUrl(null);
    setResult(null);

    try {
      // Step 1: Start batch synthesis
      const startResponse = await startBatchSynthesis({
        text: text.trim(),
        voice,
        style,
      });

      setSynthesisId(startResponse.synthesis_id);
      setStatus('processing');
      setStatusMessage(`Processing ${startResponse.text_length.toLocaleString()} characters • Est. ${startResponse.estimated_duration_minutes.toFixed(1)} min`);

      // Step 2: Check synthesis status (this polls internally for up to 3 min)
      const checkResponse = await checkBatchSynthesis(startResponse.synthesis_id);

      if (checkResponse.status === 'completed' && checkResponse.audio_url) {
        setAudioUrl(checkResponse.audio_url);
        setResult(checkResponse);
        setStatus('completed');
        setStatusMessage('Your audio is ready!');
      } else if (checkResponse.status === 'timeout') {
        setStatus('error');
        setError('Synthesis is taking longer than expected. Please try again in a few minutes.');
      } else {
        setStatus('error');
        setError(checkResponse.error || 'Synthesis failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to generate speech. Please check your connection and try again.');
      console.error('Error:', err);
    }
  };

  const isProcessing = status === 'starting' || status === 'processing';
  const charCount = text.length;
  const isLongText = charCount > 5000;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header - HCI: Clear branding and purpose */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3 shadow-lg">
            <span className="text-2xl" role="img" aria-label="Microphone">🎙️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Toni TTS
          </h1>
          <p className="text-purple-100 text-base max-w-md mx-auto">
            Transform your text into natural-sounding speech with Azure AI
          </p>
        </header>

        {/* Error Alert - HCI: Clear feedback with dismiss action */}
        {error && (
          <div 
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Something went wrong</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={dismissError}
              className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Success Message - HCI: Positive feedback */}
        {status === 'completed' && (
          <div 
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-green-700 text-sm">{statusMessage}</p>
            </div>
          </div>
        )}

        {/* Main Content - HCI: Clear visual grouping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Text Input & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input Card - HCI: Prominent primary action area */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center text-xs">📝</span>
                    Enter Your Text
                  </h2>
                  {text.length > 0 && (
                    <button
                      onClick={clearText}
                      disabled={isProcessing}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                      aria-label="Clear text"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here...

Example: Welcome to Toni TTS! I can transform your written words into natural-sounding speech using the power of Azure's neural voices."
                    disabled={isProcessing}
                    className="w-full h-64 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-gray-700 placeholder-gray-400"
                    aria-label="Text to convert to speech"
                  />
                </div>
                
                {/* Character Count - HCI: Real-time feedback */}
                <div className="flex justify-between items-center mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${charCount > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                      {charCount.toLocaleString()} characters
                    </span>
                    {charCount > 0 && (
                      <span className="text-gray-400">•</span>
                    )}
                    {charCount > 0 && (
                      <span className="text-gray-500">
                        ~{Math.ceil(charCount / 150)} min audio
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isLongText 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isLongText ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Batch processing
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Fast processing
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Generate Button - HCI: Clear primary action */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleGenerateSpeech}
                  disabled={isProcessing || !text.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all transform ${
                    isProcessing || !text.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                  aria-busy={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{statusMessage}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Generate Speech
                    </span>
                  )}
                </button>
                
                {/* Hint text - HCI: Guidance */}
                {!text.trim() && (
                  <p className="text-center text-gray-400 text-sm mt-3">
                    Enter some text above to get started
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Voice Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-xs">🎭</span>
              Voice Settings
            </h2>
            <VoiceSelector
              selectedVoice={voice}
              selectedStyle={style}
              onVoiceChange={setVoice}
              onStyleChange={setStyle}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Audio Player - HCI: Clear result area */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center text-xs">🔊</span>
              Audio Output
            </h2>
            <AudioPlayer
              audioUrl={audioUrl}
              synthesisId={synthesisId}
              durationSeconds={result?.duration_seconds}
              sizeBytes={result?.size_bytes}
            />
          </div>
        </div>

        {/* Footer - HCI: Subtle branding */}
        <footer className="text-center mt-10 text-purple-200/80">
          <p className="text-sm">
            Powered by Azure Cognitive Services • Built with React + TypeScript
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
