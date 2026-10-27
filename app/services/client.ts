import { createBrowserClient } from "@supabase/ssr";


// Create a single supabase client for interacting with your database
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase environment variables in .env.local");
}

const supabaseClient = createBrowserClient(url, key);
export default supabaseClient;
