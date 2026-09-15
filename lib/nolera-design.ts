import { supabase } from "@/lib/supabase-browser";

export type DesignTool = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  currency: string;
  icon: string | null;
  external_url: string | null;
};

export async function getDesignTools(): Promise<DesignTool[]> {
  const { data, error } = await supabase
    .from("nolera_design_tools")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getMyDesignRentals() {
  const { data, error } = await supabase.rpc(
    "nolera_get_my_design_rentals"
  );

  if (error) throw error;
  return data ?? [];
}

export async function rentDesignTool(
  toolId: string,
  currency = "USD"
) {
  const { data, error } = await supabase.rpc(
    "nolera_rent_design_tool",
    {
      p_tool_id: toolId,
      p_currency: currency,
    }
  );

  if (error) throw error;
  return data;
}

export async function applyDesignToProduct(
  productId: string,
  designConfig: Record<string, unknown>
) {
  const { data, error } = await supabase.rpc(
    "nolera_apply_product_design",
    {
      p_product_id: productId,
      p_design_config: designConfig,
    }
  );

  if (error) throw error;
  return data;
}
