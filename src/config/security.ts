
/**
 * Security configuration settings for the application
 */

export const securityConfig = {
  // Authentication settings
  auth: {
    sessionDuration: 60 * 60 * 24 * 7, // 7 days in seconds
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
  },
  
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
  },
  
  // Cookie security settings
  cookies: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  },
  
  // API security
  api: {
    maxRequestsPerMinute: 100,
    maxRequestsPerDay: 1000,
    requestTimeout: 30000, // 30 seconds in milliseconds
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
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
  
  // Content Security Policy settings
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
  }
};

// Helper to build CSP header string from config
export const buildCSPHeader = (): string => {
  return Object.entries(securityConfig.csp)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()} ${value.join(' ')}`)
    .join('; ');
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
