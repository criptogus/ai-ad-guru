
/**
 * Security configuration settings for the application
 */

export const securityConfig = {
  // Authentication settings
  auth: {
    sessionDuration: 60 * 60 * 24 * 7, // 7 days in seconds
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
    jwtExpiryTime: 3600, // 1 hour in seconds
    refreshTokenRotation: true,
  },
  
  // Password requirements
  password: {
    minLength: 10, // Increased from 8 to 10
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    preventCommonPasswords: true,
    passwordHistoryCount: 5, // Number of previous passwords to check
  },
  
  // Cookie security settings
  cookies: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  },
  
  // API security
  api: {
    maxRequestsPerMinute: 60, // Reduced to be more restrictive
    maxRequestsPerHour: 300,
    maxRequestsPerDay: 1000,
    requestTimeout: 30000, // 30 seconds in milliseconds
    useRateLimiting: true,
    sensitiveOperationsRateLimit: 10, // Lower rate limit for sensitive operations
  },
  
  // Allowed origins for CORS in production
  allowedOrigins: [
    'https://yourdomain.com',
    'https://app.yourdomain.com',
    'https://api.yourdomain.com',
  ],
  
  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
  },
  
  // Content Security Policy settings - enhanced to be more restrictive
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://www.google-analytics.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: ["'self'", 'data:', 'https://*.supabase.co', 'https://images.unsplash.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    connectSrc: ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co', 'https://api.openai.com'],
    frameSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    manifestSrc: ["'self'"],
    mediaSrc: ["'self'"],
    childSrc: ["'self'"],
    workerSrc: ["'self'"],
    scriptSrcAttr: ["'none'"],
    upgradeInsecureRequests: true,
  },
  
  // File upload security
  uploads: {
    maxSizeInMB: 5,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf'],
    scanForMalware: true,
    storageEncryption: true,
  },
  
  // Two-factor authentication
  twoFactorAuth: {
    enabled: false, // Can be enabled by users
    requiredForAdmins: true,
    allowedMethods: ['app', 'sms'],
  },
};

// Helper to build CSP header string from config
export const buildCSPHeader = (): string => {
  let cspString = '';
  
  // Process each CSP directive
  Object.entries(securityConfig.csp).forEach(([key, value]) => {
    if (key === 'upgradeInsecureRequests' && value === true) {
      cspString += 'upgrade-insecure-requests; ';
      return;
    }
    
    if (Array.isArray(value) && value.length > 0) {
      const formattedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      cspString += `${formattedKey} ${value.join(' ')}; `;
    }
  });
  
  return cspString.trim();
};

/**
 * Get all security headers as an object
 */
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    ...securityConfig.headers,
    'Content-Security-Policy': buildCSPHeader(),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
};

/**
 * Get environment-specific security settings
 */
export const getEnvironmentSecuritySettings = (): Record<string, any> => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  
  return {
    ...securityConfig,
    // Override certain settings in development environment
    api: {
      ...securityConfig.api,
      maxRequestsPerMinute: isDevelopment ? 1000 : securityConfig.api.maxRequestsPerMinute,
      maxRequestsPerDay: isDevelopment ? 10000 : securityConfig.api.maxRequestsPerDay,
    },
    headers: isDevelopment 
      ? { ...securityConfig.headers, 'Strict-Transport-Security': undefined }
      : securityConfig.headers,
  };
};
