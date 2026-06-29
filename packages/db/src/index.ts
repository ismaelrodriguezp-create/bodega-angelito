import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export * from './database.types';

export function getSupabaseClient(url: string, anonKey: string) {
  return createSupabaseClient<Database>(url, anonKey);
}
