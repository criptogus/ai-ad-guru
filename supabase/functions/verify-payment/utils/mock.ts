
// Create a mock successful response for testing
export function createMockResponse(
  sessionId: string, 
  corsHeaders: Record<string, string>,
  warning?: string,
  status: 'complete' | 'open' | 'expired' = 'complete',
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required' = 'paid'
) {
  // Create a standardized response object
  const responseData: {
    verified: boolean;
    debug: boolean;
    mock: boolean;
    warning?: string;
    session: {
      id: string;
      status: string;
      payment_status: string;
      customer?: string | null;
      metadata?: Record<string, any> | null;
      created?: number;
      expires_at?: number | null;
    }
  } = { 
    verified: status === 'complete' && paymentStatus === 'paid',
    debug: true,
    mock: true,
    session: {
      id: sessionId,
      status: status,
      payment_status: paymentStatus,
      customer: 'cus_mock_12345', // Mock customer ID
      metadata: { 
        userId: 'mock_user_id',
        timestamp: Date.now()
      },
      created: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      expires_at: status === 'expired' ? Math.floor(Date.now() / 1000) - 60 : null, // 1 minute ago if expired
    }
  };
  
  // Add warning if provided
  if (warning) {
    responseData.warning = warning;
  }
  
  // Return formatted response
  return new Response(
    JSON.stringify(responseData),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}
