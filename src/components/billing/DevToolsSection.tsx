
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DevToolsSectionProps {
  updateUserPaymentStatus: (hasPaid: boolean) => Promise<void>;
}

const DevToolsSection: React.FC<DevToolsSectionProps> = ({ updateUserPaymentStatus }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mb-8 border-dashed border-amber-300 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-800 text-lg">Developer Tools</CardTitle>
        <CardDescription className="text-amber-700">
          Tools for testing payment flows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-amber-100 rounded-md">
            <p className="text-sm text-amber-800 mb-3">
              These tools simulate payment actions without actually processing payments.
              For testing purposes only.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => updateUserPaymentStatus(true)}
                className="bg-amber-200 hover:bg-amber-300 text-amber-900"
              >
                Simulate Successful Payment
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateUserPaymentStatus(false)}
                className="border-amber-300 text-amber-800"
              >
                Simulate Cancellation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevToolsSection;
