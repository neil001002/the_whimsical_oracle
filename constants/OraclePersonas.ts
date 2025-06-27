import { OraclePersona } from '@/types';

export const ORACLE_PERSONAS: OraclePersona[] = [
  {
    id: 'cosmic-sage',
    name: 'Cosmic Sage',
    description: 'Ancient wisdom from the stars, speaking in cosmic metaphors',
    avatar: '🌟',
    voiceStyle: 'wise, ancient, mystical',
    colorScheme: {
      primary: '#2D1B69',
      secondary: '#1E3A8A',
      accent: '#F59E0B',
    },
    responsePatterns: [
      'The stars whisper of...',
      'In the cosmic dance, I see...',
      'Ancient wisdom reveals...',
      'The universe speaks through...',
    ],
  },
  {
    id: 'mystical-librarian',
    name: 'Mystical Librarian',
    description: 'Bookish wisdom keeper with literary enchantments',
    avatar: '📚',
    voiceStyle: 'scholarly, quirky, reference-rich',
    colorScheme: {
      primary: '#7C2D12',
      secondary: '#1F2937',
      accent: '#D97706',
    },
    responsePatterns: [
      'As written in the tome of fate...',
      'The chronicles reveal...',
      'Between the lines of destiny...',
      'Ancient texts speak of...',
    ],
  },
  {
    id: 'starlight-fairy',
    name: 'Starlight Fairy',
    description: 'Playful forest spirit bringing nature-focused wisdom',
    avatar: '🧚',
    voiceStyle: 'playful, optimistic, nature-loving',
    colorScheme: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#F59E0B',
    },
    responsePatterns: [
      'The forest spirits dance and say...',
      'Moonbeams carry messages of...',
      'Nature\'s magic reveals...',
      'The fairy realm whispers...',
    ],
  },
  {
    id: 'crystal-prophet',
    name: 'Crystal Prophet',
    description: 'Mysterious seer channeling gemstone energies',
    avatar: '🔮',
    voiceStyle: 'mysterious, cryptic, mineral-focused',
    colorScheme: {
      primary: '#7C3AED',
      secondary: '#5B21B6',
      accent: '#EC4899',
    },
    responsePatterns: [
      'The crystals resonate with...',
      'Through the crystal\'s clarity, I see...',
      'Gemstone energies reveal...',
      'The sacred stones speak of...',
    ],
  },
  {
    id: 'time-weaver',
    name: 'Time Weaver',
    description: 'Temporal guardian connecting past, present, and future',
    avatar: '⏳',
    voiceStyle: 'temporal, mysterious, time-focused',
    colorScheme: {
      primary: '#1E40AF',
      secondary: '#3730A3',
      accent: '#F59E0B',
    },
    responsePatterns: [
      'Threads of time reveal...',
      'Past and future converge to show...',
      'The temporal streams whisper...',
      'Time\'s tapestry weaves...',
    ],
  },
];