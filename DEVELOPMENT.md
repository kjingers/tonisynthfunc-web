# Development Guide

This guide covers local development, building, and further enhancements for the Toni TTS application.

## 🖥️ Local Development

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Git**: For version control
- **VS Code**: Recommended editor

### Environment Setup

1. **Clone and install**:
```bash
git clone https://github.com/kjingers/tonisynthfunc-web.git
cd tonisynthfunc-web
npm install
```

2. **Configure environment variables**:

Create a `.env` file in the project root:
```env
VITE_API_URL=https://tonisynthfunc-aegzcngjgudgcdeh.westus3-01.azurewebsites.net/api
VITE_API_KEY=<your-api-key>
```

> ⚠️ Never commit the `.env` file to version control.

3. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 📁 Code Structure

### Components

- **`src/App.tsx`**: Main application component with state management
- **`src/components/VoiceSelector.tsx`**: Voice and speaking style dropdown pickers
- **`src/components/AudioPlayer.tsx`**: Audio playback with play/pause, progress, download

### API Layer

- **`src/utils/api.ts`**: API client for Azure Functions
  - `startBatchSynthesis()`: Initiates TTS processing
  - `checkBatchSynthesis()`: Polls for completion and retrieves audio URL

### Types

- **`src/types/index.ts`**: TypeScript interfaces for API requests/responses

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# The output is in dist/
ls dist/
```

The build creates optimized static files ready for deployment.

## 🚀 Deployment

### Azure Static Web Apps (Current Setup)

The app is deployed via GitHub Actions. On push to `master`:

1. GitHub Action triggers
2. Builds the React app
3. Deploys to Azure Static Web Apps

To deploy manually:
```bash
npm run build
# Then upload dist/ to Azure Static Web Apps via Azure Portal or CLI
```

### Authentication Configuration

Edit `staticwebapp.config.json` to configure:

```json
{
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<tenant-id>/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  }
}
```

## 📱 iOS App Development

The iOS app is in a separate folder: `tonisynthfunc-ios/`

### Setup

```bash
cd ../tonisynthfunc-ios
npm install
```

### Local Development (with Expo Go)

```bash
npx expo start
```

Scan the QR code with your iPhone camera to open in Expo Go.

### Publishing Updates

```bash
# Login to Expo
npx expo login

# Publish an update
eas update --branch preview --message "Description of changes"
```

### iOS App Structure

```
tonisynthfunc-ios/
├── App.tsx                      # Entry point
├── src/
│   ├── screens/
│   │   └── HomeScreen.tsx       # Main TTS screen
│   ├── components/
│   │   ├── VoiceSelector.tsx    # Voice picker (React Native)
│   │   └── AudioPlayer.tsx      # Audio player (React Native)
│   ├── utils/
│   │   └── api.ts               # Same API as web
│   └── types/
│       └── index.ts             # Shared types
├── app.json                     # Expo configuration
└── eas.json                     # EAS Build configuration
```

## 🔧 Making Changes

### Adding a New Voice

Edit `src/components/VoiceSelector.tsx`:

```typescript
const VOICES: Voice[] = [
  { id: 'en-US-GuyNeural', name: 'Guy (US Male)' },
  { id: 'en-US-NewVoice', name: 'New Voice (Description)' }, // Add here
  // ...
];
```

### Adding a Speaking Style

Edit `src/components/VoiceSelector.tsx`:

```typescript
const SPEAKING_STYLES: SpeakingStyle[] = [
  { id: 'hopeful', name: 'Hopeful' },
  { id: 'newstyle', name: 'New Style' }, // Add here
  // ...
];
```

### Modifying API Endpoints

Edit `src/utils/api.ts` to change how the app communicates with the backend.

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure your domain is in the Azure Function's CORS whitelist
- For local dev, add `http://localhost:5173`

**Authentication Issues**
- Check Azure AD app registration settings
- Verify redirect URIs include your domain

**Audio Not Playing (iOS)**
- Ensure phone is not on silent mode
- Check that `playsInSilentModeIOS: true` is set in AudioPlayer

### Debugging

Open browser DevTools (F12) to check:
- Network tab for API calls
- Console for errors

## 🚧 Future Enhancements (Ideas)

Potential improvements for the application:

1. **Custom Filename Input**: Add text field for naming downloaded audio files
2. **AI-Generated Filenames**: Use AI to suggest 5-20 character filenames based on content
3. **Audio History**: Save previously generated audio for replay
4. **Favorites**: Save voice/style combinations
5. **SSML Editor**: Advanced users can edit Speech Synthesis Markup Language
6. **Progress Bar**: Show detailed progress during batch processing
7. **Multiple File Export**: Generate and download multiple audio files at once

## 📚 Resources

- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Cognitive Services TTS](https://docs.microsoft.com/azure/cognitive-services/speech-service/)
- [React Documentation](https://react.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
