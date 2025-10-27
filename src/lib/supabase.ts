// import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export default function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables');
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    // {async accessToken() {return ((await auth()).getToken())}});
  )
}
