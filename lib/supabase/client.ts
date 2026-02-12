/**
 * Supabase Client for client-side usage
 * Use this in React components with 'use client' directive
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

// Convenience export for direct usage
export const supabase =
  typeof window !== "undefined" ? getSupabaseClient() : null;
