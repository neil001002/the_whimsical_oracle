import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';
import LanguageDetector from 'i18next-browser-languagedetector';

// Enhanced translation resources with oracle-specific content
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
      home: {
        title: 'The Whimsical Oracle',
        subtitle: 'Where cosmic wisdom meets earthly guidance',
        greeting: {
          morning: 'Good Morning, Seeker',
          afternoon: 'Good Afternoon, Traveler',
          evening: 'Good Evening, Mystic',
        },
        dailyReadings: {
          title: 'Daily Mystical Readings',
          limitReached: 'Daily limit reached. Upgrade for unlimited mystical guidance!',
        },
        subscriptionBanner: {
          message: 'Unlock unlimited mystical wisdom and premium features!',
        },
        notifications: {
          limitReached: {
            title: '✨ Mystical Limit Reached',
            message: 'You\'ve reached your daily reading limit. Upgrade to Premium for unlimited cosmic guidance and enhanced mystical features!',
            action: 'Unlock Mystical Powers',
          },
          voiceWarning: {
            title: 'Voice Features Limited',
            message: 'Voice features are not fully available on this platform. For complete mystical voice functionality, use a custom development build.',
          },
          videoError: {
            title: 'Video Oracle Issue',
          },
        },
        persona: {
          mystic: 'MYSTIC',
        },
        videoOracle: {
          title: 'Video Oracle Session',
          start: 'Video Oracle',
          end: 'End Video',
        },
        omen: {
          guidance: 'Mystical Guidance',
          resonance: 'Cosmic Resonance',
          category: 'Category',
          speaking: '🎵 Oracle speaking mystical wisdom...',
        },
        oracle: {
          awaits: 'The Oracle Awaits...',
          instruction: 'Touch the mystical crystal to receive your cosmic guidance',
          generating: 'Consulting the Cosmic Forces...',
          receive: 'Receive Oracle',
        },
        upgrade: {
          text: 'Unlock unlimited mystical wisdom',
          accessibility: 'Unlock unlimited mystical wisdom',
        },
      },
      oracle: {
        phrases: {
          basic: {
            1: 'The digital ravens whisper of unexpected connections',
            2: 'Silver threads weave through the fabric of tomorrow',
            3: 'Ancient wisdom flows through modern channels',
            4: 'The cosmic dance reveals hidden patterns',
            5: 'Stars align to illuminate forgotten paths',
          },
          premium: {
            1: 'The cosmic symphony resonates with your soul\'s deepest yearnings',
            2: 'Ethereal guardians dance around the threads of your destiny',
            3: 'The universe conspires to unveil the sacred mysteries within',
            4: 'Celestial energies align to illuminate your path forward',
            5: 'The ancient ones speak through the veil of time and space',
            6: 'Stardust memories awaken the dormant magic in your heart',
            7: 'The celestial tapestry weaves new possibilities into existence',
            8: 'Divine frequencies harmonize with your spiritual essence',
          },
        },
        interpretations: {
          basic: {
            1: 'A message from beyond the veil suggests transformation approaches',
            2: 'The universe conspires to bring clarity to confusion',
            3: 'Hidden opportunities emerge from unexpected places',
            4: 'Past wisdom illuminates present challenges',
            5: 'New beginnings await those who trust the process',
          },
          premium: {
            1: 'The cosmic forces have aligned to reveal a profound truth about your journey',
            2: 'Your spiritual guides are orchestrating synchronicities to guide your path',
            3: 'The universe is preparing to bestow upon you a gift of divine insight',
            4: 'Ancient wisdom keepers are opening doorways to new possibilities',
            5: 'The celestial realm is weaving magic into your earthly experience',
            6: 'Sacred geometry patterns are manifesting in your reality',
            7: 'The quantum field responds to your elevated consciousness',
            8: 'Multidimensional energies converge to support your highest good',
          },
        },
        advice: {
          basic: {
            1: 'Trust your intuition and take the first step forward',
            2: 'Pay attention to synchronicities appearing in your life',
            3: 'Release what no longer serves your highest good',
            4: 'Embrace change as the universe\'s gift to your growth',
            5: 'Connect with others who share your mystical journey',
          },
          premium: {
            1: 'Embrace the sacred dance between surrender and intentional action',
            2: 'Allow your heart\'s wisdom to guide you through this mystical transformation',
            3: 'Trust in the divine timing of the universe\'s grand design for your life',
            4: 'Open yourself to receive the abundant blessings flowing toward you',
            5: 'Step boldly into your power as a co-creator with the cosmic forces',
            6: 'Activate your inner oracle through meditation and sacred rituals',
            7: 'Channel the celestial energies into manifestation of your dreams',
            8: 'Align with the cosmic currents that carry you toward your destiny',
          },
        },
      },
      categories: {
        career: 'Career',
        relationships: 'Relationships',
        health: 'Health',
        creativity: 'Creativity',
        finance: 'Finance',
        growth: 'Growth',
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
          description: 'Ancient wisdom from the stars, speaking in cosmic metaphors',
        },
        'mystical-librarian': {
          name: 'Mystical Librarian',
          description: 'Bookish wisdom keeper with literary enchantments',
        },
        'starlight-fairy': {
          name: 'Starlight Fairy',
          description: 'Playful forest spirit bringing nature-focused wisdom',
        },
        'crystal-prophet': {
          name: 'Crystal Prophet',
          description: 'Mysterious seer channeling gemstone energies',
        },
        'time-weaver': {
          name: 'Time Weaver',
          description: 'Temporal guardian connecting past, present, and future',
        },
      },
      history: {
        title: 'Omen Chronicle',
        subtitle: 'Your mystical journey through time',
        empty: {
          title: 'No Omens Yet',
          subtitle: 'Visit the Oracle to receive your first mystical guidance',
        },
      },
      premium: {
        title: 'Unlock Mystical Powers',
        subtitle: 'Choose your path to deeper wisdom',
        currentPlan: 'Current Plan',
        features: {
          unlimited: 'Unlimited oracle readings',
          personas: 'All mystical personas',
          voice: 'Enhanced voice features',
          history: 'Complete reading history',
          support: 'Premium support',
        },
      },
      profile: {
        title: 'Mystical Profile',
        subtitle: 'Your journey through the cosmic realm',
        stats: {
          totalReadings: 'Total Readings',
          averageRating: 'Avg Rating',
          dayStreak: 'Day Streak',
          favoriteCategory: 'Favorite Topic',
        },
        achievements: {
          title: 'Mystical Achievements',
          firstSteps: 'First Steps',
          seeker: 'Seeker',
          explorer: 'Mystic Explorer',
          appreciator: 'Wisdom Appreciator',
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
      home: {
        title: 'El Oráculo Caprichoso',
        subtitle: 'Donde la sabiduría cósmica se encuentra con la guía terrenal',
        greeting: {
          morning: 'Buenos Días, Buscador',
          afternoon: 'Buenas Tardes, Viajero',
          evening: 'Buenas Noches, Místico',
        },
        dailyReadings: {
          title: 'Lecturas Místicas Diarias',
          limitReached: 'Límite diario alcanzado. ¡Actualiza para guía mística ilimitada!',
        },
        subscriptionBanner: {
          message: '¡Desbloquea sabiduría mística ilimitada y funciones premium!',
        },
        notifications: {
          limitReached: {
            title: '✨ Límite Místico Alcanzado',
            message: '¡Has alcanzado tu límite de lecturas diarias. Actualiza a Premium para guía cósmica ilimitada y funciones místicas mejoradas!',
            action: 'Desbloquear Poderes Místicos',
          },
          voiceWarning: {
            title: 'Funciones de Voz Limitadas',
            message: 'Las funciones de voz no están completamente disponibles en esta plataforma. Para funcionalidad de voz mística completa, usa una compilación de desarrollo personalizada.',
          },
          videoError: {
            title: 'Problema del Oráculo de Video',
          },
        },
        persona: {
          mystic: 'MÍSTICO',
        },
        videoOracle: {
          title: 'Sesión del Oráculo de Video',
          start: 'Oráculo de Video',
          end: 'Terminar Video',
        },
        omen: {
          guidance: 'Guía Mística',
          resonance: 'Resonancia Cósmica',
          category: 'Categoría',
          speaking: '🎵 Oráculo hablando sabiduría mística...',
        },
        oracle: {
          awaits: 'El Oráculo Espera...',
          instruction: 'Toca el cristal místico para recibir tu guía cósmica',
          generating: 'Consultando las Fuerzas Cósmicas...',
          receive: 'Recibir Oráculo',
        },
        upgrade: {
          text: 'Desbloquear sabiduría mística ilimitada',
          accessibility: 'Desbloquear sabiduría mística ilimitada',
        },
      },
      oracle: {
        phrases: {
          basic: {
            1: 'Los cuervos digitales susurran de conexiones inesperadas',
            2: 'Hilos plateados se tejen a través del tejido del mañana',
            3: 'La sabiduría antigua fluye a través de canales modernos',
            4: 'La danza cósmica revela patrones ocultos',
            5: 'Las estrellas se alinean para iluminar senderos olvidados',
          },
          premium: {
            1: 'La sinfonía cósmica resuena con los anhelos más profundos de tu alma',
            2: 'Guardianes etéreos danzan alrededor de los hilos de tu destino',
            3: 'El universo conspira para revelar los misterios sagrados dentro',
            4: 'Las energías celestiales se alinean para iluminar tu camino hacia adelante',
            5: 'Los antiguos hablan a través del velo del tiempo y el espacio',
            6: 'Los recuerdos de polvo de estrellas despiertan la magia latente en tu corazón',
            7: 'El tapiz celestial teje nuevas posibilidades en la existencia',
            8: 'Las frecuencias divinas armonizan con tu esencia espiritual',
          },
        },
        interpretations: {
          basic: {
            1: 'Un mensaje desde más allá del velo sugiere que se acerca la transformación',
            2: 'El universo conspira para traer claridad a la confusión',
            3: 'Las oportunidades ocultas emergen de lugares inesperados',
            4: 'La sabiduría pasada ilumina los desafíos presentes',
            5: 'Nuevos comienzos esperan a aquellos que confían en el proceso',
          },
          premium: {
            1: 'Las fuerzas cósmicas se han alineado para revelar una verdad profunda sobre tu viaje',
            2: 'Tus guías espirituales están orquestando sincronicidades para guiar tu camino',
            3: 'El universo se prepara para otorgarte un regalo de perspicacia divina',
            4: 'Los guardianes de la sabiduría antigua están abriendo puertas a nuevas posibilidades',
            5: 'El reino celestial está tejiendo magia en tu experiencia terrenal',
            6: 'Los patrones de geometría sagrada se manifiestan en tu realidad',
            7: 'El campo cuántico responde a tu conciencia elevada',
            8: 'Las energías multidimensionales convergen para apoyar tu mayor bien',
          },
        },
        advice: {
          basic: {
            1: 'Confía en tu intuición y da el primer paso hacia adelante',
            2: 'Presta atención a las sincronicidades que aparecen en tu vida',
            3: 'Libera lo que ya no sirve a tu mayor bien',
            4: 'Abraza el cambio como el regalo del universo para tu crecimiento',
            5: 'Conéctate con otros que comparten tu viaje místico',
          },
          premium: {
            1: 'Abraza la danza sagrada entre la rendición y la acción intencional',
            2: 'Permite que la sabiduría de tu corazón te guíe a través de esta transformación mística',
            3: 'Confía en el tiempo divino del gran diseño del universo para tu vida',
            4: 'Ábrete para recibir las bendiciones abundantes que fluyen hacia ti',
            5: 'Entra audazmente en tu poder como co-creador con las fuerzas cósmicas',
            6: 'Activa tu oráculo interior a través de la meditación y rituales sagrados',
            7: 'Canaliza las energías celestiales en la manifestación de tus sueños',
            8: 'Alinéate con las corrientes cósmicas que te llevan hacia tu destino',
          },
        },
      },
      categories: {
        career: 'Carrera',
        relationships: 'Relaciones',
        health: 'Salud',
        creativity: 'Creatividad',
        finance: 'Finanzas',
        growth: 'Crecimiento',
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
          description: 'Sabiduría antigua de las estrellas, hablando en metáforas cósmicas',
        },
        'mystical-librarian': {
          name: 'Bibliotecario Místico',
          description: 'Guardián de sabiduría libresca con encantamientos literarios',
        },
        'starlight-fairy': {
          name: 'Hada de Luz Estelar',
          description: 'Espíritu del bosque juguetón que trae sabiduría centrada en la naturaleza',
        },
        'crystal-prophet': {
          name: 'Profeta de Cristal',
          description: 'Vidente misterioso canalizando energías de gemas',
        },
        'time-weaver': {
          name: 'Tejedor del Tiempo',
          description: 'Guardián temporal conectando pasado, presente y futuro',
        },
      },
      history: {
        title: 'Crónica de Presagios',
        subtitle: 'Tu viaje místico a través del tiempo',
        empty: {
          title: 'Aún No Hay Presagios',
          subtitle: 'Visita el Oráculo para recibir tu primera guía mística',
        },
      },
      premium: {
        title: 'Desbloquear Poderes Místicos',
        subtitle: 'Elige tu camino hacia una sabiduría más profunda',
        currentPlan: 'Plan Actual',
        features: {
          unlimited: 'Lecturas de oráculo ilimitadas',
          personas: 'Todas las personas místicas',
          voice: 'Funciones de voz mejoradas',
          history: 'Historial completo de lecturas',
          support: 'Soporte premium',
        },
      },
      profile: {
        title: 'Perfil Místico',
        subtitle: 'Tu viaje a través del reino cósmico',
        stats: {
          totalReadings: 'Lecturas Totales',
          averageRating: 'Calificación Promedio',
          dayStreak: 'Racha de Días',
          favoriteCategory: 'Tema Favorito',
        },
        achievements: {
          title: 'Logros Místicos',
          firstSteps: 'Primeros Pasos',
          seeker: 'Buscador',
          explorer: 'Explorador Místico',
          appreciator: 'Apreciador de Sabiduría',
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
      home: {
        title: 'L\'Oracle Fantaisiste',
        subtitle: 'Où la sagesse cosmique rencontre la guidance terrestre',
        greeting: {
          morning: 'Bonjour, Chercheur',
          afternoon: 'Bon Après-midi, Voyageur',
          evening: 'Bonsoir, Mystique',
        },
        dailyReadings: {
          title: 'Lectures Mystiques Quotidiennes',
          limitReached: 'Limite quotidienne atteinte. Mettez à niveau pour une guidance mystique illimitée!',
        },
        subscriptionBanner: {
          message: 'Débloquez une sagesse mystique illimitée et des fonctionnalités premium!',
        },
        notifications: {
          limitReached: {
            title: '✨ Limite Mystique Atteinte',
            message: 'Vous avez atteint votre limite de lectures quotidiennes. Passez à Premium pour une guidance cosmique illimitée et des fonctionnalités mystiques améliorées!',
            action: 'Débloquer les Pouvoirs Mystiques',
          },
          voiceWarning: {
            title: 'Fonctionnalités Vocales Limitées',
            message: 'Les fonctionnalités vocales ne sont pas entièrement disponibles sur cette plateforme. Pour une fonctionnalité vocale mystique complète, utilisez une compilation de développement personnalisée.',
          },
          videoError: {
            title: 'Problème de l\'Oracle Vidéo',
          },
        },
        persona: {
          mystic: 'MYSTIQUE',
        },
        videoOracle: {
          title: 'Session de l\'Oracle Vidéo',
          start: 'Oracle Vidéo',
          end: 'Terminer Vidéo',
        },
        omen: {
          guidance: 'Guidance Mystique',
          resonance: 'Résonance Cosmique',
          category: 'Catégorie',
          speaking: '🎵 Oracle parlant de sagesse mystique...',
        },
        oracle: {
          awaits: 'L\'Oracle Attend...',
          instruction: 'Touchez le cristal mystique pour recevoir votre guidance cosmique',
          generating: 'Consultation des Forces Cosmiques...',
          receive: 'Recevoir Oracle',
        },
        upgrade: {
          text: 'Débloquer une sagesse mystique illimitée',
          accessibility: 'Débloquer une sagesse mystique illimitée',
        },
      },
      // Add more French translations as needed...
      categories: {
        career: 'Carrière',
        relationships: 'Relations',
        health: 'Santé',
        creativity: 'Créativité',
        finance: 'Finance',
        growth: 'Croissance',
      },
      personas: {
        'cosmic-sage': {
          name: 'Sage Cosmique',
          description: 'Sagesse ancienne des étoiles, parlant en métaphores cosmiques',
        },
        'mystical-librarian': {
          name: 'Bibliothécaire Mystique',
          description: 'Gardien de sagesse livresque avec des enchantements littéraires',
        },
        'starlight-fairy': {
          name: 'Fée de Lumière Stellaire',
          description: 'Esprit de forêt enjoué apportant une sagesse centrée sur la nature',
        },
        'crystal-prophet': {
          name: 'Prophète de Cristal',
          description: 'Voyant mystérieux canalisant les énergies des gemmes',
        },
        'time-weaver': {
          name: 'Tisseur du Temps',
          description: 'Gardien temporel connectant passé, présent et futur',
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
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to get stored language:', error);
      return null;
    }
  }
  // For mobile, you would use AsyncStorage here
  return null;
};

export const setStoredLanguage = (locale: string): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
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
export const t = (key: string, fallback?: string, params?: Record<string, any>): string => {
  const translation = i18nInstance.t(key, params);
  // If translation equals the key, it means no translation was found
  if (translation === key && fallback) {
    return fallback;
  }
  return translation;
};

export const getCurrentLanguage = (): string => {
  return i18nInstance.language;
};

export const changeLanguage = async (locale: string): Promise<void> => {
  await i18nInstance.changeLanguage(locale);
  setStoredLanguage(locale);
};