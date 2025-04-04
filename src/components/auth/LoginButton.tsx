
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface LoginButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  children = 'Login'
}) => {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    try {
      // Check if the user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If already logged in, redirect to dashboard
        navigate('/dashboard');
      } else {
        // If not logged in, redirect to login page
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Default to login page if there's an error
      navigate('/auth/login');
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default LoginButton;
