import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

export const isSupabaseConfigured =
  Boolean(config.supabaseUrl) && Boolean(config.supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;
