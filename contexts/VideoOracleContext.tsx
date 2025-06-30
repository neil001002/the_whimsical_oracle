import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTavusService, VideoOracleSession, TavusPersonaMapping } from '@/services/TavusService';
import { useAuth } from '@/contexts/AuthContext';

interface VideoOracleContextType {
  // Service availability
  isTavusAvailable: boolean;
  
  // Session management
  activeSession: VideoOracleSession | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  
  // Persona mappings
  personaMappings: TavusPersonaMapping[];
  
  // Actions
  startVideoSession: (personaId: string) => Promise<VideoOracleSession | null>;
  endVideoSession: () => Promise<void>;
  checkSessionStatus: () => Promise<void>;
  clearError: () => void;
  
  // Persona helpers
  isPersonaVideoEnabled: (personaId: string) => boolean;
  getPersonaMapping: (personaId: string) => TavusPersonaMapping | null;
}

const VideoOracleContext = createContext<VideoOracleContextType | undefined>(undefined);

export function VideoOracleProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const tavusService = getTavusService();
  
  const [activeSession, setActiveSession] = useState<VideoOracleSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isTavusAvailable = tavusService.isServiceAvailable();
  const personaMappings = tavusService.getPersonaMappings();
  
  // Computed state
  const isConnected = activeSession?.status === 'connected';

  useEffect(() => {
    // Cleanup sessions when component unmounts
    return () => {
      if (activeSession) {
        tavusService.endOracleConversation(activeSession.sessionId).catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    // Periodic cleanup of ended sessions
    const cleanup = setInterval(() => {
      tavusService.cleanupEndedSessions();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(cleanup);
  }, []);

  const startVideoSession = async (personaId: string): Promise<VideoOracleSession | null> => {
    if (!isTavusAvailable) {
      setError('Video oracle feature is not available. Please check your configuration.');
      return null;
    }

    if (!session.user) {
      setError('Please sign in to start a video session with the oracle.');
      return null;
    }

    if (activeSession) {
      setError('A video session is already active. Please end the current session first.');
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const conversationName = `Oracle Session - ${personaId} - ${new Date().toISOString()}`;
      const newSession = await tavusService.createOracleConversation(personaId, conversationName);
      
      setActiveSession(newSession);
      
      // Start polling for status updates
      const statusInterval = setInterval(async () => {
        try {
          const updatedSession = await tavusService.getConversationStatus(newSession.sessionId);
          if (updatedSession) {
            setActiveSession(updatedSession);
            
            // Stop polling if session ended
            if (updatedSession.status === 'ended' || updatedSession.status === 'error') {
              clearInterval(statusInterval);
            }
          }
        } catch (error) {
          console.error('Error checking session status:', error);
        }
      }, 5000); // Check every 5 seconds

      // Clean up interval after 30 minutes
      setTimeout(() => {
        clearInterval(statusInterval);
      }, 30 * 60 * 1000);

      return newSession;

    } catch (error) {
      console.error('Error starting video session:', error);
      setError(error instanceof Error ? error.message : 'Failed to start video session');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const endVideoSession = async (): Promise<void> => {
    if (!activeSession) {
      return;
    }

    try {
      await tavusService.endOracleConversation(activeSession.sessionId);
      setActiveSession(null);
      setError(null);
    } catch (error) {
      console.error('Error ending video session:', error);
      setError('Failed to properly end the video session');
      // Still clear the session locally
      setActiveSession(null);
    }
  };

  const checkSessionStatus = async (): Promise<void> => {
    if (!activeSession) {
      return;
    }

    try {
      const updatedSession = await tavusService.getConversationStatus(activeSession.sessionId);
      if (updatedSession) {
        setActiveSession(updatedSession);
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const isPersonaVideoEnabled = (personaId: string): boolean => {
    return tavusService.isPersonaVideoEnabled(personaId);
  };

  const getPersonaMapping = (personaId: string): TavusPersonaMapping | null => {
    return personaMappings.find(mapping => mapping.personaId === personaId) || null;
  };

  return (
    <VideoOracleContext.Provider
      value={{
        isTavusAvailable,
        activeSession,
        isConnecting,
        isConnected,
        error,
        personaMappings,
        startVideoSession,
        endVideoSession,
        checkSessionStatus,
        clearError,
        isPersonaVideoEnabled,
        getPersonaMapping,
      }}
    >
      {children}
    </VideoOracleContext.Provider>
  );
}

export function useVideoOracle() {
  const context = useContext(VideoOracleContext);
  if (context === undefined) {
    throw new Error('useVideoOracle must be used within a VideoOracleProvider');
  }
  return context;
}