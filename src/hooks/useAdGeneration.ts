
// Fix re-exporting issues with types
import { useAdGeneration } from './adGeneration';

// Re-export the main hook
export { useAdGeneration };

// Re-export types using 'export type' syntax
export type { GoogleAd, MetaAd, MicrosoftAd, LinkedInAd } from './adGeneration/types';

// Re-export all other types
export * from './adGeneration/types';
