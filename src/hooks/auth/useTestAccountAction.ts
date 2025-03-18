
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createTestAccount as createTest } from '@/services/auth';

export const useTestAccountAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createTestAccount = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { testEmail, testPassword } = await createTest();
      
      toast({
        title: "Test account created",
        description: `Use the credentials to log in. Click Sign In button to continue.`,
      });
      
      // Dispatch a custom event with the test account credentials
      const testAccountEvent = new CustomEvent('testAccountCreated', {
        detail: { email: testEmail, password: testPassword }
      });
      window.dispatchEvent(testAccountEvent);
    } catch (error: any) {
      console.error("Error creating test account:", error);
      toast({
        title: "Failed to create test account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTestAccount,
    isLoading
  };
};
