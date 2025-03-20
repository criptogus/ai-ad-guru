
/**
 * Server-side validation helper
 * This simulates server-side validation in the client
 * In a real app, this would be implemented on the server
 */
export const validateServerSide = (
  data: any, 
  validationRules: Record<string, (value: any) => boolean>
): { 
  valid: boolean; 
  errors: Record<string, string> 
} => {
  const errors: Record<string, string> = {};
  
  // Apply validation rules
  Object.entries(validationRules).forEach(([field, validator]) => {
    const value = data[field];
    if (!validator(value)) {
      errors[field] = `Invalid value for ${field}`;
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
