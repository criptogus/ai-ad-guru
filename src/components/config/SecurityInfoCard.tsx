
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, Key, RefreshCw, CheckCircle2 } from "lucide-react";

const SecurityInfoCard: React.FC = () => {
  return (
    <Card className="bg-card border-border shadow-sm mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Security Information</CardTitle>
        </div>
        <CardDescription>
          Your ad account credentials are securely encrypted and stored following OAuth 2.0 best practices.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Lock className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>We never store your passwords</span>
          </div>
          <div className="flex items-start space-x-2">
            <Key className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>All API tokens are encrypted in our database</span>
          </div>
          <div className="flex items-start space-x-2">
            <RefreshCw className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>You can revoke access at any time</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <span>Connection is handled securely via OAuth 2.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityInfoCard;
