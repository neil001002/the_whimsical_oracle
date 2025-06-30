import { Platform } from 'react-native';

export interface TavusConfig {
  apiKey: string;
  baseUrl: string;
}

export interface TavusConversationRequest {
  replica_id: string;
  conversation_name: string;
  callback_url?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_transcription?: boolean;
    language?: string;
  };
}

export interface TavusConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: 'active' | 'ended' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface TavusReplicaInfo {
  replica_id: string;
  replica_name: string;
  status: 'ready' | 'training' | 'failed';
  created_at: string;
  updated_at: string;
  voice_id?: string;
  callback_url?: string;
}

export interface TavusPersonaMapping {
  personaId: string;
  replicaId: string | null; // Allow null for unavailable replicas
  replicaName: string;
  description: string;
  isAvailable: boolean;
}

export interface VideoOracleSession {
  sessionId: string;
  conversationId: string;
  conversationUrl: string;
  personaId: string;
  status: 'connecting' | 'connected' | 'ended' | 'error';
  startTime: Date;
  endTime?: Date;
}

// Helper function to get the correct API URL
const getApiUrl = (path: string): string => {
  // In browser environment, use relative paths
  if (typeof window !== 'undefined') {
    return path;
  }
  
  // In Node.js environment, construct absolute URL
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' // Replace with your actual production domain
    : 'http://localhost:8081';
  
  return `${baseUrl}${path}`;
};

// Check if Tavus is available (requires API key and network access)
const isTavusAvailable = (): boolean => {
  try {
    // Check if we have the necessary environment variables
    const apiKey = getTavusApiKey();
    return !!apiKey;
  } catch (error) {
    console.warn('Tavus not available:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

const getTavusApiKey = (): string => {
  // Try different ways to get the API key
  if (typeof process !== 'undefined' && process.env) {
    return process.env.EXPO_PUBLIC_TAVUS_API_KEY || '';
  }
  
  // For web environments, try accessing via global
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__.EXPO_PUBLIC_TAVUS_API_KEY || '';
  }
  
  return '';
};

export class TavusService {
  private config: TavusConfig;
  private isAvailable: boolean;
  private activeSessions: Map<string, VideoOracleSession> = new Map();
  private availableReplicas: TavusReplicaInfo[] = [];
  private replicasFetched: boolean = false;

  // Oracle persona mappings - replica IDs will be populated from actual Tavus account
  private readonly personaMappings: TavusPersonaMapping[] = [
    {
      personaId: 'cosmic-sage',
      replicaId: null, // Will be populated from available replicas
      replicaName: 'Cosmic Sage Oracle',
      description: 'Ancient wisdom from the stars',
      isAvailable: false,
    },
    {
      personaId: 'mystical-librarian',
      replicaId: null, // Will be populated from available replicas
      replicaName: 'Mystical Librarian Oracle',
      description: 'Bookish wisdom keeper',
      isAvailable: false,
    },
    {
      personaId: 'starlight-fairy',
      replicaId: null, // Will be populated from available replicas
      replicaName: 'Starlight Fairy Oracle',
      description: 'Playful forest spirit',
      isAvailable: false,
    },
    {
      personaId: 'crystal-prophet',
      replicaId: null, // Will be populated from available replicas
      replicaName: 'Crystal Prophet Oracle',
      description: 'Mysterious seer',
      isAvailable: false,
    },
    {
      personaId: 'time-weaver',
      replicaId: null, // Will be populated from available replicas
      replicaName: 'Time Weaver Oracle',
      description: 'Temporal guardian',
      isAvailable: false,
    },
  ];

  constructor() {
    const apiKey = getTavusApiKey();
    
    this.config = {
      apiKey,
      baseUrl: 'https://tavusapi.com',
    };
    
    this.isAvailable = isTavusAvailable();
    
    if (!this.isAvailable) {
      console.log('Tavus service initialized but API key is not available');
    } else {
      // Initialize replicas when service is available
      this.initializeReplicas();
    }
  }

  // Initialize replicas by fetching from Tavus API
  private async initializeReplicas(): Promise<void> {
    if (this.replicasFetched || !this.isAvailable) {
      return;
    }

    try {
      const replicas = await this.getAvailableReplicas();
      this.availableReplicas = replicas;
      this.replicasFetched = true;

      // Map available replicas to personas (use first available replica for each persona)
      let replicaIndex = 0;
      for (const mapping of this.personaMappings) {
        if (replicaIndex < replicas.length) {
          mapping.replicaId = replicas[replicaIndex].replica_id;
          mapping.isAvailable = true;
          replicaIndex++;
        }
      }

      console.log(`Mapped ${replicaIndex} replicas to personas`);
    } catch (error) {
      console.error('Failed to initialize replicas:', error);
      // Mark all personas as unavailable
      this.personaMappings.forEach(mapping => {
        mapping.isAvailable = false;
      });
    }
  }

  // Check if Tavus is available
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  // Get persona mappings
  async getPersonaMappings(): Promise<TavusPersonaMapping[]> {
    // Ensure replicas are initialized
    await this.initializeReplicas();
    return this.personaMappings;
  }

  // Get replica ID for a persona
  async getReplicaIdForPersona(personaId: string): Promise<string | null> {
    // Ensure replicas are initialized
    await this.initializeReplicas();
    const mapping = this.personaMappings.find(m => m.personaId === personaId);
    return mapping?.replicaId || null;
  }

  // Check if persona supports video interaction
  async isPersonaVideoEnabled(personaId: string): Promise<boolean> {
    // Ensure replicas are initialized
    await this.initializeReplicas();
    const mapping = this.personaMappings.find(m => m.personaId === personaId);
    return mapping?.isAvailable || false;
  }

  // Create a new conversation with an oracle
  async createOracleConversation(
    personaId: string,
    conversationName?: string
  ): Promise<VideoOracleSession> {
    if (!this.isAvailable) {
      throw new Error('Tavus service is not available. Please check your API key configuration.');
    }

    // Ensure replicas are initialized
    await this.initializeReplicas();

    const replicaId = await this.getReplicaIdForPersona(personaId);
    if (!replicaId) {
      throw new Error(`No video replica available for persona: ${personaId}. Please ensure you have replicas configured in your Tavus account.`);
    }

    try {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const name = conversationName || `Oracle Session with ${personaId}`;

      // Create conversation via API route
      const response = await fetch(getApiUrl('/api/tavus-conversation'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replica_id: replicaId,
          conversation_name: name,
          properties: {
            max_call_duration: 1800, // 30 minutes
            participant_left_timeout: 60,
            participant_absent_timeout: 300,
            enable_recording: false,
            enable_transcription: true,
            language: 'en',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.userMessage || 'Failed to create oracle conversation');
      }

      const conversationData: TavusConversationResponse = await response.json();

      const session: VideoOracleSession = {
        sessionId,
        conversationId: conversationData.conversation_id,
        conversationUrl: conversationData.conversation_url,
        personaId,
        status: 'connecting',
        startTime: new Date(),
      };

      this.activeSessions.set(sessionId, session);
      
      // Simulate connection after a delay for better UX
      setTimeout(() => {
        const currentSession = this.activeSessions.get(sessionId);
        if (currentSession && currentSession.status === 'connecting') {
          currentSession.status = 'connected';
          this.activeSessions.set(sessionId, currentSession);
        }
      }, 2000);
      
      return session;

    } catch (error) {
      console.error('Error creating oracle conversation:', error);
      throw new Error(`Failed to create video conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // End a conversation
  async endOracleConversation(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      console.warn(`No active session found for ID: ${sessionId}`);
      return;
    }

    try {
      // End conversation via API route
      await fetch(getApiUrl('/api/tavus-conversation'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: session.conversationId,
        }),
      });

      // Update session status
      session.status = 'ended';
      session.endTime = new Date();
      this.activeSessions.set(sessionId, session);

      console.log(`Oracle conversation ended: ${sessionId}`);

    } catch (error) {
      console.error('Error ending oracle conversation:', error);
      // Still mark as ended locally
      session.status = 'error';
      session.endTime = new Date();
      this.activeSessions.set(sessionId, session);
    }
  }

  // Get conversation status
  async getConversationStatus(sessionId: string): Promise<VideoOracleSession | null> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return null;
    }

    try {
      // Check status via API route
      const response = await fetch(getApiUrl(`/api/tavus-conversation?conversation_id=${session.conversationId}`));
      
      if (response.ok) {
        const statusData: TavusConversationResponse = await response.json();
        
        // Update session status based on API response
        if (statusData.status === 'ended' && session.status !== 'ended') {
          session.status = 'ended';
          session.endTime = new Date();
          this.activeSessions.set(sessionId, session);
        } else if (statusData.status === 'active' && session.status === 'connecting') {
          session.status = 'connected';
          this.activeSessions.set(sessionId, session);
        }
      }

      return session;

    } catch (error) {
      console.error('Error checking conversation status:', error);
      return session;
    }
  }

  // Get all active sessions
  getActiveSessions(): VideoOracleSession[] {
    return Array.from(this.activeSessions.values()).filter(
      session => session.status === 'connecting' || session.status === 'connected'
    );
  }

  // Clean up ended sessions
  cleanupEndedSessions(): void {
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.status === 'ended' || session.status === 'error') {
        // Remove sessions that ended more than 1 hour ago
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (session.endTime && session.endTime < hourAgo) {
          this.activeSessions.delete(sessionId);
        }
      }
    }
  }

  // Get available replicas (for admin/debug purposes)
  async getAvailableReplicas(): Promise<TavusReplicaInfo[]> {
    if (!this.isAvailable) {
      return [];
    }

    try {
      const response = await fetch(getApiUrl('/api/tavus-replicas'));
      
      if (response.ok) {
        const responseData = await response.json();
        // Handle both direct array response and object with data property
        const replicas: TavusReplicaInfo[] = Array.isArray(responseData) 
          ? responseData 
          : (responseData.data || []);
        
        return replicas.filter(replica => replica.status === 'ready');
      }

      return [];

    } catch (error) {
      console.error('Error fetching available replicas:', error);
      return [];
    }
  }
}

// Singleton instance
let tavusService: TavusService | null = null;

export const getTavusService = (): TavusService => {
  if (!tavusService) {
    tavusService = new TavusService();
  }
  return tavusService;
};