
// Create a mock successful response for testing
export function createMockResponse(
  sessionId: string, 
  corsHeaders: Record<string, string>,
  warning?: string
) {
  const responseData: any = { 
    verified: true,
    debug: true,
    mock: true,
    session: {
      id: sessionId,
      status: 'complete',
      payment_status: 'paid',
    }
  };
  
  if (warning) {
    responseData.warning = warning;
  }
  
  return new Response(
    JSON.stringify(responseData),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}
