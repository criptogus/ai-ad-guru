
import { sanitizeInput } from '@/utils/security';

/**
 * Sanitize request body to prevent injection
 */
export const sanitizeRequestBody = (body: any): any => {
  if (!body) return body;

  // Handle arrays
  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item));
  }

  // Handle objects
  if (typeof body === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const value = body[key];
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeRequestBody(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  }

  // Handle strings
  if (typeof body === 'string') {
    return sanitizeInput(body);
  }

  // Return as is for other primitives
  return body;
};
