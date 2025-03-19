
import { supabase } from "@/integrations/supabase/client";
import { Connection } from "./types";

export const fetchUserConnections = async (userId: string): Promise<Connection[]> => {
  const { data, error } = await supabase
    .from("user_integrations")
    .select("id, platform, account_id, created_at")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }

  return data || [];
};

export const removeUserConnection = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from("user_integrations")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error removing connection:", error);
    throw error;
  }
};
