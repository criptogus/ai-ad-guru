
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, PlusCircleIcon } from 'lucide-react';

interface TestAccountSectionProps {
  isCreatingTestAccount: boolean;
  onCreateTestAccount: () => Promise<void>;
}

const TestAccountSection: React.FC<TestAccountSectionProps> = ({
  isCreatingTestAccount,
  onCreateTestAccount,
}) => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
      <AlertDescription className="text-blue-700 text-sm">
        <p className="font-semibold">No users in your Supabase project?</p>
        <p className="mb-2">Click the button below to create a test account:</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-700 border-blue-300 w-full" 
          onClick={onCreateTestAccount}
          disabled={isCreatingTestAccount}
        >
          <PlusCircleIcon className="h-3 w-3 mr-1" />
          {isCreatingTestAccount ? 'Creating...' : 'Create Test Account'}
        </Button>
        <p className="mt-2 text-xs">
          This will create a unique test account with a generated email
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default TestAccountSection;
