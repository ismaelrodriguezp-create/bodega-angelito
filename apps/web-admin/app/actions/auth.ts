'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { Database } from '@bodega-angelito/db';
import { getWorkerByAuthId, toServiceClient } from '@bodega-angelito/services';

// ─── Utilidad: cliente con service_role (bypasa RLS completamente) ────────────
function getServiceClient() {
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
      return { error: 'Email o contraseña incorrectos.' };
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
        error: 'Tu cuenta no está vinculada a un trabajador. Contacta al administrador.',
      };
    }
  } catch (e) {
    console.warn('[auth] No se pudo verificar worker, continuando:', e);
    // Si hay error al verificar, igual permitimos el acceso en modo demo
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
    // Intentar obtener la sesión real de Supabase
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      // Fallback al worker de demostración
      return getDefaultWorker();
    }

    // Buscar el worker con service_role para evitar problemas de RLS
    const serviceSupabase = getServiceClient();
    const worker = await getWorkerByAuthId(toServiceClient(serviceSupabase), session.user.id);

    if (worker) return worker;
    return getDefaultWorker();
  } catch (e) {
    console.warn('[auth] getSessionWorker falló, usando demo:', e);
    return getDefaultWorker();
  }
}

function getDefaultWorker() {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    firstName: 'Admin',
    lastName: 'Bodega',
    role: 'admin' as const,
    storeId: process.env.NEXT_PUBLIC_DEFAULT_STORE_ID ?? '11111111-1111-1111-1111-111111111111',
  };
}
