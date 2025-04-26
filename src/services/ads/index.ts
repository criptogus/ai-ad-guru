
  // Export all ad platform integrations
  export * from './google';
  export * from './meta';
  export * from './linkedin';
  export * from './microsoft';

  // Export ad generation services
  export { 
    generateAds,
    generateLinkedInAdsContent,
    generateMicrosoftAdsContent
  } from './adGeneration/adGenerationService';

  export * from './adGeneration/promptTemplates';
  export * from './adGeneration/imageGenerationService';
