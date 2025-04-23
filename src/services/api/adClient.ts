
import { supabase } from "@/integrations/supabase/client";

export async function callAdFunction(functionName: string, body: object) {
  const { data, error } = await supabase.functions.invoke(functionName, { body });

  if (error || !data?.success) {
    const message = data?.error || error?.message || "Erro desconhecido ao gerar anúncios";
    throw new Error(message);
  }

  return data.data;
}
