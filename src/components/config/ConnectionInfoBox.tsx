
import React from "react";
import { Info } from "lucide-react";

interface ConnectionInfoBoxProps {
  hasError: boolean;
}

const ConnectionInfoBox: React.FC<ConnectionInfoBoxProps> = ({ hasError }) => {
  return (
    <div className="bg-muted p-4 rounded-md mt-6">
      <div className="flex items-start">
        <Info className="h-5 w-5 mr-2 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium mb-2">About Ad Account Connections</h4>
          <p className="text-sm text-muted-foreground">
            Connecting your ad accounts allows Zero Agency Ad Guru to create and manage 
            campaigns on your behalf. Your credentials are securely stored and you 
            can disconnect your accounts at any time.
          </p>
          
          {hasError && (
            <div className="mt-3 pt-3 border-t border-muted-foreground/20">
              <h5 className="font-medium text-sm mb-1">Troubleshooting</h5>
              <p className="text-xs text-muted-foreground">
                If you're experiencing connection issues, please ensure that all required 
                API credentials are properly configured in your Supabase project. This includes 
                client ID, client secret, and any platform-specific tokens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionInfoBox;
