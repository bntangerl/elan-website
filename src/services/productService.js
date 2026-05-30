import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { localProducts } from "../data/products";
import { normalizeProduct } from "../utils/format";

export async function getProducts() {
  if (!isSupabaseConfigured) {
    return localProducts.map(normalizeProduct);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("Supabase products error:", error.message);
    return localProducts.map(normalizeProduct);
  }

  return (data || []).map(normalizeProduct);
}
