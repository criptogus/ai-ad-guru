
import React, { useRef } from "react";

interface ImageUploadHandlerProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedFormats?: string;
}

const ImageUploadHandler: React.FC<ImageUploadHandlerProps> = ({
  onChange,
  acceptedFormats = "image/jpeg,image/png,image/webp"
}) => {
  return (
    <input 
      type="file" 
      className="hidden" 
      onChange={onChange}
      accept={acceptedFormats}
    />
  );
};

export default ImageUploadHandler;
