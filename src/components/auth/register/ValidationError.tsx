
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorProps {
  error?: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="text-red-500 text-xs mt-1 flex items-center">
      <AlertCircle className="h-3 w-3 mr-1" />
      <span>{error}</span>
    </div>
  );
};
