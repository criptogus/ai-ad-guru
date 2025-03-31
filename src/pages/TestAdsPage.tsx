
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const TestAdsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Test Your Ads</h1>
        <p className="text-muted-foreground">
          Create and test different ad variations before launching your campaign
        </p>
      </div>

      <Tabs defaultValue="google" className="space-y-6">
        <TabsList>
          <TabsTrigger value="google">Google Ads</TabsTrigger>
          <TabsTrigger value="meta">Meta Ads</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google">
          <Card>
            <CardHeader>
              <CardTitle>Test Google Ads</CardTitle>
              <CardDescription>
                Create and test different Google search ad variations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No test ads created yet. Create your first Google ad to get started.
                </p>
                <Button>Create Test Ad</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle>Test Meta Ads</CardTitle>
              <CardDescription>
                Create and test different Facebook and Instagram ad variations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No test ads created yet. Create your first Meta ad to get started.
                </p>
                <Button>Create Test Ad</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin">
          <Card>
            <CardHeader>
              <CardTitle>Test LinkedIn Ads</CardTitle>
              <CardDescription>
                Create and test different LinkedIn ad variations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No test ads created yet. Create your first LinkedIn ad to get started.
                </p>
                <Button>Create Test Ad</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestAdsPage;
