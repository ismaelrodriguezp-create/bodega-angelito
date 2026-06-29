import type { ServiceClient } from './client';
import type { Database } from '@bodega-angelito/db';

export interface WorkerProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: Database['public']['Enums']['worker_role'];
  storeId: string;
}

export async function getWorkerByAuthId(
  client: ServiceClient,
  authUserId: string
): Promise<WorkerProfile | null> {
  const { data, error } = await client
    .from('workers')
    .select('id, first_name, last_name, role, store_id')
    .eq('auth_user_id', authUserId)
    .eq('is_active', true)
    .maybeSingle<{
      id: string;
      first_name: string;
      last_name: string;
      role: Database['public']['Enums']['worker_role'];
      store_id: string;
    }>();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    storeId: data.store_id,
  };
}
