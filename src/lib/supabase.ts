// // import { auth } from '@clerk/nextjs/server';
// import { createClient } from '@supabase/supabase-js';

// export default function createSupabaseClient() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

//   if (!supabaseUrl || !supabaseAnonKey) {
//     throw new Error('Missing Supabase URL or Anon Key in environment variables');
//   }

//   return createClient(
//     supabaseUrl,
//     supabaseAnonKey,
//     // {async accessToken() {return ((await auth()).getToken())}});
//   )
// }

import { createClient } from '@supabase/supabase-js';

export default function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // ← poprawna nazwa

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Service Role Key');
  }

  return createClient(url, key);
}