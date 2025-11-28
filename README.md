# Toni Synth Function - Web App

A modern web-based synthesizer application that generates audio using Azure Functions.

## Features

- 🎵 **4 Waveform Types**: Sine, Square, Sawtooth, Triangle
- 🎚️ **Full Control**: Frequency, duration, amplitude controls
- 📈 **ADSR Envelope**: Attack, Decay, Sustain, Release parameters
- 📊 **Visual Feedback**: Real-time waveform visualization
- ☁️ **Cloud-Powered**: Audio generation via Azure Functions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Azure Functions (Python)
- **Audio**: Web Audio API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Azure Function URL:
```
VITE_API_URL=http://localhost:7071/api
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Select a waveform type (sine, square, sawtooth, or triangle)
2. Adjust frequency (20-2000 Hz)
3. Set duration (0.1-5 seconds)
4. Control amplitude (0-100%)
5. Fine-tune ADSR envelope parameters
6. Click "Generate Sound" to create and play audio
7. View the waveform visualization

## Azure Function Backend

This app requires the Toni Synth Azure Function backend to be running. The function generates audio data based on the parameters sent from the web app.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
