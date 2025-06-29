# The Whimsical Oracle

A mystical oracle app with voice features powered by LiveKit and native text-to-speech.

## Features

- 🔮 Mystical oracle readings with multiple personas
- 🎙️ Voice narration using native TTS (Android/iOS) and Web Speech API (Web)
- 💬 Real-time voice chat using LiveKit (requires custom build)
- 📱 Multi-platform support (Web, Android, iOS)
- ⭐ Rating and history system for omens

## Development Setup

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your LiveKit credentials

### Running the App

#### Web Development
```bash
npm run dev
```

#### Mobile Development (Expo Go - Limited Features)
```bash
npm run dev:android  # For Android
npm run dev:ios      # For iOS
```

**Note**: LiveKit voice chat features require a custom development build and won't work in Expo Go.

## Building for Production

### Android APK (Development Build)

1. Configure EAS:
   ```bash
   eas login
   eas build:configure
   ```

2. Build development APK:
   ```bash
   npm run build:android
   ```

3. Build preview APK (for testing):
   ```bash
   npm run build:android-preview
   ```

### iOS Development Build

```bash
eas build --platform ios --profile development
```

### Web Deployment

```bash
npm run build:web
```

## Voice Features

### Text-to-Speech (TTS)
- **Web**: Uses Web Speech API
- **Android/iOS**: Uses Expo Speech (native TTS)
- **Fallback**: Graceful degradation when TTS is unavailable

### Real-time Voice Chat
- **Requires**: Custom development build with LiveKit
- **Platforms**: Android, iOS (not available on web)
- **Features**: Real-time voice communication with the oracle

## Environment Variables

### Client-side (EXPO_PUBLIC_*)
- `EXPO_PUBLIC_LIVEKIT_URL`: LiveKit server URL
- `EXPO_PUBLIC_LIVEKIT_API_KEY`: LiveKit API key
- `EXPO_PUBLIC_LIVEKIT_API_SECRET`: LiveKit API secret

### Server-side (for API routes)
- `LIVEKIT_URL`: LiveKit server URL
- `LIVEKIT_API_KEY`: LiveKit API key  
- `LIVEKIT_API_SECRET`: LiveKit API secret

## Platform Compatibility

| Feature | Web | Android | iOS | Expo Go |
|---------|-----|---------|-----|---------|
| Basic Oracle | ✅ | ✅ | ✅ | ✅ |
| Web Speech TTS | ✅ | ❌ | ❌ | ❌ |
| Native TTS | ❌ | ✅* | ✅* | ✅ |
| LiveKit Voice Chat | ❌ | ✅* | ✅* | ❌ |

*Requires custom development build

## Troubleshooting

### "Requires Custom Build" Error
This means you're running in Expo Go, which doesn't support LiveKit. Build a custom development build using EAS Build.

### Voice Features Not Working
1. Check if running on supported platform
2. Verify environment variables are set
3. Ensure proper permissions (Android: RECORD_AUDIO)

### Build Failures
1. Ensure all dependencies are compatible
2. Check EAS Build logs for specific errors
3. Verify app.json configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## License

MIT License - see LICENSE file for details