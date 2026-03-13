import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Memory storage implementation for Supabase auth
const memoryStorage = {
  getItem: (key: string) => {
    return (window as any)[`_supabase_${key}`] || null;
  },
  setItem: (key: string, value: string) => {
    (window as any)[`_supabase_${key}`] = value;
  },
  removeItem: (key: string) => {
    delete (window as any)[`_supabase_${key}`];
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: memoryStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
