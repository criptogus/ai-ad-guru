
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { createTestAccount } = useAuth();

  useEffect(() => {
    // Listen for the custom event to update form values
    const handleTestAccountCreated = (event: CustomEvent<{ email: string, password: string }>) => {
      const { email, password } = event.detail;
      setEmail(email);
      setPassword(password);
      
      // Show toast notification to guide the user
      toast({
        title: "Test credentials loaded",
        description: "Click 'Sign in' to log in with the test account",
      });
    };

    // Type casting is needed for CustomEvent with TypeScript
    window.addEventListener('testAccountCreated' as any, handleTestAccountCreated);

    return () => {
      window.removeEventListener('testAccountCreated' as any, handleTestAccountCreated);
    };
  }, [toast]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Required fields missing',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log('Submitting login form with email:', email);
      await onSubmit(email, password);
    } catch (error) {
      console.error('Error in LoginForm handleSubmit:', error);
      // Error handling is managed by the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          data-testid="email-input"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            data-testid="password-input"
          />
          <button 
            type="button" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
        data-testid="login-button"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
