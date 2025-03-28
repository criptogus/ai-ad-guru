
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2, HardDrive, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storageCleanupService } from "@/services/storage/storageCleanup";

const StorageCleanupCard: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastCleanupResult, setLastCleanupResult] = useState<{
    serverCleanup?: boolean;
    tempFilesCleared?: number;
    dbsCleared?: number;
  } | null>(null);
  
  const handleCleanup = async () => {
    setIsLoading(true);
    
    try {
      // First perform local cleanup
      const localResults = await storageCleanupService.fullLocalCleanup();
      
      // Then trigger server-side cleanup
      await storageCleanupService.triggerCleanup();
      
      setLastCleanupResult({
        serverCleanup: true,
        ...localResults
      });
      
      toast({
        title: "Storage cleanup completed",
        description: "Temporary files and unused storage have been cleared",
        variant: "default",
      });
    } catch (error) {
      console.error("Storage cleanup failed:", error);
      toast({
        title: "Storage cleanup failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      
      // Still show local results even if server cleanup failed
      setLastCleanupResult({
        serverCleanup: false,
        tempFilesCleared: await storageCleanupService.clearTemporaryFiles(),
        dbsCleared: await storageCleanupService.clearIndexedDBStorage(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Storage Management</CardTitle>
            <CardDescription>
              Free up storage space by clearing unused temporary files
            </CardDescription>
          </div>
          <HardDrive className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {lastCleanupResult && (
            <Alert className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Cleanup Completed</AlertTitle>
              <AlertDescription className="text-sm space-y-1">
                <p>Cleared {lastCleanupResult.tempFilesCleared} temporary files</p>
                {lastCleanupResult.dbsCleared && <p>Removed {lastCleanupResult.dbsCleared} cached databases</p>}
                <p>{lastCleanupResult.serverCleanup ? "Server storage cleanup complete" : "Local cleanup only"}</p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleCleanup}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cleaning up...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clean Up Storage
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            This will clear temporary files and unused storage to free up disk space.
            No credits are used for this operation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageCleanupCard;
