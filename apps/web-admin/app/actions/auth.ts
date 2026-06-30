'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { Database } from '@bodega-angelito/db';
import { getWorkerByAuthId, toServiceClient } from '@bodega-angelito/services';

// ─── Utilidad: cliente con service_role (bypasa RLS completamente) ────────────
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Faltan credenciales de servicio Supabase');
  return createServiceClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function signInAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[auth] signIn error:', error.message);
    if (error.message === 'Email not confirmed') {
      return { error: 'Debes confirmar tu email antes de ingresar.' };
    }
    if (error.message === 'Invalid login credentials') {
      return { error: 'Email o contraseña incorrectos. Si olvidaste la contraseña, usa: node scripts/reset-admin-password.mjs' };
    }
    return { error: `Error de autenticación: ${error.message}` };
  }

  // Verificar que el usuario tenga un worker asociado
  try {
    const serviceSupabase = getServiceClient();
    const worker = await getWorkerByAuthId(toServiceClient(serviceSupabase), data.user.id);
    if (!worker) {
      await supabase.auth.signOut();
      return {
        error: 'Tu cuenta no está vinculada a un trabajador en la base de datos.',
      };
    }
  } catch (e) {
    console.warn('[auth] No se pudo verificar worker, continuando:', e);
  }

  redirect('/');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function getSessionWorker() {
  try {
    // Obtener la sesión real de Supabase
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      // Retornar null para obligar a ir a /login
      return null;
    }

    // Buscar el worker con service_role
    const serviceSupabase = getServiceClient();
    const worker = await getWorkerByAuthId(toServiceClient(serviceSupabase), session.user.id);

    if (worker) return worker;
    
    // Si no tiene worker pero tiene sesión (ej. primer ingreso), retornamos null para desloguear
    return null;
  } catch (e) {
    console.warn('[auth] getSessionWorker falló:', e);
    return null;
  }
}
