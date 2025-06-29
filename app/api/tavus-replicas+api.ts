export async function GET(request: Request) {
  try {
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

    // Get replicas from Tavus API
    const tavusResponse = await fetch('https://tavusapi.com/v2/replicas', {
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
        userMessage: 'Failed to fetch available oracles.'
      }), {
        status: tavusResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const replicasData = await tavusResponse.json();

    return new Response(JSON.stringify(replicasData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching Tavus replicas:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      userMessage: 'Failed to fetch available oracles.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}