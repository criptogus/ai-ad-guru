
import { useState, useEffect } from 'react';
import { securityConfig } from '@/config/security';

const commonPasswords = [
  'password', 'password123', '123456', 'qwerty', 'admin', 'welcome',
  'letmein', 'abc123', 'monkey', 'football', 'iloveyou', 'admin123',
  'superman', 'starwars'
];

export const usePasswordStrength = (password: string) => {
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    isCommonPassword: false
  });

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
    
    let score = 0;
    if (strengthCheck.hasMinLength) score++;
    if (strengthCheck.hasUppercase) score++;
    if (strengthCheck.hasLowercase) score++;
    if (strengthCheck.hasNumber) score++;
    if (strengthCheck.hasSpecial) score++;
    if (strengthCheck.isCommonPassword) score = 0;
    
    setPasswordStrength({
      ...strengthCheck,
      score
    });
  }, [password]);

  return passwordStrength;
};
