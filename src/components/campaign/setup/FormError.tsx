
import React from "react";

interface FormErrorProps {
  error: string | null | undefined;
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="text-sm text-red-500 mt-1">{error}</p>
  );
};
