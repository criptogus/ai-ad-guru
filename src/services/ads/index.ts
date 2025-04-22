
  // Export all ad platform integrations
  export * from './google';
  export * from './meta';
  export * from './linkedin';
  export * from './microsoft';

  // Only export uniquely named generation services, to avoid naming conflicts
  export { 
    generateAds,
    generateLinkedInAdsContent,
    generateMicrosoftAdsContent
  } from './adGeneration/adGenerationService';

  export * from './adGeneration/promptTemplates';
  export * from './adGeneration/imageGenerationService';
