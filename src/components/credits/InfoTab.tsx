
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InfoTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How Credits Work</CardTitle>
          <CardDescription>Understanding our credit system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">1</div>
              <div>
                <h3 className="font-medium text-lg">Purchase Credits</h3>
                <p className="text-muted-foreground mt-1">
                  Buy a credit package that fits your needs. Credits never expire, so you can use them at your own pace.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">2</div>
              <div>
                <h3 className="font-medium text-lg">Generate AI Content</h3>
                <p className="text-muted-foreground mt-1">
                  Create ads, generate images, and get AI optimizations. Each action costs a specific number of credits.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">3</div>
              <div>
                <h3 className="font-medium text-lg">Track Usage</h3>
                <p className="text-muted-foreground mt-1">
                  Monitor your credit usage in your account. You'll see exactly how many credits each action costs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 mr-3 flex-shrink-0">4</div>
              <div>
                <h3 className="font-medium text-lg">Top Up When Needed</h3>
                <p className="text-muted-foreground mt-1">
                  When your credits run low, simply purchase more. We'll send you a notification when you're running low.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Do credits expire?</h3>
            <p className="text-muted-foreground mt-1">No, your credits never expire. Use them at your own pace.</p>
          </div>
          
          <div>
            <h3 className="font-medium">Can I get a refund for unused credits?</h3>
            <p className="text-muted-foreground mt-1">Credits are non-refundable, but they never expire so you can use them anytime.</p>
          </div>
          
          <div>
            <h3 className="font-medium">Are there any monthly fees?</h3>
            <p className="text-muted-foreground mt-1">No, we only charge for credits. There are no subscription or monthly fees.</p>
          </div>
          
          <div>
            <h3 className="font-medium">Can I share credits with team members?</h3>
            <p className="text-muted-foreground mt-1">Credits are tied to your account, but team members can use them when working on your campaigns.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoTab;
