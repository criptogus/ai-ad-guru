
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, isValidEmail, isStrongPassword } from '@/utils/security';
import { securityConfig } from '@/config/security';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

// List of commonly used passwords to prevent
const commonPasswords = [
  'password', 'password123', '123456', 'qwerty', 'admin', 'welcome',
  'letmein', 'abc123', 'monkey', 'football', 'iloveyou', 'admin123',
  'superman', 'starwars'
];

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    isCommonPassword: false
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { toast } = useToast();

  // Check for brute force attempts
  const [signupAttempts, setSignupAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  
  useEffect(() => {
    // Reset signup attempts counter after 1 hour
    const now = Date.now();
    if (now - lastAttemptTime > 60 * 60 * 1000) {
      setSignupAttempts(0);
    }
  }, [lastAttemptTime]);

  // Update password strength in real-time
  useEffect(() => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        isCommonPassword: false
      });
      return;
    }
    
    // Check for common passwords (case insensitive)
    const isCommon = commonPasswords.some(
      commonPwd => password.toLowerCase() === commonPwd.toLowerCase()
    );
    
    const strengthCheck = {
      hasMinLength: password.length >= securityConfig.password.minLength,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      isCommonPassword: isCommon
    };
    
    // Calculate score based on criteria met
    let score = 0;
    if (strengthCheck.hasMinLength) score++;
    if (strengthCheck.hasUppercase) score++;
    if (strengthCheck.hasLowercase) score++;
    if (strengthCheck.hasNumber) score++;
    if (strengthCheck.hasSpecial) score++;
    if (strengthCheck.isCommonPassword) score = 0; // Override score for common passwords
    
    setPasswordStrength({
      ...strengthCheck,
      score
    });
  }, [password]);

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

    // Protection against rapid form submissions
    const now = Date.now();
    if (signupAttempts >= 5 && now - lastAttemptTime < 60 * 60 * 1000) {
      toast({
        title: "Too Many Attempts",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    // Validate name
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
      if (passwordStrength.score < 4) {
        errors.password = 'Password is not strong enough';
        isValid = false;
      }
      
      if (passwordStrength.isCommonPassword) {
        errors.password = 'This password is too common and easily guessable';
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
    
    // Track signup attempts
    setSignupAttempts(prev => prev + 1);
    setLastAttemptTime(Date.now());
    
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
  
  const getPasswordStrengthText = () => {
    if (!password) return '';
    if (passwordStrength.isCommonPassword) return 'Very Weak';
    
    const scores = ['Very Weak', 'Weak', 'Moderate', 'Good', 'Strong', 'Very Strong'];
    return scores[passwordStrength.score];
  };
  
  const getPasswordStrengthColor = () => {
    if (!password) return 'bg-gray-200';
    if (passwordStrength.isCommonPassword) return 'bg-red-500';
    
    const colors = [
      'bg-red-500',      // Very Weak
      'bg-red-400',      // Weak
      'bg-orange-400',   // Moderate
      'bg-yellow-400',   // Good
      'bg-green-400',    // Strong
      'bg-green-500'     // Very Strong
    ];
    
    return colors[passwordStrength.score];
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
          maxLength={100}
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
            maxLength={100}
            aria-describedby="password-strength"
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
        
        {/* Password strength meter */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Password Strength</span>
              <span className={
                passwordStrength.score < 3 ? "text-red-500" : 
                passwordStrength.score < 4 ? "text-yellow-500" : 
                "text-green-500"
              }>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getPasswordStrengthColor()}`} 
                style={{ width: `${Math.min(100, passwordStrength.score * 20)}%` }}
              ></div>
            </div>
            
            {/* Password requirements checklist */}
            <ul className="space-y-1 text-xs">
              <li className="flex items-center">
                {passwordStrength.hasMinLength ? 
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : 
                  <AlertCircle className="h-3 w-3 mr-1 text-gray-400" />
                }
                <span>At least {securityConfig.password.minLength} characters</span>
              </li>
              <li className="flex items-center">
                {passwordStrength.hasUppercase ? 
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : 
                  <AlertCircle className="h-3 w-3 mr-1 text-gray-400" />
                }
                <span>At least one uppercase letter</span>
              </li>
              <li className="flex items-center">
                {passwordStrength.hasLowercase ? 
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : 
                  <AlertCircle className="h-3 w-3 mr-1 text-gray-400" />
                }
                <span>At least one lowercase letter</span>
              </li>
              <li className="flex items-center">
                {passwordStrength.hasNumber ? 
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : 
                  <AlertCircle className="h-3 w-3 mr-1 text-gray-400" />
                }
                <span>At least one number</span>
              </li>
              <li className="flex items-center">
                {passwordStrength.hasSpecial ? 
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : 
                  <AlertCircle className="h-3 w-3 mr-1 text-gray-400" />
                }
                <span>At least one special character</span>
              </li>
            </ul>
          </div>
        )}
        
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
          maxLength={100}
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
