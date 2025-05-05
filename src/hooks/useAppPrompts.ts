
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AppPrompt {
  id: string;
  key: string;
  prompt: string;
  description: string | null;
  version: number;
  read_only: boolean;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
  metadata?: Record<string, any> | null;
}

interface UseAppPromptsReturn {
  prompts: Record<string, AppPrompt>;
  isLoading: boolean;
  error: string | null;
  getPrompt: (key: string) => AppPrompt | null;
  getPromptText: (key: string) => string;
  updatePrompt: (key: string, newPrompt: string, description?: string) => Promise<boolean>;
  createPrompt: (key: string, prompt: string, description?: string) => Promise<boolean>;
}

// Default prompts as fallback if database retrieval fails
const DEFAULT_PROMPTS: Record<string, Omit<AppPrompt, 'id' | 'created_at' | 'updated_at'>> = {
  openai_ad_generator: {
    key: 'openai_ad_generator',
    prompt: 'You are an AI assistant specialized in creating effective advertising content. Generate compelling ad copy for {{platform}} that highlights the unique value proposition of {{companyName}} in the {{industry}} industry. The target audience is {{targetAudience}}. Use a {{brandTone}} tone and incorporate these keywords: {{keywords}}. The primary call to action should be: {{callToAction}}. Focus on these unique selling points: {{uniqueSellingPoints}}.',
    description: 'Primary prompt used for generating ad content across all platforms',
    version: 1,
    read_only: true,
    is_active: true
  },
  openai_image_generator: {
    key: 'openai_image_generator',
    prompt: 'Generate a cinematic, high-end advertising image for an {{platform}} campaign targeting {{targetAudience}} in {{industry}}. The visual must evoke {{mindTrigger}} and drive conversions, styled like a top-tier NYC creative agency\'s work. Use photorealistic rendering with soft lighting, shallow depth of field, and a clean, persuasive composition. Reflect {{companyName}}\'s value through a central subject. Incorporate modern branding with clean, bold visuals. Format: 1080x1080px for Instagram, 1200x627px for LinkedIn. Ensure mobile-friendly visuals with no text overlay.',
    description: 'Enhanced prompt template for generating ad images across platforms',
    version: 1,
    read_only: true,
    is_active: true
  }
};

export const useAppPrompts = (): UseAppPromptsReturn => {
  const [prompts, setPrompts] = useState<Record<string, AppPrompt>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('app_prompts' as any)
          .select('*')
          .order('version', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        const promptsRecord: Record<string, AppPrompt> = {};
        
        // Group by key and take the latest version of each key
        const processedKeys = new Set<string>();
        
        if (data) {
          data.forEach((prompt: any) => {
            if (!processedKeys.has(prompt.key)) {
              const cleanedPrompt: AppPrompt = {
                id: prompt.id,
                key: prompt.key,
                prompt: prompt.prompt,
                description: prompt.description,
                version: prompt.version || 1,
                read_only: prompt.read_only || false,
                created_at: prompt.created_at,
                updated_at: prompt.updated_at,
                is_active: prompt.is_active !== false // Default to true if not explicitly set to false
              };
              
              promptsRecord[prompt.key] = cleanedPrompt;
              processedKeys.add(prompt.key);
            }
          });
        }

        setPrompts(promptsRecord);
        console.log('Loaded prompts from database:', Object.keys(promptsRecord));
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError('Failed to load prompts from database. Using default fallbacks.');
        
        // Load default prompts as fallback
        const defaultRecord: Record<string, AppPrompt> = {};
        Object.entries(DEFAULT_PROMPTS).forEach(([key, prompt]) => {
          defaultRecord[key] = {
            ...prompt,
            id: `default-${key}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as AppPrompt;
        });
        
        setPrompts(defaultRecord);
        console.log('Using default prompts as fallback');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const getPrompt = (key: string): AppPrompt | null => {
    return prompts[key] || null;
  };

  const getPromptText = (key: string): string => {
    // Return the stored prompt if available
    if (prompts[key]) {
      return prompts[key].prompt;
    }
    
    // Return default prompt as fallback
    if (DEFAULT_PROMPTS[key]) {
      return DEFAULT_PROMPTS[key].prompt;
    }
    
    // If no prompt is found (shouldn't happen with proper keys)
    console.warn(`Prompt key not found: ${key}`);
    return '';
  };

  const updatePrompt = async (key: string, newPrompt: string, description?: string): Promise<boolean> => {
    try {
      const existingPrompt = prompts[key];
      
      if (existingPrompt && existingPrompt.read_only) {
        toast.error("Cannot update a read-only prompt");
        return false;
      }
      
      if (existingPrompt) {
        // Mark the existing prompt as inactive (soft-delete for versioning)
        const { error: deactivateError } = await supabase
          .from('app_prompts' as any)
          .update({ is_active: false })
          .eq('id', existingPrompt.id);
          
        if (deactivateError) throw deactivateError;
        
        // Create a new version
        const { error: insertError, data: newPromptData } = await supabase
          .from('app_prompts' as any)
          .insert({
            key,
            prompt: newPrompt,
            description: description || existingPrompt.description,
            version: existingPrompt.version + 1,
            read_only: existingPrompt.read_only,
            is_active: true
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        // Update local state
        if (newPromptData) {
          const cleanedPrompt: AppPrompt = {
            id: newPromptData.id,
            key: newPromptData.key,
            prompt: newPromptData.prompt,
            description: newPromptData.description,
            version: newPromptData.version || 1,
            read_only: newPromptData.read_only || false,
            created_at: newPromptData.created_at,
            updated_at: newPromptData.updated_at,
            is_active: true
          };
          
          setPrompts(prev => ({
            ...prev,
            [key]: cleanedPrompt
          }));
        }
      } else {
        // Create new prompt
        return await createPrompt(key, newPrompt, description);
      }
      
      toast.success("Prompt updated successfully");
      return true;
    } catch (err) {
      console.error('Error updating prompt:', err);
      toast.error("Failed to update prompt");
      return false;
    }
  };
  
  const createPrompt = async (key: string, prompt: string, description?: string): Promise<boolean> => {
    try {
      const insertData = {
        key,
        prompt,
        description,
        version: 1,
        read_only: false,
        is_active: true
      };
      
      const { error: insertError, data: newPromptData } = await supabase
        .from('app_prompts' as any)
        .insert(insertData)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Update local state
      if (newPromptData) {
        const cleanedPrompt: AppPrompt = {
          id: newPromptData.id,
          key: newPromptData.key,
          prompt: newPromptData.prompt,
          description: newPromptData.description,
          version: newPromptData.version || 1,
          read_only: newPromptData.read_only || false,
          created_at: newPromptData.created_at,
          updated_at: newPromptData.updated_at,
          is_active: true
        };
        
        setPrompts(prev => ({
          ...prev,
          [key]: cleanedPrompt
        }));
      }
      
      toast.success("New prompt created successfully");
      return true;
    } catch (err) {
      console.error('Error creating prompt:', err);
      toast.error("Failed to create prompt");
      return false;
    }
  };

  return {
    prompts,
    isLoading,
    error,
    getPrompt,
    getPromptText,
    updatePrompt,
    createPrompt
  };
};
