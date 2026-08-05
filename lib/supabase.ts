import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Safe fallbacks to prevent Next.js build crash during static pre-rendering
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gkseulnletsulozgblmj.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
