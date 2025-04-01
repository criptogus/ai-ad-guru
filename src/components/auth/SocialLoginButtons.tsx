
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FcGoogle } from "react-icons/fc";

const SocialLoginButtons: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-4 my-4">
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
