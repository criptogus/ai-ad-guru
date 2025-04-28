
import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">Manage your credits and purchases</p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-12 w-full mb-6" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="relative border-2">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;
