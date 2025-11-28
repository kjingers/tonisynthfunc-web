# Toni TTS - Text-to-Speech Web Application

A modern Text-to-Speech web application powered by Azure Cognitive Services. This is the frontend UI for the [tonisynthfunc](https://github.com/kingersoll/ToniText2Speech) Azure Functions backend.

## 🎯 Overview

Toni TTS allows users to convert text to natural-sounding speech using Azure's neural voices. The application supports multiple voices, speaking styles, and can handle large text inputs through batch processing.

## ✨ Features

- 🎙️ **Multiple Neural Voices**: 16+ Azure neural voices (Guy, Jenny, Aria, Davis, etc.)
- 🎭 **Speaking Styles**: 15 emotional styles (hopeful, cheerful, excited, whispering, etc.)
- 📝 **Large Text Support**: Batch processing for texts of any length
- 🔊 **Audio Playback**: Built-in player with play/pause and progress tracking
- 💾 **Download**: Save generated audio as WAV files
- 🔐 **Microsoft Authentication**: Secured with Azure AD/Entra ID
- 📱 **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  Web Frontend   │────▶│  Azure Functions    │────▶│ Azure Cognitive  │
│  (This Repo)    │     │  (tonisynthfunc)    │     │ Services TTS     │
└─────────────────┘     └─────────────────────┘     └──────────────────┘
        │
        ▼
┌─────────────────┐
│  Expo Go App    │
│  (iOS Preview)  │
└─────────────────┘
```

## 🚀 Live Deployments

| Platform | URL/Access | Hosting |
|----------|------------|---------|
| **Web App** | https://witty-beach-06808011e.3.azurestaticapps.net | Azure Static Web Apps |
| **iOS App** | Expo Go → Login → Projects → tonisynthfunc-ios | Expo EAS |

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: [Azure Functions (Python)](https://github.com/kingersoll/ToniText2Speech)
- **Authentication**: Azure AD / Microsoft Entra ID
- **Hosting**: Azure Static Web Apps (Free tier)
- **iOS**: React Native + Expo

## 📦 Project Structure

```
tonisynthfunc-web/
├── src/
│   ├── components/
│   │   ├── VoiceSelector.tsx    # Voice and style picker
│   │   └── AudioPlayer.tsx      # Audio playback controls
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── api.ts               # API client for Azure Functions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Entry point
├── staticwebapp.config.json     # Azure Static Web Apps + Auth config
├── .env                         # Environment variables (not in repo)
└── package.json
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to the Azure Functions backend

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kingersoll/ToniText2Speech-web.git
cd tonisynthfunc-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=<your-azure-function-url>
VITE_API_KEY=<your-azure-function-key>
```

4. Start the development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## 🚀 Deployment

### Azure Static Web Apps

The app is configured for Azure Static Web Apps with GitHub Actions CI/CD:

1. Push to the `master` branch
2. GitHub Actions automatically builds and deploys

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to Azure Static Web Apps
```

## 📱 iOS App (Expo)

The iOS version is available through Expo Go:

1. Install **Expo Go** on your iPhone
2. Login with your Expo account
3. Find **tonisynthfunc-ios** in the Projects section
4. Tap to open

To update the iOS app:
```bash
cd ../tonisynthfunc-ios
eas update --branch preview --message "Your update message"
```

## 💰 Disabling Resources (Cost Saving)

### Disable Web Frontend

To stop the Azure Static Web Apps (and stop serving the web UI):

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Static Web Apps**
3. Find `witty-beach-06808011e` (or your app name)
4. Either:
   - **Stop** the app (temporary): Not available for Static Web Apps
   - **Delete** the app (permanent): Click Delete
   
Alternatively, to just block access without deleting:
- Edit `staticwebapp.config.json` and remove all allowed routes

**Note**: Azure Static Web Apps free tier has no cost, so disabling is optional.

### Disable Expo/iOS Frontend

To remove the published Expo app:

1. Go to [Expo Dashboard](https://expo.dev)
2. Login with your account
3. Navigate to **Projects** → **tonisynthfunc-ios**
4. Go to **Updates** and delete published updates
5. Or delete the entire project

**Note**: Expo free tier has no cost for published updates.

### Disable Backend (Main Cost Saver)

The Azure Functions backend is where costs occur. See the [tonisynthfunc](https://github.com/kingersoll/ToniText2Speech) repo for instructions on stopping the function app.

## 🔐 Authentication

The web app uses Microsoft/Azure AD authentication configured in `staticwebapp.config.json`:

- Login is required for all routes except `/login`
- Uses Azure AD provider (`aad`)
- Sessions managed by Azure Static Web Apps

To disable authentication, remove the `routes` section from `staticwebapp.config.json`.

## 📄 Related Repositories

- **Backend**: [kjingers/tonisynthfunc](https://github.com/kingersoll/ToniText2Speech) - Azure Functions for TTS processing

## 📝 License

MIT

## 👤 Author

Kurtis Ingersoll
