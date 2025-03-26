
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@12.14.0';
import { corsHeaders } from './utils/cors.ts';
import { verifyStripePayment } from './services/stripe.ts';
import { updateUserSubscription } from './services/supabase.ts';
import { createMockResponse } from './utils/mock.ts';
import {
  applySecurityChecks,
  sanitizeRequestData,
  hasSuspiciousPatterns,
  createSecureResponse,
  rejectRateLimited,
  validateJwtStructure,
  securityMonitor
} from '../utils/securityMiddleware.ts';

// Handle preflight OPTIONS request
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Apply enhanced security checks to the request
    const securityCheck = await applySecurityChecks(req, {
      checkRateLimit: true,
      rateLimitValue: 10, // Even stricter rate limiting for payment functions
      validateOrigin: true,
      requireAuth: true, // Require authentication for payment verification
    });

    if (!securityCheck.valid) {
      // Log security check failure
      console.error('Security check failed:', securityCheck.response?.status);
      return securityCheck.response as Response;
    }

    // Parse request body
    let bodyText, body;
    
    try {
      bodyText = await req.text();
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError, 'Raw body:', bodyText);
      
      // Log potential JSON injection attempt
      return createSecureResponse(
        { error: 'Invalid JSON in request body' },
        400
      );
    }
    
    // Sanitize and validate the input data
    const sanitizedBody = sanitizeRequestData(body);
    
    // Check for suspicious patterns in the request
    if (hasSuspiciousPatterns(sanitizedBody)) {
      console.error('Suspicious patterns detected in request:', sanitizedBody);
      
      // Log potential attack attempt
      return createSecureResponse(
        { error: 'Request contains potentially malicious data' },
        400
      );
    }
    
    const { sessionId, direct = false } = sanitizedBody;

    if (!sessionId) {
      return createSecureResponse(
        { error: "Session ID is required" },
        400
      );
    }

    console.log('Verifying payment for session:', sessionId, 'Direct mode:', direct);

    // Validate the session ID format (enhanced validation)
    const isValidSessionId = /^(cs|sub)_[a-zA-Z0-9]{10,}$/.test(sessionId);
    if (!isValidSessionId) {
      // Log invalid session ID format as potential attack
      console.error('Invalid session ID format:', sessionId);
      
      return createSecureResponse(
        { error: 'Invalid session ID format' },
        400
      );
    }

    // Extract authentication token for user verification
    const authHeader = req.headers.get('authorization');
    let userId = null;
    let validAuthToken = false;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      // Validate JWT structure before using it
      if (validateJwtStructure(token)) {
        try {
          // In a real implementation, you'd verify the JWT signature
          // This is just a basic placeholder
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.sub;
          validAuthToken = true;
          
          console.log('Authenticated user ID from token:', userId);
        } catch (e) {
          console.error('Error extracting user ID from token:', e);
        }
      }
    }

    // Handling direct mode with test session for debugging
    if (direct && sessionId.startsWith('cs_test_')) {
      console.log('Direct mode with test session ID, returning mock success');
      return createMockResponse(sessionId, corsHeaders);
    }

    // Initialize Stripe client
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return createSecureResponse(
        { error: "Payment system configuration error" },
        500
      );
    }

    // Retrieve and verify the Stripe session
    try {
      const { session, success: paymentSuccessful, userId: sessionUserId } = await verifyStripePayment(sessionId);
      
      // Verify that the authenticated user matches the user from the session
      const userIdFromSession = sessionUserId || '';
      
      if (validAuthToken && userId && userIdFromSession && userId !== userIdFromSession) {
        // Potential payment hijacking attempt - log this as a severe security issue
        console.error('User ID mismatch! Auth token user:', userId, 'Session user:', userIdFromSession);
        
        return createSecureResponse(
          { error: 'User authentication mismatch' },
          403
        );
      }
      
      // Use the userId from the session if not available from auth
      userId = userIdFromSession || userId;
      
      if (!userId) {
        console.error('User ID not found in session:', session);
        
        // For debugging in direct mode, create a mock success
        if (direct) {
          console.log('Direct mode, returning mock success despite missing user ID');
          return createMockResponse(sessionId, corsHeaders, 'No user ID found');
        }
        
        return createSecureResponse(
          { error: 'Unable to determine user from payment session' },
          400
        );
      }

      console.log('User ID from session:', userId);

      // If payment was successful, update the user's subscription status
      if (paymentSuccessful) {
        try {
          await updateUserSubscription(userId);
          console.log(`Payment verified and profile updated for user: ${userId}`);
        } catch (updateError) {
          console.error('Error updating user subscription:', updateError);
          
          // Still return successful verification but with a warning
          return createSecureResponse({ 
            verified: true,
            warning: "Payment was successful but failed to update user profile. Please contact support.",
            session: {
              id: session.id,
              status: session.status,
              payment_status: session.payment_status,
              userId: userId
            }
          });
        }
      } else {
        console.log(`Payment not completed. Status: ${session.status}, Payment status: ${session.payment_status}`);
      }

      // Return the session status with limited information for security
      return createSecureResponse({ 
        verified: paymentSuccessful,
        session: {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          userId: userId
        }
      });
    } catch (stripeError) {
      console.error('Stripe error during payment verification:', stripeError);
      
      return createSecureResponse(
        { 
          error: stripeError.message || 'Error verifying payment with payment provider',
          code: stripeError.code || 'unknown_error'
        },
        400
      );
    }
  } catch (error) {
    // Log the error
    console.error('Error verifying payment:', error);
    
    // Return a secure error response
    return createSecureResponse(
      { error: error.message || 'An error occurred processing the payment verification' },
      500
    );
  }
});
