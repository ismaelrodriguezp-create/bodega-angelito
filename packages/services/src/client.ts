import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@bodega-angelito/db';

export type ServiceClient = SupabaseClient<Database>;

export function toServiceClient(client: unknown): ServiceClient {
  return client as ServiceClient;
}
