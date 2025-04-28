
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

/**
 * Create a database function to add a column if it doesn't exist
 */
export async function createAddColumnFunction() {
  try {
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    // Create the database function
    const { error } = await supabaseAdmin.rpc('create_add_column_function');
    
    if (error) {
      console.error("Error creating database function:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating database function:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Function to actually add the column
export async function addColumnIfNotExists(tableName: string, columnName: string, columnType: string) {
  try {
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    // Execute SQL to add the column if it doesn't exist
    const { error } = await supabaseAdmin.rpc('add_column_if_not_exists', {
      table_name: tableName,
      column_name: columnName,
      column_type: columnType
    });
    
    if (error) {
      console.error("Error adding column:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error adding column:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
