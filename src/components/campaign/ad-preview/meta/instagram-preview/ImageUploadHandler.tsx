
import React from "react";

interface ImageUploadHandlerProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadHandler: React.FC<ImageUploadHandlerProps> = ({ onChange }) => {
  return (
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onChange}
    />
  );
};

export default ImageUploadHandler;
