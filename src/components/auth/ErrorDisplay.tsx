
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive">
      <AlertCircle className="h-4 w-4 mr-2" />
      {error}
    </div>
  );
};

export default ErrorDisplay;
