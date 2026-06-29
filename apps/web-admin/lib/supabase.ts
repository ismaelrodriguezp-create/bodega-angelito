import { getSupabaseClient } from '@bodega-angelito/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
export type { Database } from '@bodega-angelito/db';
export type { ProductSchemaInput, ProductWithStockSchemaInput } from '@bodega-angelito/shared';
export * from '@bodega-angelito/shared';
