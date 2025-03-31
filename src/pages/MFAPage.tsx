
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const MFAPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the return path from the location state, or default to dashboard
  const returnTo = location.state?.returnTo || '/dashboard';
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Verification successful",
        description: "You have been securely authenticated"
      });
      
      navigate(returnTo);
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "The code you entered is invalid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-600 to-brand-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the verification code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="verificationCode"
                placeholder="Enter 6-digit code"
                className="text-center text-xl tracking-wider"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Didn't receive a code? <Button variant="link" className="p-0 h-auto">Resend code</Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth/login")} className="w-full">
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MFAPage;
