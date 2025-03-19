
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdPlatform } from './types';

export const useConnectionTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<AdPlatform, boolean>>({
    google: false,
    microsoft: false,
    linkedin: false,
    meta: false
  });
  const [connectionStatus, setConnectionStatus] = useState<Record<AdPlatform, 'untested' | 'success' | 'error'>>({
    google: 'untested',
    microsoft: 'untested',
    linkedin: 'untested',
    meta: 'untested'
  });
  const [statusDetails, setStatusDetails] = useState<Record<AdPlatform, string>>({
    google: '',
    microsoft: '',
    linkedin: '',
    meta: ''
  });

  const testConnection = async (platform: AdPlatform) => {
    setIsLoading(prev => ({ ...prev, [platform]: true }));
    setConnectionStatus(prev => ({ ...prev, [platform]: 'untested' }));
    setStatusDetails(prev => ({ ...prev, [platform]: '' }));
    
    try {
      const response = await supabase.functions.invoke('ad-account-test', {
        body: { platform }
      });

      if (response.error) {
        throw new Error(response.error.message || `Failed to test ${platform} connection`);
      }

      const data = response.data;
      
      if (!data.success) {
        setConnectionStatus(prev => ({ ...prev, [platform]: 'error' }));
        setStatusDetails(prev => ({ ...prev, [platform]: data.message || `Connection to ${platform} API failed` }));
        
        toast({
          title: `${platform} Connection Failed`,
          description: data.message || `Unable to connect to ${platform} API`,
          variant: "destructive",
        });
        return;
      }
      
      setConnectionStatus(prev => ({ ...prev, [platform]: 'success' }));
      setStatusDetails(prev => ({ ...prev, [platform]: data.message || `Successfully connected to ${platform} API` }));
      
      toast({
        title: `${platform} Connection Successful`,
        description: data.message || `Successfully connected to ${platform} API`,
      });
    } catch (error: any) {
      console.error(`Error testing ${platform} connection:`, error);
      
      setConnectionStatus(prev => ({ ...prev, [platform]: 'error' }));
      setStatusDetails(prev => ({ ...prev, [platform]: error.message || `An error occurred testing the ${platform} connection` }));
      
      toast({
        title: `${platform} Connection Test Failed`,
        description: error.message || `An error occurred testing the ${platform} connection`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  return {
    isLoading,
    connectionStatus,
    statusDetails,
    testConnection
  };
};
