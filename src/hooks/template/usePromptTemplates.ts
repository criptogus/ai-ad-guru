
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt_text: string;
  created_by: string | null;
  created_at: string;
  editable: boolean;
  visibility: 'public' | 'private';
}

export interface UsePromptTemplatesReturn {
  templates: PromptTemplate[];
  isLoading: boolean;
  selectedTemplate: PromptTemplate | null;
  selectedCategory: string | null;
  categories: string[];
  error: string | null;
  setSelectedTemplate: (template: PromptTemplate | null) => void;
  setSelectedCategory: (category: string | null) => void;
  createTemplate: (template: Omit<PromptTemplate, 'id' | 'created_at' | 'created_by'>) => Promise<PromptTemplate | null>;
  updateTemplate: (id: string, updates: Partial<Omit<PromptTemplate, 'id' | 'created_at' | 'created_by'>>) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
}

export const usePromptTemplates = (): UsePromptTemplatesReturn => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('prompt_templates')
          .select('*')
          .order('category', { ascending: true })
          .order('title', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setTemplates(data as PromptTemplate[]);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(t => t.category)));
        setCategories(uniqueCategories);
        
      } catch (err) {
        console.error('Error fetching prompt templates:', err);
        setError('Failed to load templates');
        toast({
          title: 'Error',
          description: 'Failed to load templates',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [toast]);
  
  const createTemplate = async (template: Omit<PromptTemplate, 'id' | 'created_at' | 'created_by'>): Promise<PromptTemplate | null> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create templates',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .insert({
          ...template,
          created_by: user.id,
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTemplates(prev => [...prev, data as PromptTemplate]);
      
      // Update categories if needed
      if (!categories.includes(template.category)) {
        setCategories(prev => [...prev, template.category]);
      }
      
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
      
      return data as PromptTemplate;
      
    } catch (err) {
      console.error('Error creating template:', err);
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const updateTemplate = async (id: string, updates: Partial<Omit<PromptTemplate, 'id' | 'created_at' | 'created_by'>>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .update(updates)
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTemplates(prev => 
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );
      
      // Update selectedTemplate if it's the one being updated
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(prev => prev ? { ...prev, ...updates } : null);
      }
      
      // Update categories if needed
      if (updates.category && !categories.includes(updates.category)) {
        setCategories(prev => [...prev, updates.category!]);
      }
      
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
      
      return true;
      
    } catch (err) {
      console.error('Error updating template:', err);
      toast({
        title: 'Error',
        description: 'Failed to update template',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTemplates(prev => prev.filter(t => t.id !== id));
      
      // Clear selectedTemplate if it's the one being deleted
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
      
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      
      return true;
      
    } catch (err) {
      console.error('Error deleting template:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return {
    templates,
    isLoading,
    selectedTemplate,
    selectedCategory,
    categories,
    error,
    setSelectedTemplate,
    setSelectedCategory,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
