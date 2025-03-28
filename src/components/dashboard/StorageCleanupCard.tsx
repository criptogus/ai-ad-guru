
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import { useStorageCleanup } from "@/services/storage/storageCleanup";

const StorageCleanupCard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<{
    timestamp?: string;
    filesRemoved?: number;
  }>({});
  
  const { runCleanup } = useStorageCleanup();
  
  const handleCleanup = async (aggressive: boolean = false) => {
    setIsRunning(true);
    
    try {
      const result = await runCleanup({
        aggressive,
        showToast: true
      });
      
      if (result.success) {
        setLastCleanup({
          timestamp: new Date().toLocaleString(),
          filesRemoved: result.totalFilesRemoved || 0
        });
      }
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-muted-foreground" />
          Storage Cleanup
        </CardTitle>
        <CardDescription>
          Free up disk space by cleaning temporary files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lastCleanup.timestamp && (
            <div className="text-sm text-muted-foreground">
              <p>Last cleanup: {lastCleanup.timestamp}</p>
              <p>Files removed: {lastCleanup.filesRemoved}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleCleanup(false)}
              disabled={isRunning}
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Standard Cleanup
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => handleCleanup(true)}
              disabled={isRunning}
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Deep Cleanup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageCleanupCard;
