
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const PlansTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Starter Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Starter</CardTitle>
          <CardDescription>Perfect for small businesses</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">$15</span>
            <span className="text-muted-foreground ml-1">/ 100 credits</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Create ~20 Google or Meta ads</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Generate ~20 Instagram images</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Basic AI optimizations</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => navigate("/billing")}>
            Buy Credits
          </Button>
        </CardFooter>
      </Card>
      
      {/* Pro Plan */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Professional</CardTitle>
          <CardDescription>Best for growing businesses</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">$50</span>
            <span className="text-muted-foreground ml-1">/ 500 credits</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Create ~100 Google or Meta ads</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Generate ~100 Instagram images</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Advanced AI optimizations</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>33% discount vs starter</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/billing")}>
            Buy Credits
          </Button>
        </CardFooter>
      </Card>
      
      {/* Agency Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Agency</CardTitle>
          <CardDescription>For agencies & power users</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">$150</span>
            <span className="text-muted-foreground ml-1">/ 2000 credits</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Create ~400 Google or Meta ads</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Generate ~400 Instagram images</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>All AI optimizations</span>
            </li>
            <li className="flex">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>50% discount vs starter</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => navigate("/billing")}>
            Buy Credits
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlansTab;
