import React, { useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string | null;
  synthesisId: string | null;
  durationSeconds?: number;
  sizeBytes?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  synthesisId,
  durationSeconds,
  sizeBytes,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${synthesisId || 'audio'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!audioUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <p className="text-gray-500">No audio generated yet</p>
        <p className="text-gray-400 text-sm mt-1">Enter text and click "Generate Speech" to create audio</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Audio Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Audio Ready</h3>
          <p className="text-sm text-gray-500">
            {durationSeconds && formatDuration(durationSeconds)}
            {durationSeconds && sizeBytes && ' • '}
            {sizeBytes && formatSize(sizeBytes)}
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
          ✓ Complete
        </span>
      </div>

      {/* Native Audio Controls */}
      <div className="mb-4">
        <audio
          controls
          src={audioUrl}
          className="w-full"
          style={{ height: '40px' }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePlayPause}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download MP3
        </button>
      </div>

      {/* Copy URL */}
      <button
        onClick={() => navigator.clipboard.writeText(audioUrl)}
        className="w-full mt-3 py-2 px-4 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm"
      >
        📋 Copy Audio URL
      </button>
    </div>
  );
};
