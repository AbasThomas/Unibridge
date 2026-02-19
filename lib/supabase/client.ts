import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Fallback placeholder values allow the client to be created at SSR/build time
  // without env vars — real API calls will fail gracefully when credentials are missing.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";
  return createBrowserClient(url, key);
}
