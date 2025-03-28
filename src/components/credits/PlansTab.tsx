
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlansTab = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <CardDescription>Perfect for testing the platform</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold">$49</span>
              <span className="text-muted-foreground ml-1">/one-time</span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Coins className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">100 credits</p>
                  <p className="text-sm text-muted-foreground">Create 20 search ads or 20 social ads</p>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => navigate("/billing")}>
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary bg-primary/5 hover:shadow-md transition-all duration-200 relative">
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
            <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Popular</span>
          </div>
          <CardHeader>
            <CardTitle>Professional</CardTitle>
            <CardDescription>Most popular for small businesses</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold">$99</span>
              <span className="text-muted-foreground ml-1">/one-time</span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Coins className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">250 credits</p>
                  <p className="text-sm text-muted-foreground">50 search ads or 50 social ads</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate("/billing")}>
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle>Agency</CardTitle>
            <CardDescription>Ideal for agencies managing multiple clients</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold">$249</span>
              <span className="text-muted-foreground ml-1">/one-time</span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Coins className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">700 credits</p>
                  <p className="text-sm text-muted-foreground">140 search ads or 140 social ads</p>
                </div>
              </div>
              <Button className="w-full" variant="outline" onClick={() => navigate("/billing")}>
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlansTab;
