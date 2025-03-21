
/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return input;
  
  // Convert HTML entities
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  // Replace characters with HTML entities
  return input.replace(/[&<>"'/]/g, char => htmlEntities[char]);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, with at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Generate a random token
 */
export const generateRandomToken = (length = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use crypto API if available for better randomness
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      token += characters[values[i] % characters.length];
    }
  } else {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }
  
  return token;
};

/**
 * Generate a secure token for sensitive operations
 */
export const generateSecureToken = (length = 32): string => {
  // Use the same implementation as generateRandomToken but with a different name
  // for semantic clarity in the codebase
  return generateRandomToken(length);
};

/**
 * Verify if a request is coming from the same origin
 */
export const isSameOrigin = (url: string): boolean => {
  try {
    const currentOrigin = window.location.origin;
    const targetOrigin = new URL(url).origin;
    return currentOrigin === targetOrigin;
  } catch (error) {
    console.error('Error checking origin:', error);
    return false;
  }
};

/**
 * Validate URL to prevent open redirect vulnerabilities
 */
export const isValidRedirectUrl = (url: string): boolean => {
  // Only allow relative URLs or same-origin URLs
  if (url.startsWith('/')) {
    return true;
  }
  
  return isSameOrigin(url);
};

/**
 * Validate file upload to prevent security issues
 */
export const validateFileUpload = (
  file: File, 
  allowedTypes: string[] = [], 
  maxSizeMB: number = 5
): { valid: boolean; message: string } => {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      message: `File size exceeds the maximum allowed size of ${maxSizeMB}MB` 
    };
  }
  
  // Check file type if allowedTypes is provided
  if (allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = file.type.toLowerCase();
    
    // Check if the file type or extension is in the allowed list
    const isTypeAllowed = allowedTypes.some(type => 
      fileType.includes(type) || fileExtension === type.replace('.', '')
    );
    
    if (!isTypeAllowed) {
      return { 
        valid: false, 
        message: `File type not allowed. Accepted file types: ${allowedTypes.join(', ')}` 
      };
    }
  }
  
  return { valid: true, message: 'File is valid' };
};
