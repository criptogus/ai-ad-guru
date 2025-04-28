
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, isValidEmail } from '@/utils/security';
import { ValidationError } from './ValidationError';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { usePasswordStrength } from './usePasswordStrength';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [signupAttempts, setSignupAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const { toast } = useToast();
  
  const passwordStrength = usePasswordStrength(password);

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    let isValid = true;

    const now = Date.now();
    if (signupAttempts >= 5 && now - lastAttemptTime < 60 * 60 * 1000) {
      toast({
        title: "Too Many Attempts",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (name.length > 50) {
      errors.name = 'Name must be less than 50 characters';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (passwordStrength.score < 4) {
      errors.password = 'Password is not strong enough';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSignupAttempts(prev => prev + 1);
    setLastAttemptTime(Date.now());
    
    if (!validateForm()) return;
    
    try {
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      
      await onSubmit(sanitizedName, sanitizedEmail, password);
    } catch (error) {
      console.error('Error in RegisterForm handleSubmit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          data-testid="name-input"
          className={validationErrors.name ? "border-red-500" : ""}
          maxLength={50}
        />
        <ValidationError error={validationErrors.name} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="email-input"
          className={validationErrors.email ? "border-red-500" : ""}
          maxLength={100}
        />
        <ValidationError error={validationErrors.email} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="password-input"
            className={validationErrors.password ? "border-red-500" : ""}
            maxLength={100}
            aria-describedby="password-strength"
          />
          <button 
            type="button" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        </div>
        
        {password && (
          <PasswordStrengthIndicator 
            password={password} 
            passwordStrength={passwordStrength} 
          />
        )}
        
        <ValidationError error={validationErrors.password} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          data-testid="confirm-password-input"
          className={validationErrors.confirmPassword ? "border-red-500" : ""}
          maxLength={100}
        />
        <ValidationError error={validationErrors.confirmPassword} />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
        data-testid="register-button"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
      
      <p className="text-center text-sm text-gray-500">
        By creating an account, you agree to our{' '}
        <Link to="/terms-of-service" className="text-brand-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy-policy" className="text-brand-600 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
