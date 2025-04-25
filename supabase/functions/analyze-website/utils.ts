
// Validate that the analysis result has all required fields
export function validateAnalysisResult(result: any): boolean {
  if (!result) return false;

  // List of required fields in the analysis result
  const requiredFields = [
    'companyName',
    'businessDescription',
    'targetAudience',
    'brandTone'
  ];

  // Check that all required fields exist and are not empty
  for (const field of requiredFields) {
    if (!result[field]) {
      console.warn(`Missing required field in analysis result: ${field}`);
      return false;
    }
  }

  // Also check that we have at least some of the array fields
  if (!result.keywords?.length && !result.callToAction?.length && !result.uniqueSellingPoints?.length) {
    console.warn('Analysis result is missing all array fields');
    return false;
  }

  return true;
}

// Normalize array fields to ensure they are always arrays
export function normalizeArrayFields(result: any): any {
  const normalized = { ...result };
  
  // Define array fields
  const arrayFields = ['keywords', 'callToAction', 'uniqueSellingPoints'];
  
  // Ensure each field is an array
  arrayFields.forEach(field => {
    if (!normalized[field]) {
      normalized[field] = [];
    } else if (!Array.isArray(normalized[field])) {
      // Convert to array if it's not already
      normalized[field] = [normalized[field]];
    }
  });
  
  return normalized;
}
