
import React, { forwardRef } from "react";

export interface ImageUploadHandlerProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadHandler = forwardRef<HTMLInputElement, ImageUploadHandlerProps>(
  ({ onChange }, ref) => {
    return (
      <input
        type="file"
        ref={ref}
        onChange={onChange}
        accept="image/*"
        className="hidden"
      />
    );
  }
);

ImageUploadHandler.displayName = "ImageUploadHandler";

export default ImageUploadHandler;
