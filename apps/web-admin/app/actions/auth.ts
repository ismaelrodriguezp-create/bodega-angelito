'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getWorkerByAuthId, toServiceClient } from '@bodega-angelito/services';

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
      return { error: 'Debes confirmar tu email antes de ingresar. Revisa tu bandeja o pide al admin que confirme tu cuenta.' };
    }
    if (error.message === 'Invalid login credentials') {
      return { error: 'Email o contraseña incorrectos. Si no la recuerdas, ejecuta: node scripts/reset-admin-password.mjs' };
    }
    return { error: `Error de autenticación: ${error.message}` };
  }

  const worker = await getWorkerByAuthId(toServiceClient(supabase), data.user.id);
  if (!worker) {
    await supabase.auth.signOut();
    return {
      error:
        'Tu cuenta no está vinculada a un trabajador. Contacta al administrador para activar tu acceso.',
    };
  }

  redirect('/');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function getSessionWorker() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return getWorkerByAuthId(toServiceClient(supabase), user.id);
}
