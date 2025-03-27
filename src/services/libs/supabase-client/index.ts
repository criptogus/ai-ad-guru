
// Re-export the Supabase client from the main integration file
// This maintains a single instance of the client across the application
export { supabase } from '@/integrations/supabase/client';

// Export additional Supabase helpers if needed
export * from './supabaseHelpers';
