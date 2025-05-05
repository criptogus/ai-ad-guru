
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/services/libs/error-handling';
import { Database } from '@/integrations/supabase/types';

/**
 * Check if a table exists in the database
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Using any type to bypass TypeScript's strict table name checking
    const { count, error } = await supabase
      .from(tableName as any)
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
    // Create a database function to get table columns if it doesn't exist
    const { data: fnExists } = await supabase
      .rpc('function_exists', { function_name: 'get_table_columns' });
      
    if (!fnExists) {
      // Function doesn't exist, create it
      const { error: createFnError } = await supabase.rpc('create_get_columns_function');
      if (createFnError) {
        console.error('Error creating get_table_columns function:', createFnError);
        // Fallback to a simpler approach - just get a row and extract keys
        const { data: sampleRow } = await supabase
          .from(tableName as any)
          .select('*')
          .limit(1)
          .single();
          
        return sampleRow ? Object.keys(sampleRow) : [];
      }
    }
    
    // Use the function to get columns
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: tableName });
    
    if (error) {
      console.error(`Error getting columns for table ${tableName}:`, error);
      
      // Fallback to a simpler approach - just get a row and extract keys
      const { data: sampleRow } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(1)
        .single();
        
      return sampleRow ? Object.keys(sampleRow) : [];
    }
    
    // Check if data is null before accessing it
    if (data === null) {
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

/**
 * Create a function to add the get_table_columns function if it doesn't exist
 */
export const createGetColumnsFunction = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('create_get_columns_function');
    return !error;
  } catch (error) {
    console.error('Error creating function for columns retrieval:', error);
    return false;
  }
};
