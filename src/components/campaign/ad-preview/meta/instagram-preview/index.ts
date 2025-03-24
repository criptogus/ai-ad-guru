
export { default as InstagramPreviewHeader } from './InstagramPreviewHeader';
export { default as InstagramPreviewFooter } from './InstagramPreviewFooter';
export { default as ImageContent } from './ImageContent';
export { default as ImagePlaceholder } from './ImagePlaceholder';
export { default as ImageUploadHandler } from './ImageUploadHandler';
export { default as ImageDisplay } from './ImageDisplay';
export { default as ImageLoader } from './ImageLoader';
export { default as DebugInfo } from './DebugInfo';

// Create a composite component for default export
import React from 'react';
import { ImageContent } from './ImageContent';
import { InstagramPreviewHeader } from './InstagramPreviewHeader';
import { InstagramPreviewFooter } from './InstagramPreviewFooter';

const InstagramPreview = () => {
  return (
    <div>
      <InstagramPreviewHeader />
      <ImageContent />
      <InstagramPreviewFooter />
    </div>
  );
};

export default InstagramPreview;
