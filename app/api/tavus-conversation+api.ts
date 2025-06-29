export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { replica_id, conversation_name, properties } = body;

    if (!replica_id || !conversation_name) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        userMessage: 'Replica ID and conversation name are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.TAVUS_API_KEY;
    if (!apiKey) {
      console.error('Tavus API key not configured.');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Tavus API key missing',
        userMessage: 'Video oracle feature is currently unavailable due to configuration issues.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create conversation with Tavus API
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id,
        conversation_name,
        properties: {
          max_call_duration: properties?.max_call_duration || 1800,
          participant_left_timeout: properties?.participant_left_timeout || 60,
          participant_absent_timeout: properties?.participant_absent_timeout || 300,
          enable_recording: properties?.enable_recording || false,
          enable_transcription: properties?.enable_transcription || true,
          language: properties?.language || 'en',
        },
      }),
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json();
      console.error('Tavus API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Tavus API error',
        userMessage: 'Failed to create video conversation. Please try again later.'
      }), {
        status: tavusResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const conversationData = await tavusResponse.json();

    return new Response(JSON.stringify(conversationData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating Tavus conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Failed to create video conversation. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversation_id');

    if (!conversationId) {
      return new Response(JSON.stringify({ 
        error: 'Missing conversation_id parameter' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.TAVUS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Tavus API key missing' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get conversation status from Tavus API
    const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json();
      console.error('Tavus API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Tavus API error',
        userMessage: 'Failed to get conversation status.'
      }), {
        status: tavusResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const conversationData = await tavusResponse.json();

    return new Response(JSON.stringify(conversationData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error getting Tavus conversation status:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Failed to get conversation status.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return new Response(JSON.stringify({ 
        error: 'Missing conversation_id' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.TAVUS_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Tavus API key missing' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // End conversation via Tavus API
    const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations/${conversation_id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json();
      console.error('Tavus API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Tavus API error',
        userMessage: 'Failed to end conversation.'
      }), {
        status: tavusResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Conversation ended successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error ending Tavus conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Failed to end conversation.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}