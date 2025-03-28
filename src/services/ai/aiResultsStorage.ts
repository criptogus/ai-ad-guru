
import { supabase } from '@/integrations/supabase/client';

export interface AIResultData {
  input: string;
  response: any;
  type: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

/**
 * Stores AI results in the database
 */
export const storeAIResult = async (
  userId: string,
  data: AIResultData
): Promise<string | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for AI result storage');
      return null;
    }

    const { input, response, type, campaignId, metadata } = data;

    const { data: insertData, error } = await supabase
      .from('ai_results')
      .insert({
        user_id: userId,
        input,
        response,
        type,
        campaign_id: campaignId,
        metadata
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing AI result:', error);
      return null;
    }

    return insertData.id;
  } catch (error) {
    console.error('Unexpected error storing AI result:', error);
    return null;
  }
};

/**
 * Retrieves an AI result by ID
 */
export const getAIResultById = async (
  userId: string,
  resultId: string
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_results')
      .select('*')
      .eq('id', resultId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error retrieving AI result:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error retrieving AI result:', error);
    return null;
  }
};

/**
 * Gets recent AI results by type
 */
export const getRecentAIResults = async (
  userId: string,
  type: string,
  limit: number = 10
): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_results')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error retrieving AI results:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error retrieving AI results:', error);
    return null;
  }
};
