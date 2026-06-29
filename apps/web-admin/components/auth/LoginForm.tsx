'use client';

import { useActionState } from 'react';
import { signInAction } from '@/app/actions/auth';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f4] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#dadce0] p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#1a73e8] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#1f1f1f]">Bodega Angelito</h1>
            <p className="text-[13px] text-[#5f6368]">Panel de administración</p>
          </div>
        </div>

        {state?.error && (
          <div className="mb-4 bg-[#fce8e6] text-[#c5221f] text-[13px] px-4 py-3 rounded-xl">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white"
              placeholder="admin@bodega.com"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 rounded-full bg-[#1a73e8] text-white text-[14px] font-medium hover:bg-[#1557b0] transition-colors disabled:opacity-50"
          >
            {pending ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
