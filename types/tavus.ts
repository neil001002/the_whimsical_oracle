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
  replicaId: string;
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