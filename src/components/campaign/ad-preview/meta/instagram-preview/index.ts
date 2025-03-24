
// Export individual components
export { default as InstagramPreviewHeader } from './InstagramPreviewHeader';
export { default as InstagramPreviewFooter } from './InstagramPreviewFooter';
export { default as ImageContent } from './ImageContent';
export { default as ImagePlaceholder } from './ImagePlaceholder';
export { default as ImageUploadHandler } from './ImageUploadHandler';
export { default as ImageDisplay } from './ImageDisplay';
export { default as ImageLoader } from './ImageLoader';
export { default as DebugInfo } from './DebugInfo';

// There's no need for a composite component here since we're using the individual components
// and we already have InstagramPreview.tsx in another directory
