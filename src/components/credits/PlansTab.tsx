
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlansTab = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "Starter",
      price: "$19",
      credits: 100,
      features: [
        "Google Ads Generation",
        "Meta Ads Generation",
        "Basic AI Optimization",
        "Campaign Analytics"
      ]
    },
    {
      name: "Professional",
      price: "$49",
      credits: 500,
      popular: true,
      features: [
        "Google & Meta Ads Generation",
        "LinkedIn & Microsoft Ads",
        "Advanced AI Optimization",
        "Smart Banner Creation",
        "Unlimited Campaigns"
      ]
    },
    {
      name: "Agency",
      price: "$99",
      credits: 1500,
      features: [
        "All Ad Platforms",
        "Daily AI Optimization",
        "Team Collaboration",
        "White-label Reports",
        "Priority Support"
      ]
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "border-primary shadow-md" : ""}>
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {plan.credits} credits included
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => navigate("/billing")}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted p-4 rounded-md text-sm">
        <p className="font-medium mb-2">Additional Credits</p>
        <p className="text-muted-foreground mb-4">
          You can purchase additional credits at any time without changing your plan.
        </p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="border rounded-md p-3">
            <div className="font-medium">100 Credits</div>
            <div className="text-muted-foreground">$9</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="font-medium">500 Credits</div>
            <div className="text-muted-foreground">$39</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansTab;
