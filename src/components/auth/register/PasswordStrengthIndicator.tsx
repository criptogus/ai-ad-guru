
import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { securityConfig } from '@/config/security';

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: {
    score: number;
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    isCommonPassword: boolean;
  };
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  passwordStrength,
}) => {
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
  );
};
