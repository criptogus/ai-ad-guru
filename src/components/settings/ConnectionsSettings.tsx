
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccountConnections from "@/components/config/AccountConnections";

const ConnectionsSettings: React.FC = () => {
  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Ad Platform Connections</CardTitle>
        <CardDescription>
          Connect your ad accounts to create and manage campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AccountConnections />
      </CardContent>
    </Card>
  );
};

export default ConnectionsSettings;
