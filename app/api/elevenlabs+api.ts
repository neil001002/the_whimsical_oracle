import { Buffer } from 'buffer';

export async function POST(request: Request) {
  try {
    const { text, voiceId } = await request.json();

    if (!text || !voiceId) {
      return new Response(JSON.stringify({ error: 'Missing text or voiceId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In API routes, we need to access the environment variable differently
    // EXPO_PUBLIC_ variables are available on the client, but for server-side API routes
    // we should use a non-public environment variable
    const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY || process.env.EXPO_PUBLIC_ELEVEN_LABS_API_KEY;
    
    if (!elevenLabsApiKey) {
      console.error('Eleven Labs API key not configured.');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: API key missing',
        userMessage: 'Voice feature is currently unavailable due to configuration issues.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Eleven Labs API error:', errorData);
      
      // Handle specific error cases
      let userMessage = 'Failed to generate speech. Please try again later.';
      
      if (errorData.detail?.status === 'detected_unusual_activity') {
        userMessage = 'Voice feature is temporarily unavailable. The service has detected unusual activity and requires a paid subscription to continue.';
      } else if (response.status === 401) {
        userMessage = 'Voice feature is unavailable due to authentication issues.';
      } else if (response.status === 429) {
        userMessage = 'Voice feature is temporarily unavailable due to rate limiting. Please try again later.';
      } else if (response.status >= 500) {
        userMessage = 'Voice service is temporarily down. Please try again later.';
      }

      return new Response(JSON.stringify({ 
        error: 'Failed to generate speech', 
        details: errorData,
        userMessage: userMessage,
        isServiceUnavailable: errorData.detail?.status === 'detected_unusual_activity' || response.status === 401
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return new Response(JSON.stringify({ audio: base64Audio }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Eleven Labs API route:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Voice feature is currently unavailable. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}