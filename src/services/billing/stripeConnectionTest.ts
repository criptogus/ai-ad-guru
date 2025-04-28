
import { supabase } from '@/integrations/supabase/client';

/**
 * Tests the connection to Stripe API via an Edge Function
 * @returns Promise with connection test result
 */
export const testStripeConnection = async (): Promise<{
  success: boolean;
  message: string;
  apiVersion?: string;
}> => {
  try {
    console.log('Testing Stripe API connection...');
    
    const { data, error } = await supabase.functions.invoke('test-stripe-connection', {
      body: { test: true }
    });
    
    if (error) {
      console.error('Error testing Stripe connection:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message || 'Unknown error'}`
      };
    }
    
    if (!data?.success) {
      return {
        success: false,
        message: data?.message || 'Connection test failed without specific error'
      };
    }
    
    return {
      success: true,
      message: data.message || 'Connection successful',
      apiVersion: data.apiVersion
    };
  } catch (err: any) {
    console.error('Exception testing Stripe connection:', err);
    return {
      success: false,
      message: `Exception: ${err.message || 'Unknown error'}`
    };
  }
};
