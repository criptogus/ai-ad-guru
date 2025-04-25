
/**
 * Utility functions for the analyze-website edge function
 */

// Validate the required fields in analysis result
export function validateAnalysisResult(result: any): boolean {
  const requiredFields = ['companyName', 'businessDescription', 'targetAudience', 'keywords'];
  
  return requiredFields.every(field => {
    return result[field] !== undefined && result[field] !== null;
  });
}

// Normalize array fields to ensure they are arrays
export function normalizeArrayFields(result: any): any {
  const normalizedResult = { ...result };
  
  // Ensure keywords is an array
  if (!Array.isArray(normalizedResult.keywords)) {
    normalizedResult.keywords = normalizedResult.keywords ? [normalizedResult.keywords] : [];
  }
  
  // Ensure callToAction is an array
  if (!Array.isArray(normalizedResult.callToAction)) {
    normalizedResult.callToAction = normalizedResult.callToAction ? [normalizedResult.callToAction] : [];
  }
  
  // Ensure uniqueSellingPoints is an array
  if (!Array.isArray(normalizedResult.uniqueSellingPoints)) {
    normalizedResult.uniqueSellingPoints = normalizedResult.uniqueSellingPoints ? [normalizedResult.uniqueSellingPoints] : [];
  }
  
  return normalizedResult;
}
