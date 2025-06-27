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

    const elevenLabsApiKey = process.env.EXPO_PUBLIC_ELEVEN_LABS_API_KEY;
    if (!elevenLabsApiKey) {
      console.error('Eleven Labs API key not configured.');
      return new Response(JSON.stringify({ error: 'Server configuration error: API key missing' }), {
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
      return new Response(JSON.stringify({ error: 'Failed to generate speech', details: errorData }), {
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
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}