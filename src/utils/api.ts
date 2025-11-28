import type { BatchStartRequest, BatchStartResponse, BatchCheckResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Start a batch text-to-speech synthesis job
 * Returns immediately with synthesis_id and pre-signed audio URL
 */
export async function startBatchSynthesis(request: BatchStartRequest): Promise<BatchStartResponse> {
  const url = new URL(`${API_BASE_URL}/batch-start`);
  if (API_KEY) url.searchParams.set('code', API_KEY);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to start synthesis: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check synthesis status and get the audio URL when complete
 * This endpoint polls internally for up to 3 minutes
 */
export async function checkBatchSynthesis(synthesisId: string): Promise<BatchCheckResponse> {
  const url = new URL(`${API_BASE_URL}/batch-check`);
  url.searchParams.set('synthesis_id', synthesisId);
  if (API_KEY) url.searchParams.set('code', API_KEY);

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to check synthesis: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Sync TTS for short texts (legacy, <5000 chars)
 */
export async function syncTTS(text: string, voice?: string): Promise<{ url: string }> {
  const url = new URL(`${API_BASE_URL}/sync-tts`);
  if (API_KEY) url.searchParams.set('code', API_KEY);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to synthesize: ${response.statusText}`);
  }

  return response.json();
}
