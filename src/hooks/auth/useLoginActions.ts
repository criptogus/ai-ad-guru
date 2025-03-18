
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLoginActions = (user: any, setUser: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // Initialize navigate but don't use it at the top level
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User logged in successfully', data.user);
        
        // Navigation should happen in a component's effect or event handler
        navigate('/dashboard');
        
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "There was a problem signing in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        throw error;
      }

      console.log('Google login initiated', data);
      toast({
        title: "Redirecting to Google",
        description: "Please confirm the login in the popup window",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message || "There was a problem signing in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            credits: 400,
            has_paid: false,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User registered successfully', data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          credits: 400,
          hasPaid: false,
          avatar: data.user.user_metadata.avatar_url || '',
        });
        navigate('/dashboard');
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem signing up",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        throw error;
      }

      console.log('User logged out successfully');
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "There was a problem logging out",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createTestAccount = async () => {
    try {
      setIsLoading(true);
      const randomString = Math.random().toString(36).substring(7);
      const email = `testuser_${randomString}@example.com`;
      const password = 'testpassword';
      const name = 'Test User';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            credits: 400,
            has_paid: true,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Test account creation error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Test account created successfully', data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          credits: 400,
          hasPaid: true,
          avatar: data.user.user_metadata.avatar_url || '',
        });
        navigate('/dashboard');
        return data;
      }
    } catch (error: any) {
      toast({
        title: "Test Account Creation Failed",
        description: error.message || "There was a problem creating the test account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPaymentStatus = async (hasPaid: boolean) => {
    try {
      setIsLoading(true);
      if (!user?.id) {
        console.warn('User ID not available. Cannot update payment status.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ has_paid: hasPaid })
        .eq('id', user.id)
        .select()

      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }

      console.log('Payment status updated successfully', data);
      setUser(prevUser => ({ ...prevUser, hasPaid: hasPaid }));
      return data;
    } catch (error: any) {
      toast({
        title: "Payment Status Update Failed",
        description: error.message || "There was a problem updating the payment status",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const simulateSuccessfulPayment = async () => {
    try {
      setIsLoading(true);
      // Simulate a successful payment by directly updating the user's hasPaid status
      await updateUserPaymentStatus(true);
      toast({
        title: "Payment Simulated",
        description: "The payment has been successfully simulated.",
      });
    } catch (error: any) {
      toast({
        title: "Payment Simulation Failed",
        description: error.message || "There was a problem simulating the payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    logout,
    register,
    createTestAccount,
    updateUserPaymentStatus,
    simulateSuccessfulPayment,
    isLoading,
  };
};
