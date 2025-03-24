
import React from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, PanelLeftIcon, PenLine, LayoutPanelTop } from "lucide-react";

const SmartBannerPage: React.FC = () => {
  return (
    <SafeAppLayout activePage="smart-banner">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Smart Banner Creator</h1>
            <p className="text-muted-foreground">Create AI-powered ad banners for multiple platforms</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              5 credits per banner
            </Badge>
            <Button>Create New Banner</Button>
          </div>
        </div>

        <Tabs defaultValue="templates">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="templates">
              <LayoutPanelTop className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="my-banners">
              <ImageIcon className="h-4 w-4 mr-2" />
              My Banners
            </TabsTrigger>
            <TabsTrigger value="editor">
              <PenLine className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Banner Templates</CardTitle>
                <CardDescription>
                  Choose a template to start creating your banner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all">
                      <div className="bg-muted aspect-video rounded-md mb-3 flex items-center justify-center">
                        <span className="text-muted-foreground">Template {i}</span>
                      </div>
                      <h3 className="font-medium">Banner Template {i}</h3>
                      <p className="text-sm text-muted-foreground">
                        {i % 2 === 0 ? "300 x 250" : "728 x 90"} • {i % 3 === 0 ? "Google Display" : "Meta"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-banners">
            <Card>
              <CardHeader>
                <CardTitle>Your Banners</CardTitle>
                <CardDescription>
                  Manage your saved banners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't created any banners yet
                    </p>
                    <Button>Create Your First Banner</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>Banner Editor</CardTitle>
                <CardDescription>
                  Customize your banner with our easy-to-use editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Select a template or existing banner to start editing
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default SmartBannerPage;
