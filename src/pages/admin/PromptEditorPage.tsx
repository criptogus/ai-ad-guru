
import React, { useState } from 'react';
import { useAppPrompts, AppPrompt } from '@/hooks/useAppPrompts';
import SafeAppLayout from '@/components/SafeAppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, AlertTriangle, RefreshCw, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PromptEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { prompts, isLoading, error, updatePrompt } = useAppPrompts();
  const [selectedPromptKey, setSelectedPromptKey] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<string>('');
  const [editingDescription, setEditingDescription] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Redirect non-authenticated users
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Select the first prompt by default
  React.useEffect(() => {
    if (!isLoading && Object.keys(prompts).length > 0 && !selectedPromptKey) {
      const firstKey = Object.keys(prompts)[0];
      setSelectedPromptKey(firstKey);
      setEditingPrompt(prompts[firstKey].prompt);
      setEditingDescription(prompts[firstKey].description || '');
    }
  }, [isLoading, prompts, selectedPromptKey]);

  const handleSelectPrompt = (key: string) => {
    setSelectedPromptKey(key);
    setEditingPrompt(prompts[key].prompt);
    setEditingDescription(prompts[key].description || '');
  };

  const handleSavePrompt = async () => {
    if (!selectedPromptKey) return;
    
    setIsSaving(true);
    try {
      await updatePrompt(selectedPromptKey, editingPrompt, editingDescription);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPrompt = () => {
    if (!selectedPromptKey) return;
    setEditingPrompt(prompts[selectedPromptKey].prompt);
    setEditingDescription(prompts[selectedPromptKey].description || '');
  };

  if (isLoading) {
    return (
      <SafeAppLayout activePage="admin">
        <div className="container py-10">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading prompts...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SafeAppLayout>
    );
  }

  const selectedPrompt = selectedPromptKey ? prompts[selectedPromptKey] : null;
  const isReadOnly = selectedPrompt?.read_only || false;
  
  return (
    <SafeAppLayout activePage="admin">
      <div className="container py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Prompt Editor</h1>
          <p className="text-muted-foreground">
            View and edit the core prompts used throughout the application
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Prompts</CardTitle>
              <CardDescription>
                These prompts power the AI-generated content across the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="view">View Prompts</TabsTrigger>
                  <TabsTrigger value="edit">Edit Prompts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="view">
                  <div className="space-y-4">
                    {Object.values(prompts).map((prompt) => (
                      <div key={prompt.id} className="p-4 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{prompt.key}</h3>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">v{prompt.version}</span>
                            {prompt.read_only && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                Read Only
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {prompt.description && (
                          <p className="text-sm text-muted-foreground mb-2">{prompt.description}</p>
                        )}
                        
                        <div className="p-3 bg-muted rounded-md">
                          <pre className="text-xs whitespace-pre-wrap">{prompt.prompt}</pre>
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          Updated: {new Date(prompt.updated_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="edit">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-3">
                      <div className="space-y-2">
                        <Label>Select Prompt</Label>
                        <div className="space-y-1">
                          {Object.values(prompts).map((prompt) => (
                            <Button
                              key={prompt.id}
                              variant={selectedPromptKey === prompt.key ? "default" : "outline"}
                              onClick={() => handleSelectPrompt(prompt.key)}
                              className="w-full justify-start"
                              size="sm"
                            >
                              {prompt.key}
                              {prompt.read_only && (
                                <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                  RO
                                </span>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-12 md:col-span-9">
                      {selectedPrompt ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label htmlFor="promptKey">Key</Label>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Version {selectedPrompt.version}</span>
                                {isReadOnly && (
                                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                    Read Only
                                  </span>
                                )}
                              </div>
                            </div>
                            <Input
                              id="promptKey"
                              value={selectedPrompt.key}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="promptDescription">Description</Label>
                            <Input
                              id="promptDescription"
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              disabled={isReadOnly}
                              placeholder="Prompt description"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="promptContent">Prompt Content</Label>
                            <Textarea
                              id="promptContent"
                              value={editingPrompt}
                              onChange={(e) => setEditingPrompt(e.target.value)}
                              rows={12}
                              disabled={isReadOnly}
                              className="font-mono text-sm"
                            />
                          </div>
                          
                          {isReadOnly && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Read-only prompt</AlertTitle>
                              <AlertDescription>
                                This is a core system prompt and cannot be modified through the UI
                                to ensure system stability.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={handleResetPrompt}
                              disabled={isReadOnly || isSaving}
                            >
                              Reset
                            </Button>
                            <Button
                              onClick={handleSavePrompt}
                              disabled={isReadOnly || isSaving}
                            >
                              {isSaving ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 border rounded-md">
                          <p className="text-muted-foreground">Select a prompt to edit</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-muted-foreground">
                Prompt changes affect all new ad generations
              </div>
              <Button variant="outline" onClick={() => navigate('/admin')}>
                Back to Admin
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SafeAppLayout>
  );
};

export default PromptEditorPage;
