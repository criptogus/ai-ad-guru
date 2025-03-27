
import { supabase } from '@/integrations/supabase/client';

/**
 * Supabase helper functions
 */
export const supabaseHelpers = {
  /**
   * Check if a table exists
   */
  tableExists: async (tableName: string) => {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
        
      return !error;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Get the current authenticated user ID
   */
  getCurrentUserId: async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
  },
  
  /**
   * Handle common error patterns from Supabase
   */
  handleError: (error: any) => {
    if (!error) return null;
    
    // Handle PostgreSQL errors
    if (error.code) {
      switch (error.code) {
        case '23505': // unique_violation
          return { message: 'This record already exists.', type: 'conflict' };
        case '23503': // foreign_key_violation
          return { message: 'This operation references a record that does not exist.', type: 'not_found' };
        case '23514': // check_violation
          return { message: 'This data does not meet the requirements.', type: 'validation' };
        default:
          return { message: error.message, type: 'database', code: error.code };
      }
    }
    
    // Handle authentication errors
    if (error.status) {
      switch (error.status) {
        case 401:
          return { message: 'Authentication required.', type: 'unauthorized' };
        case 403:
          return { message: 'You do not have permission to perform this action.', type: 'forbidden' };
        default:
          return { message: error.message, type: 'http', status: error.status };
      }
    }
    
    // Default error handling
    return { message: error.message || 'An unknown error occurred', type: 'unknown' };
  }
};
