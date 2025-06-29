import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      common: {
        close: 'Close',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        retry: 'Retry',
      },
      settings: {
        title: 'Mystical Settings',
        subtitle: 'Configure your oracle experience',
        sections: {
          language: {
            title: 'Language',
            subtitle: 'Choose your mystical language',
          },
          persona: {
            title: 'Oracle Persona',
            subtitle: 'Choose your mystical guide',
          },
          voice: {
            title: 'Voice & Communication',
            voiceNarration: {
              title: 'Voice Narration',
              subtitle: 'Spoken oracle wisdom',
            },
            realTimeChat: {
              title: 'Real-time Voice Chat',
              subtitle: 'Interactive voice conversations',
            },
            serviceStatus: 'Voice Service Status:',
            liveKitStatus: 'LiveKit Voice Chat:',
            ttsStatus: 'Voice TTS:',
            available: 'Available',
            requiresCustomBuild: 'Requires Custom Build',
            limited: 'Limited',
            testVoice: 'Test Voice',
            stopVoice: 'Stop Voice Test',
            testNote: 'Test how your selected oracle sounds',
            connectVoiceChat: 'Connect Voice Chat',
            disconnectVoiceChat: 'Disconnect Voice Chat',
            voiceChatConnected: '🎙️ Voice chat connected',
            warning: '⚠️ Voice chat requires a custom development build with WebRTC support. Currently using Web Speech API for basic voice features.',
            testMessage: 'Greetings, seeker. This is how {{persona}} sounds when speaking mystical wisdom.',
          },
          preferences: {
            title: 'Mystical Preferences',
            soundEffects: {
              title: 'Sound Effects',
              subtitle: 'Mystical audio feedback',
            },
            hapticFeedback: {
              title: 'Haptic Feedback',
              subtitle: 'Tactile mystical sensations',
            },
          },
          subscription: {
            title: 'Subscription Status',
            description: {
              free: 'Access to basic oracle features',
              premium: 'Full access to all mystical powers',
            },
            upgrade: 'Unlock Mystical Powers',
          },
        },
      },
      personas: {
        'cosmic-sage': {
          name: 'Cosmic Sage',
        },
        'mystical-librarian': {
          name: 'Mystical Librarian',
        },
        'starlight-fairy': {
          name: 'Starlight Fairy',
        },
        'crystal-prophet': {
          name: 'Crystal Prophet',
        },
        'time-weaver': {
          name: 'Time Weaver',
        },
      },
    },
  },
  es: {
    translation: {
      common: {
        close: 'Cerrar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        retry: 'Reintentar',
      },
      settings: {
        title: 'Configuración Mística',
        subtitle: 'Configura tu experiencia del oráculo',
        sections: {
          language: {
            title: 'Idioma',
            subtitle: 'Elige tu idioma místico',
          },
          persona: {
            title: 'Persona del Oráculo',
            subtitle: 'Elige tu guía místico',
          },
          voice: {
            title: 'Voz y Comunicación',
            voiceNarration: {
              title: 'Narración de Voz',
              subtitle: 'Sabiduría del oráculo hablada',
            },
            realTimeChat: {
              title: 'Chat de Voz en Tiempo Real',
              subtitle: 'Conversaciones de voz interactivas',
            },
            serviceStatus: 'Estado del Servicio de Voz:',
            liveKitStatus: 'Chat de Voz LiveKit:',
            ttsStatus: 'TTS de Voz:',
            available: 'Disponible',
            requiresCustomBuild: 'Requiere Compilación Personalizada',
            limited: 'Limitado',
            testVoice: 'Probar Voz',
            stopVoice: 'Detener Prueba de Voz',
            testNote: 'Prueba cómo suena tu oráculo seleccionado',
            connectVoiceChat: 'Conectar Chat de Voz',
            disconnectVoiceChat: 'Desconectar Chat de Voz',
            voiceChatConnected: '🎙️ Chat de voz conectado',
            warning: '⚠️ El chat de voz requiere una compilación de desarrollo personalizada con soporte WebRTC. Actualmente usando Web Speech API para funciones básicas de voz.',
            testMessage: 'Saludos, buscador. Así es como suena {{persona}} al hablar sabiduría mística.',
          },
          preferences: {
            title: 'Preferencias Místicas',
            soundEffects: {
              title: 'Efectos de Sonido',
              subtitle: 'Retroalimentación de audio místico',
            },
            hapticFeedback: {
              title: 'Retroalimentación Háptica',
              subtitle: 'Sensaciones místicas táctiles',
            },
          },
          subscription: {
            title: 'Estado de Suscripción',
            description: {
              free: 'Acceso a funciones básicas del oráculo',
              premium: 'Acceso completo a todos los poderes místicos',
            },
            upgrade: 'Desbloquear Poderes Místicos',
          },
        },
      },
      personas: {
        'cosmic-sage': {
          name: 'Sabio Cósmico',
        },
        'mystical-librarian': {
          name: 'Bibliotecario Místico',
        },
        'starlight-fairy': {
          name: 'Hada de Luz Estelar',
        },
        'crystal-prophet': {
          name: 'Profeta de Cristal',
        },
        'time-weaver': {
          name: 'Tejedor del Tiempo',
        },
      },
    },
  },
  fr: {
    translation: {
      common: {
        close: 'Fermer',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Sauvegarder',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        retry: 'Réessayer',
      },
      settings: {
        title: 'Paramètres Mystiques',
        subtitle: 'Configurez votre expérience oracle',
        sections: {
          language: {
            title: 'Langue',
            subtitle: 'Choisissez votre langue mystique',
          },
          persona: {
            title: 'Persona Oracle',
            subtitle: 'Choisissez votre guide mystique',
          },
          voice: {
            title: 'Voix et Communication',
            voiceNarration: {
              title: 'Narration Vocale',
              subtitle: 'Sagesse oracle parlée',
            },
            realTimeChat: {
              title: 'Chat Vocal en Temps Réel',
              subtitle: 'Conversations vocales interactives',
            },
            serviceStatus: 'État du Service Vocal:',
            liveKitStatus: 'Chat Vocal LiveKit:',
            ttsStatus: 'TTS Vocal:',
            available: 'Disponible',
            requiresCustomBuild: 'Nécessite une Compilation Personnalisée',
            limited: 'Limité',
            testVoice: 'Tester la Voix',
            stopVoice: 'Arrêter le Test Vocal',
            testNote: 'Testez comment votre oracle sélectionné sonne',
            connectVoiceChat: 'Connecter le Chat Vocal',
            disconnectVoiceChat: 'Déconnecter le Chat Vocal',
            voiceChatConnected: '🎙️ Chat vocal connecté',
            warning: '⚠️ Le chat vocal nécessite une compilation de développement personnalisée avec support WebRTC. Utilise actuellement Web Speech API pour les fonctions vocales de base.',
            testMessage: 'Salutations, chercheur. Voici comment {{persona}} sonne en parlant de sagesse mystique.',
          },
          preferences: {
            title: 'Préférences Mystiques',
            soundEffects: {
              title: 'Effets Sonores',
              subtitle: 'Retour audio mystique',
            },
            hapticFeedback: {
              title: 'Retour Haptique',
              subtitle: 'Sensations mystiques tactiles',
            },
          },
          subscription: {
            title: 'État de l\'Abonnement',
            description: {
              free: 'Accès aux fonctionnalités de base de l\'oracle',
              premium: 'Accès complet à tous les pouvoirs mystiques',
            },
            upgrade: 'Débloquer les Pouvoirs Mystiques',
          },
        },
      },
      personas: {
        'cosmic-sage': {
          name: 'Sage Cosmique',
        },
        'mystical-librarian': {
          name: 'Bibliothécaire Mystique',
        },
        'starlight-fairy': {
          name: 'Fée de Lumière Stellaire',
        },
        'crystal-prophet': {
          name: 'Prophète de Cristal',
        },
        'time-weaver': {
          name: 'Tisseur du Temps',
        },
      },
    },
  },
};

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

// RTL languages
export const RTL_LANGUAGES = ['ar'];

// Helper function to check if language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

// Detect device locale
const getDeviceLocale = (): string => {
  try {
    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode || 'en';
    
    // Check if we support this language
    const supportedLanguages = SUPPORTED_LANGUAGES.map(lang => lang.code);
    return supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';
  } catch (error) {
    console.warn('Failed to get device locale:', error);
    return 'en';
  }
};

// Storage helpers
const LANGUAGE_STORAGE_KEY = 'whimsical-oracle-language';

export const getStoredLanguage = (): string | null => {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to get stored language:', error);
      return null;
    }
  }
  // For mobile, you would use AsyncStorage here
  return null;
};

export const setStoredLanguage = (locale: string): void => {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch (error) {
      console.warn('Failed to store language:', error);
    }
  }
  // For mobile, you would use AsyncStorage here
};

// Initialize i18next
const initI18n = () => {
  const storedLanguage = getStoredLanguage();
  const deviceLanguage = getDeviceLocale();
  const initialLanguage = storedLanguage || deviceLanguage;

  let i18nInstance = i18n;

  // Only use LanguageDetector on web
  if (Platform.OS === 'web') {
    i18nInstance = i18n.use(LanguageDetector);
  }

  i18nInstance
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      debug: __DEV__,
      
      interpolation: {
        escapeValue: false,
      },

      detection: Platform.OS === 'web' ? {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      } : undefined,

      react: {
        useSuspense: false,
      },
    });

  return i18n;
};

// Initialize and export
const i18nInstance = initI18n();

export default i18nInstance;

// Export convenience functions
export const t = (key: string, params?: Record<string, any>): string => {
  return i18nInstance.t(key, params);
};

export const getCurrentLanguage = (): string => {
  return i18nInstance.language;
};

export const changeLanguage = async (locale: string): Promise<void> => {
  await i18nInstance.changeLanguage(locale);
  setStoredLanguage(locale);
};