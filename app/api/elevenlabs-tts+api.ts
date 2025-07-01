export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, personaId } = body;

    if (!text || !personaId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        userMessage: 'Text and persona ID are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('ElevenLabs API key not configured.');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: ElevenLabs API key missing',
        userMessage: 'Voice feature is currently unavailable due to configuration issues.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Voice mappings for personas
    const voiceMappings: Record<string, { voiceId: string; stability: number; similarityBoost: number }> = {
      'cosmic-sage': {
        voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - wise, deep voice
        stability: 0.75,
        similarityBoost: 0.8,
      },
      'mystical-librarian': {
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - scholarly, clear voice
        stability: 0.8,
        similarityBoost: 0.75,
      },
      'starlight-fairy': {
        voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - playful, light voice
        stability: 0.6,
        similarityBoost: 0.9,
      },
      'crystal-prophet': {
        voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel - mysterious, deep voice
        stability: 0.7,
        similarityBoost: 0.85,
      },
      'time-weaver': {
        voiceId: 'CYw3kZ02Hs0563khs1Fj', // Gigi - temporal, ethereal voice
        stability: 0.65,
        similarityBoost: 0.8,
      },
    };

    const voiceConfig = voiceMappings[personaId] || voiceMappings['cosmic-sage'];

    console.log(`Generating speech for persona: ${personaId}`);

    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: voiceConfig.stability,
          similarity_boost: voiceConfig.similarityBoost,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      return new Response(JSON.stringify({ 
        error: 'ElevenLabs API error',
        userMessage: 'Voice generation failed. Please try again later.',
        details: errorData
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const audioBuffer = await response.arrayBuffer();
    
    if (audioBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ 
        error: 'Empty audio response',
        userMessage: 'Voice generation failed. Please try again.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generated audio: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      status: 200,
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error in ElevenLabs TTS API:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Voice generation failed. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}