import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Env validation ───────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Add it to .env.local as ${key}=<your-value>`
    );
  }
  return value;
}

/**
 * Returns a Supabase client configured for server-side use.
 * Uses the service-role key so RLS is bypassed — only call from
 * server components, route handlers, or server actions.
 * A new client is created per call to avoid stale state in serverless.
 */
export function getSupabaseServer(): SupabaseClient {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
