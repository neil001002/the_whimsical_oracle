import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

// Helper function to convert ISO language codes to full language names
function getFullLanguageName(isoCode: string): string {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'da': 'Danish',
    'fi': 'Finnish',
    'pl': 'Polish',
    'tr': 'Turkish',
    'he': 'Hebrew'
  };
  
  return languageMap[isoCode] || 'English'; // Default to English if not found
}

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

    // Convert ISO language code to full language name
    const languageCode = properties?.language || 'en';
    const fullLanguageName = getFullLanguageName(languageCode);

    console.log(`Creating Tavus conversation with replica: ${replica_id}`);

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
          language: fullLanguageName, // Use full language name instead of ISO code
          // Add additional properties for better iframe compatibility
          callback_url: properties?.callback_url,
        },
      }),
    });

    if (!tavusResponse.ok) {
      let errorData;
      try {
        errorData = await tavusResponse.json();
      } catch (parseError) {
        // If JSON parsing fails, try to get text or use a generic error
        try {
          const errorText = await tavusResponse.text();
          errorData = { error: errorText || 'Unknown error occurred' };
        } catch (textError) {
          errorData = { error: 'Failed to parse error response' };
        }
      }
      console.error('Tavus API error:', errorData);
      
      // Check for specific error types
      if (errorData.message && errorData.message.includes('Invalid replica_uuid')) {
        return new Response(JSON.stringify({ 
          error: 'Invalid replica ID',
          userMessage: 'The selected oracle persona is not available. Please try a different persona.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Tavus API error',
        userMessage: 'Failed to create video conversation. Please try again later.',
        details: errorData
      }), {
        status: tavusResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const conversationData = await tavusResponse.json();
    console.log('Tavus conversation created successfully:', conversationData.conversation_id);

    return new Response(JSON.stringify(conversationData), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        // Add CORS headers for better compatibility
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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
      let errorData;
      try {
        errorData = await tavusResponse.json();
      } catch (parseError) {
        // If JSON parsing fails, try to get text or use a generic error
        try {
          const errorText = await tavusResponse.text();
          errorData = { error: errorText || 'Unknown error occurred' };
        } catch (textError) {
          errorData = { error: 'Failed to parse error response' };
        }
      }
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
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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
    let body;
    let conversation_id;

    // Check Content-Length and Content-Type headers before attempting to parse JSON
    const contentLength = request.headers.get('Content-Length');
    const contentType = request.headers.get('Content-Type');
    
    // Only attempt to parse JSON if we have content and the right content type
    if (contentLength && parseInt(contentLength) > 0 && contentType && contentType.includes('application/json')) {
      try {
        body = await request.json();
        conversation_id = body.conversation_id;
      } catch (jsonError) {
        console.error('Failed to parse JSON body:', jsonError);
        return new Response(JSON.stringify({ 
          error: 'Invalid JSON body',
          userMessage: 'Request body must be valid JSON with conversation_id field'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Handle empty body or non-JSON content type
      return new Response(JSON.stringify({ 
        error: 'Missing or invalid request body',
        userMessage: 'Request must include a JSON body with conversation_id field'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!conversation_id) {
      return new Response(JSON.stringify({ 
        error: 'Missing conversation_id',
        userMessage: 'conversation_id is required in the request body'
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

    console.log(`Ending Tavus conversation: ${conversation_id}`);

    // End conversation via Tavus API
    const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations/${conversation_id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!tavusResponse.ok) {
      let errorData;
      
      // First, get the response body as text
      const responseText = await tavusResponse.text();
      
      // Check if the response has content and appears to be JSON
      if (responseText && responseText.trim()) {
        const contentType = tavusResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = JSON.parse(responseText);
          } catch (parseError) {
            // If JSON parsing fails, use the text as error message
            errorData = { error: responseText };
          }
        } else {
          // Not JSON content type, use text as error
          errorData = { error: responseText };
        }
      } else {
        // Empty response body
        errorData = { error: `HTTP ${tavusResponse.status}: ${tavusResponse.statusText}` };
      }
      
      console.error('Tavus API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Tavus API error',
        userMessage: 'Failed to end conversation.'
      }), {
        status: tavusResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Tavus conversation ended successfully');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Conversation ended successfully'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}