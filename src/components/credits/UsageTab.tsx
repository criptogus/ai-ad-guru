
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const UsageTab = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Credit Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Total Credits</div>
                <div className="text-2xl font-bold mt-1">{user?.credits || 0}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Used This Month</div>
                <div className="text-2xl font-bold mt-1">0</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Earned</div>
                <div className="text-2xl font-bold mt-1">0</div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              Credits are used to power AI features in the platform. Each action costs a specific number of credits.
              You can purchase more credits in the Billing section.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Usage History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Recent credit usage activity</p>
          
          {/* This would be populated with actual data from the backend */}
          <div className="text-center py-8 text-muted-foreground">
            No credit usage data available yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageTab;
