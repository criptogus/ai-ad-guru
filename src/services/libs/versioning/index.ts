
/**
 * API Versioning utilities
 * These help manage API version compatibility
 */

// Current API version
export const API_VERSION = 'v1';

/**
 * Append version to API endpoint
 */
export const versionedEndpoint = (endpoint: string, version = API_VERSION) => {
  if (endpoint.startsWith('/')) {
    return `/${version}${endpoint}`;
  }
  return `/${version}/${endpoint}`;
};

/**
 * Check if a version is supported
 */
export const isVersionSupported = (version: string) => {
  const supportedVersions = ['v1'];
  return supportedVersions.includes(version);
};

/**
 * Get a versioned API handler
 */
export const getVersionedHandler = (handlers: Record<string, any>, version = API_VERSION) => {
  if (handlers[version]) {
    return handlers[version];
  }
  
  // Fallback to latest if version not found
  return handlers[API_VERSION];
};

/**
 * API feature flags
 * Used to enable/disable features based on API version
 */
export const featureFlags = {
  v1: {
    enhancedAnalytics: false,
    multiPlatformPublishing: true,
    aiOptimization: true,
    teamCollaboration: false,
  }
};

/**
 * Check if a feature is enabled in a specific version
 */
export const isFeatureEnabled = (feature: string, version = API_VERSION) => {
  if (!featureFlags[version]) {
    return false;
  }
  
  return !!featureFlags[version][feature];
};
