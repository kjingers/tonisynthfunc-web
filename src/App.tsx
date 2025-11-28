import { useState } from 'react';
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

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }

    setStatus('starting');
    setStatusMessage('Starting synthesis...');
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
      setStatusMessage(`Processing ${startResponse.text_length.toLocaleString()} characters... (est. ${startResponse.estimated_duration_minutes.toFixed(1)} min)`);

      // Step 2: Check synthesis status (this polls internally for up to 3 min)
      const checkResponse = await checkBatchSynthesis(startResponse.synthesis_id);

      if (checkResponse.status === 'completed' && checkResponse.audio_url) {
        setAudioUrl(checkResponse.audio_url);
        setResult(checkResponse);
        setStatus('completed');
        setStatusMessage('Audio ready!');
      } else if (checkResponse.status === 'timeout') {
        setStatus('error');
        setError('Synthesis is taking longer than expected. Please try again in a few minutes.');
      } else {
        setStatus('error');
        setError(checkResponse.error || 'Synthesis failed');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      console.error('Error:', err);
    }
  };

  const isProcessing = status === 'starting' || status === 'processing';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🎙️ Toni TTS
          </h1>
          <p className="text-purple-100 text-lg">
            Text-to-Speech powered by Azure Cognitive Services
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Text Input & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input Card */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Text</h2>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type the text you want to convert to speech...

For example: Once upon a time, in a land far away..."
                disabled={isProcessing}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              
              <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                <span>{text.length.toLocaleString()} characters</span>
                <span>
                  {text.length > 5000 
                    ? '📚 Long text - will use batch processing'
                    : '⚡ Short text - fast processing'}
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateSpeech}
              disabled={isProcessing || !text.trim()}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all ${
                isProcessing || !text.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {statusMessage}
                </span>
              ) : (
                '🎙️ Generate Speech'
              )}
            </button>
          </div>

          {/* Right Column - Voice Settings */}
          <div className="bg-white rounded-lg shadow-xl p-6 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Voice Settings</h2>
            <VoiceSelector
              selectedVoice={voice}
              selectedStyle={style}
              onVoiceChange={setVoice}
              onStyleChange={setStyle}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Audio Player */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Audio Output</h2>
            <AudioPlayer
              audioUrl={audioUrl}
              synthesisId={synthesisId}
              durationSeconds={result?.duration_seconds}
              sizeBytes={result?.size_bytes}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-purple-100">
          <p className="text-sm">
            Built with React + TypeScript + Azure Speech Services
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
