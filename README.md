# 🔮 The Whimsical Oracle

A mystical oracle app that provides cosmic wisdom and spiritual guidance through AI-powered personas, voice interactions, and video consultations. Built with React Native, Expo, and modern web technologies.

## ✨ Features

### 🎭 Multiple Oracle Personas
- **Cosmic Sage**: Ancient wisdom from the stars
- **Mystical Librarian**: Bookish wisdom with literary enchantments
- **Starlight Fairy**: Playful forest spirit with nature-focused guidance
- **Crystal Prophet**: Mysterious seer channeling gemstone energies
- **Time Weaver**: Temporal guardian connecting past, present, and future

### 🎙️ Advanced Voice Features
- **ElevenLabs AI Voice**: Premium AI-generated voices via secure API routes
- **Native TTS Fallback**: Automatic fallback to device speech synthesis
- **Persona-specific Voice Styles**: Each oracle has unique voice characteristics
- **Cross-platform Audio**: Works on both mobile and web

### 📹 Video Oracle Sessions
- **AI-Powered Video Conversations**: Face-to-face interactions with oracle personas
- **Real-time Video Chat**: Powered by Tavus AI for lifelike conversations
- **Premium Feature**: Available for Premium and Mystic subscribers

### 🌍 Multi-language Support
- **12+ Languages**: English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Arabic, Hindi, Russian
- **Real-time Translation**: Powered by i18next with comprehensive oracle-specific translations
- **RTL Support**: Full support for right-to-left languages like Arabic

### 💎 Subscription Tiers
- **Free Tier**: 3 daily readings, basic personas, voice narration
- **Premium Tier**: Unlimited readings, enhanced interpretations, all personas
- **Mystic Tier**: Everything plus video oracle, real-time voice chat, cosmic calendar

### 🎨 Beautiful UI/UX
- **Mystical Design**: Cosmic gradients, starfield animations, ornate frames
- **Responsive**: Optimized for web, iOS, and Android
- **Accessibility**: Full screen reader support and keyboard navigation
- **Dark Theme**: Mystical cosmic color scheme with golden accents

## 🚀 Technology Stack

### Frontend
- **React Native** with Expo SDK 53
- **Expo Router** for navigation
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **Expo Linear Gradient** for mystical visual effects

### Backend & Services
- **Supabase** for database and authentication
- **ElevenLabs** for AI voice generation
- **Tavus AI** for video oracle conversations
- **RevenueCat** for subscription management
- **i18next** for internationalization

### Database
- **PostgreSQL** via Supabase
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

## 📱 Platform Support

| Feature | Web | iOS | Android | Expo Go |
|---------|-----|-----|---------|---------|
| Basic Oracle | ✅ | ✅ | ✅ | ✅ |
| Voice TTS | ✅ | ✅ | ✅ | ✅ |
| ElevenLabs Voice | ✅ | ✅ | ✅ | ❌ |
| Video Oracle | ✅ | ✅* | ✅* | ❌ |
| Subscriptions | ❌ | ✅* | ✅* | ❌ |

*Requires custom development build

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd whimsical-oracle

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables
```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# ElevenLabs (for AI voice)
EXPO_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Tavus (for video oracle)
EXPO_PUBLIC_TAVUS_API_KEY=your-tavus-api-key

# RevenueCat (for subscriptions)
EXPO_PUBLIC_REVENUECAT_API_KEY=your-revenuecat-api-key

# API Base URL (for production mobile builds)
EXPO_PUBLIC_API_BASE_URL=https://your-app.netlify.app
```

### Running the App

#### Web Development
```bash
npm run dev
```

#### Mobile Development
```bash
# iOS Simulator
npm run dev:ios

# Android Emulator
npm run dev:android
```

## 🏗️ Building for Production

### Web Deployment (Netlify)
```bash
# Build for web
npm run build:web

# Deploy to Netlify (automatic via git integration)
```

### Mobile Apps (Custom Development Build)
```bash
# Configure EAS
eas login
eas build:configure

# Build for Android
npm run build:android-preview  # For testing
npm run build:android-production  # For Play Store

# Build for iOS
eas build --platform ios --profile production
```

## 🎯 Key Features Implementation

### Voice System Architecture
- **API Routes**: Secure server-side ElevenLabs API calls via `/api/elevenlabs-tts+api.ts`
- **Platform Detection**: Automatic audio handling for web vs mobile
- **Fallback System**: Native TTS when ElevenLabs unavailable
- **Error Handling**: Comprehensive error recovery and user feedback

### Mobile Audio Implementation
- **expo-av**: Audio.Sound for mobile platforms
- **HTMLAudioElement**: For web platforms
- **Base64 Audio**: Blob to base64 conversion for mobile compatibility
- **Audio Permissions**: Proper Android permissions for audio playback

### Web Deployment Features
- **Server Output**: Expo Router server mode for API routes
- **Netlify Functions**: Automatic serverless function deployment
- **CORS Headers**: Proper cross-origin request handling
- **Environment Variables**: Secure server-side API key management

### Subscription System
- **RevenueCat Integration**: Industry-standard subscription management
- **Mock Implementation**: Development-friendly testing without RevenueCat
- **Platform Compatibility**: Handles web limitations gracefully
- **Error Recovery**: Comprehensive error handling and user feedback

## 🔧 API Routes

### ElevenLabs TTS API
- **Endpoint**: `/api/elevenlabs-tts`
- **Method**: POST
- **Body**: `{ text: string, personaId: string }`
- **Response**: Audio/MP3 or JSON error
- **Security**: Server-side API key handling

### Tavus Video API
- **Endpoint**: `/api/tavus-conversation`
- **Methods**: POST (create), GET (status), DELETE (end)
- **Features**: Video conversation management
- **Security**: Server-side API key handling

## 🔒 Security & Privacy

- **Row Level Security**: Database-level access control
- **API Key Protection**: Server-side API key management
- **CORS Configuration**: Proper cross-origin security
- **Data Encryption**: All data encrypted in transit and at rest

## 🌟 Unique Selling Points

1. **Multi-modal Interaction**: Text, voice, and video oracle consultations
2. **AI-Powered Voices**: Premium ElevenLabs AI voice generation
3. **Cross-platform Compatibility**: Seamless web and mobile experience
4. **Secure API Architecture**: Server-side API routes for security
5. **Fallback Systems**: Graceful degradation when services unavailable
6. **Production Ready**: Comprehensive error handling and user feedback

## 📊 Performance Optimizations

- **Lazy Loading**: Components and screens loaded on demand
- **Audio Caching**: Efficient audio loading and memory management
- **API Route Optimization**: Minimal server response times
- **Bundle Splitting**: Optimized bundle sizes for faster loading
- **Error Boundaries**: Graceful error handling and recovery

## 🚀 Deployment Instructions

### Web (Netlify)
1. Connect repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically via git push

### Mobile (EAS Build)
1. Configure environment variables in `eas.json`
2. Run `eas build --platform android --profile production`
3. Submit to Google Play Store

## 🎨 Design Philosophy

The app follows a "mystical minimalism" approach:
- **Cosmic Color Palette**: Deep purples, cosmic blues, and mystical gold
- **Smooth Animations**: Subtle, meaningful animations that enhance the mystical experience
- **Typography**: Elegant serif fonts (Cinzel, Playfair Display) for mystical authenticity
- **Accessibility**: High contrast ratios and screen reader support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

*"Where cosmic wisdom meets earthly guidance"* ✨🔮✨