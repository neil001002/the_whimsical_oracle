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
- **Text-to-Speech**: Native TTS on mobile, Web Speech API on web
- **Voice Chat**: Real-time voice conversations with oracles (requires custom build)
- **Persona-specific Voice Styles**: Each oracle has unique voice characteristics

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
- **React Native** with Expo SDK 52
- **Expo Router** for navigation
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **Expo Linear Gradient** for mystical visual effects

### Backend & Services
- **Supabase** for database and authentication
- **LiveKit** for real-time voice chat
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
| Voice Chat | ❌ | ✅* | ✅* | ❌ |
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

# LiveKit (for voice chat)
EXPO_PUBLIC_LIVEKIT_URL=your-livekit-url
EXPO_PUBLIC_LIVEKIT_API_KEY=your-livekit-api-key
EXPO_PUBLIC_LIVEKIT_API_SECRET=your-livekit-api-secret

# Tavus (for video oracle)
EXPO_PUBLIC_TAVUS_API_KEY=your-tavus-api-key

# RevenueCat (for subscriptions)
EXPO_PUBLIC_REVENUECAT_API_KEY=your-revenuecat-api-key
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

### Web Deployment
```bash
npm run build:web
```

### Mobile Apps (Custom Development Build)
```bash
# Configure EAS
eas login
eas build:configure

# Build for Android
npm run build:android

# Build for iOS
eas build --platform ios --profile production
```

## 🎯 Key Features Implementation

### Oracle Generation System
- **Smart Content**: Tier-based content (basic vs premium phrases)
- **Persona Integration**: Each oracle has unique response patterns
- **Confidence Scoring**: AI-like confidence ratings for mystical authenticity
- **Category System**: Career, relationships, health, creativity, finance, growth

### Voice System Architecture
- **Platform Detection**: Automatic fallback to appropriate TTS system
- **Persona Voice Mapping**: Each oracle has unique voice characteristics
- **Error Handling**: Graceful degradation when voice services unavailable
- **Real-time Chat**: LiveKit integration for interactive conversations

### Video Oracle Technology
- **Tavus AI Integration**: Lifelike AI video conversations
- **Session Management**: Proper connection handling and cleanup
- **Premium Gating**: Video features restricted to paid subscribers
- **Cross-platform**: Works on web and mobile with proper builds

### Subscription System
- **RevenueCat Integration**: Industry-standard subscription management
- **Tier-based Features**: Progressive feature unlocking
- **Platform Compatibility**: Handles web limitations gracefully
- **Restore Purchases**: Full purchase restoration support

## 🔒 Security & Privacy

- **Row Level Security**: Database-level access control
- **Authentication**: Secure user authentication via Supabase
- **API Key Protection**: Server-side API key management
- **Data Encryption**: All data encrypted in transit and at rest

## 🌟 Unique Selling Points

1. **Multi-modal Interaction**: Text, voice, and video oracle consultations
2. **Personalized Experience**: 5 unique oracle personas with distinct personalities
3. **Global Accessibility**: 12+ languages with cultural adaptations
4. **Premium AI Features**: Advanced video conversations and real-time voice chat
5. **Mystical Design**: Immersive cosmic theme with attention to detail
6. **Cross-platform**: Seamless experience across web and mobile

## 📊 Performance Optimizations

- **Lazy Loading**: Components and screens loaded on demand
- **Image Optimization**: Efficient image loading and caching
- **Animation Performance**: Hardware-accelerated animations
- **Bundle Splitting**: Optimized bundle sizes for faster loading
- **Offline Support**: Core features work without internet

## 🎨 Design Philosophy

The app follows a "mystical minimalism" approach:
- **Cosmic Color Palette**: Deep purples, cosmic blues, and mystical gold
- **Smooth Animations**: Subtle, meaningful animations that enhance the mystical experience
- **Typography**: Elegant serif fonts (Cinzel, Playfair Display) for mystical authenticity
- **Spacing**: Generous white space for clarity and focus
- **Accessibility**: High contrast ratios and screen reader support

## 🚀 Future Roadmap

- **AI Chat Integration**: GPT-powered conversational oracles
- **Astrology Features**: Birth chart integration and cosmic timing
- **Social Features**: Share readings and connect with other seekers
- **Wearable Integration**: Apple Watch and Android Wear support
- **AR/VR Experiences**: Immersive mystical environments

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

*"Where cosmic wisdom meets earthly guidance"* ✨🔮✨