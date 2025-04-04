
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';

/**
 * Check if a table exists in the database
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    return !error || error.code === 'PGRST116'; // PGRST116 is "No rows returned" which is fine
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Get table columns information
 */
export const getTableColumns = async (tableName: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: tableName });
    
    if (error) {
      console.error(`Error getting columns for table ${tableName}:`, error);
      return [];
    }
    
    return Array.isArray(data) 
      ? data.map((col: any) => col.column_name) 
      : [];
  } catch (error) {
    console.error(`Exception getting columns for table ${tableName}:`, error);
    errorLogger.logError(error, 'getTableColumns');
    return [];
  }
};
