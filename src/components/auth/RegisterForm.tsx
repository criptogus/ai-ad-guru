
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, isValidEmail, isStrongPassword } from '@/utils/security';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isSubmitting }) => {
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
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else {
      const passwordCheck = isStrongPassword(password);
      if (!passwordCheck.valid) {
        errors.password = passwordCheck.message;
        isValid = false;
      }
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Sanitize inputs before submission
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email.toLowerCase());
      
      await onSubmit(sanitizedName, sanitizedEmail, password);
    } catch (error) {
      console.error('Error in RegisterForm handleSubmit:', error);
      // Error handling is managed by the parent component
    }
  };

  const renderValidationError = (field: string) => {
    const error = validationErrors[field as keyof typeof validationErrors];
    if (!error) return null;
    
    return (
      <div className="text-red-500 text-xs mt-1 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>{error}</span>
      </div>
    );
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
        />
        {renderValidationError('name')}
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
        />
        {renderValidationError('email')}
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
        {renderValidationError('password')}
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
        />
        {renderValidationError('confirmPassword')}
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
