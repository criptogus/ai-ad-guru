
import { supabase } from '@/integrations/supabase/client';

/**
 * Analytics Service API
 * This service encapsulates all analytics-related operations
 */
export const analyticsApi = {
  /**
   * Get campaign performance metrics
   */
  getCampaignMetrics: async (campaignId: string, dateRange?: { start: string, end: string }) => {
    let query = supabase
      .from('campaign_performance')
      .select('*')
      .eq('campaign_id', campaignId);
      
    if (dateRange) {
      query = query
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Get overall performance metrics across all campaigns
   */
  getOverallMetrics: async (userId: string, dateRange?: { start: string, end: string }) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-performance-metrics', {
        body: { userId, dateRange }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting overall metrics:', error);
      throw error;
    }
  },
  
  /**
   * Generate AI insights based on campaign performance
   */
  generateInsights: async (campaignId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign-insights', {
        body: { campaignId }
      });
      
      if (error) throw error;
      return data?.insights;
    } catch (error) {
      console.error('Error generating campaign insights:', error);
      throw error;
    }
  },
  
  /**
   * Track a specific event
   */
  trackEvent: async (userId: string, eventType: string, eventData: any) => {
    try {
      const { error } = await supabase
        .from('user_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          event_data: eventData
        });
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      // Don't throw here to prevent UI breaking if analytics fails
      return false;
    }
  }
};
