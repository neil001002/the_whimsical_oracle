import { AccessToken } from 'livekit-server-sdk';

export async function POST(request: Request) {
  try {
    const { roomName, participantName } = await request.json();

    if (!roomName || !participantName) {
      return new Response(JSON.stringify({ error: 'Missing roomName or participantName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY || process.env.EXPO_PUBLIC_LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.EXPO_PUBLIC_LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('LiveKit API credentials not configured.');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: LiveKit credentials missing',
        userMessage: 'Voice feature is currently unavailable due to configuration issues.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: '1h', // Token valid for 1 hour
    });

    // Grant permissions
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();

    return new Response(JSON.stringify({ token: jwt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Failed to generate voice session token. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}