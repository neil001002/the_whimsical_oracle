import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OraclePersona, UserPreferences, WhimsicalOmen } from '@/types';
import { ORACLE_PERSONAS } from '@/constants/OraclePersonas';

interface OracleContextType {
  selectedPersona: OraclePersona;
  userPreferences: UserPreferences;
  omenHistory: WhimsicalOmen[];
  updatePersona: (personaId: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addOmen: (omen: WhimsicalOmen) => void;
  rateOmen: (omenId: string, rating: number) => void;
  isLoading: boolean;
}

const OracleContext = createContext<OracleContextType | undefined>(undefined);

interface OracleProviderProps {
  children: ReactNode;
}

export function OracleProvider({ children }: OracleProviderProps) {
  const [selectedPersona, setSelectedPersona] = useState<OraclePersona>(ORACLE_PERSONAS[0]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    selectedPersona: 'cosmic-sage',
    subscriptionTier: 'free',
    soundEnabled: true,
    hapticsEnabled: true,
    voiceEnabled: false,
  });
  const [omenHistory, setOmenHistory] = useState<WhimsicalOmen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [prefsData, historyData] = await Promise.all([
        AsyncStorage.getItem('userPreferences'),
        AsyncStorage.getItem('omenHistory'),
      ]);

      if (prefsData) {
        const prefs = JSON.parse(prefsData);
        setUserPreferences(prefs);
        const persona = ORACLE_PERSONAS.find(p => p.id === prefs.selectedPersona);
        if (persona) {
          setSelectedPersona(persona);
        }
      }

      if (historyData) {
        const history = JSON.parse(historyData);
        setOmenHistory(history);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersona = async (personaId: string) => {
    const persona = ORACLE_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      setSelectedPersona(persona);
      const newPrefs = { ...userPreferences, selectedPersona: personaId };
      setUserPreferences(newPrefs);
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    const newPrefs = { ...userPreferences, ...preferences };
    setUserPreferences(newPrefs);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPrefs));
  };

  const addOmen = async (omen: WhimsicalOmen) => {
    const newHistory = [omen, ...omenHistory];
    setOmenHistory(newHistory);
    await AsyncStorage.setItem('omenHistory', JSON.stringify(newHistory));
  };

  const rateOmen = async (omenId: string, rating: number) => {
    const updatedHistory = omenHistory.map(omen =>
      omen.id === omenId ? { ...omen, rating } : omen
    );
    setOmenHistory(updatedHistory);
    await AsyncStorage.setItem('omenHistory', JSON.stringify(updatedHistory));
  };

  return (
    <OracleContext.Provider value={{
      selectedPersona,
      userPreferences,
      omenHistory,
      updatePersona,
      updatePreferences,
      addOmen,
      rateOmen,
      isLoading,
    }}>
      {children}
    </OracleContext.Provider>
  );
}

export function useOracle() {
  const context = useContext(OracleContext);
  if (context === undefined) {
    throw new Error('useOracle must be used within an OracleProvider');
  }
  return context;
}