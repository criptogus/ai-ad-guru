
/**
 * Test stripe connection - checks if the Stripe API is accessible
 */

import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

interface StripeConnectionResult {
  success: boolean;
  message: string;
  apiVersion?: string;
  timestamp?: number;
}

export const testStripeConnection = async (): Promise<StripeConnectionResult> => {
  try {
    console.log('Running Stripe connection test...');
    
    const { data, error } = await supabase.functions.invoke('test-stripe-connection', {
      body: {}
    });
    
    if (error) {
      console.error('Error testing Stripe connection:', error);
      return {
        success: false,
        message: `Error connecting to Stripe: ${error.message}`,
        timestamp: Date.now()
      };
    }
    
    if (!data || !data.success) {
      return {
        success: false,
        message: data?.message || 'Unknown error testing Stripe connection',
        apiVersion: data?.apiVersion,
        timestamp: Date.now()
      };
    }
    
    return {
      success: true,
      message: data.message || 'Successfully connected to Stripe API',
      apiVersion: data.apiVersion,
      timestamp: Date.now()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? 
      error.message : 
      'Unknown error occurred testing Stripe connection';
      
    errorLogger.logError(error, 'testStripeConnection');
    
    console.error('Exception in testStripeConnection:', errorMessage);
    
    return {
      success: false,
      message: errorMessage,
      timestamp: Date.now()
    };
  }
};
