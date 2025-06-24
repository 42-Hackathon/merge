import { createClient } from '@supabase/supabase-js'

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in the .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
