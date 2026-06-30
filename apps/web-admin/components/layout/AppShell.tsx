'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { WorkerProfile } from '@bodega-angelito/services';
import { signOut } from '@/app/actions/auth';
import { useActiveOrderCount } from '@/hooks/use-orders';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', href: '/' },
  { icon: 'inventory', label: 'Productos', href: '/productos' },
  { icon: 'shopping_cart', label: 'Pedidos', href: '/pedidos' },
] as const;

export function AppShell({
  worker,
  children,
}: {
  worker: WorkerProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: activeOrders } = useActiveOrderCount();
  const initials = `${worker.firstName[0] ?? ''}${worker.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        className="desktop-sidebar w-[260px] flex-shrink-0 flex flex-col h-full overflow-y-auto"
        style={{
          background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo / Brand */}
        <div className="px-5 py-6 flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-[15px] leading-tight text-white">Bodega Angelito</p>
            <p className="text-[11px] font-medium" style={{ color: '#64748b' }}>Panel de Gestión</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 mb-4" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#334155' }}>
            Navegación
          </p>
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              badge={item.href === '/pedidos' && activeOrders ? String(activeOrders) : undefined}
            />
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4">
          <div
            className="rounded-2xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate">
                {worker.firstName} {worker.lastName}
              </p>
              <p className="text-[11px] font-medium capitalize" style={{ color: '#64748b' }}>
                {worker.role}
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                title="Cerrar sesión"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (mobile + desktop) */}
        <header
          className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-20"
          style={{
            background: 'white',
            borderBottom: '1px solid #f1f5f9',
            boxShadow: '0 1px 8px -4px rgba(15,23,42,0.08)',
          }}
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 md:hidden">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-extrabold text-[15px]" style={{ color: '#0f172a' }}>Bodega Angelito</span>
          </div>

          {/* Desktop label */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[13px] font-medium" style={{ color: '#64748b' }}>
              Sistema en línea · Gestión en tiempo real
            </span>
          </div>

          {/* Right side avatar */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[12px] font-bold shadow-md"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-6" style={{ background: '#f8fafc' }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="mobile-nav fixed bottom-0 left-0 right-0 z-30 px-3 py-2 justify-around items-center"
        style={{
          background: 'rgba(15,23,42,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all relative"
          >
            <div
              className="w-14 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                background: pathname === item.href ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: pathname === item.href ? '#818cf8' : '#475569',
              }}
            >
              <NavIcon icon={item.icon} />
            </div>
            <span
              className="text-[10px] font-bold"
              style={{ color: pathname === item.href ? '#818cf8' : '#475569' }}
            >
              {item.label}
            </span>
            {item.href === '/pedidos' && activeOrders ? (
              <span
                className="absolute top-1 right-2 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                style={{ background: '#6366f1' }}
              >
                {activeOrders}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  badge,
  href,
}: {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-[14px] font-semibold transition-all relative"
      style={{
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        color: active ? '#818cf8' : '#475569',
        border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
          (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          (e.currentTarget as HTMLAnchorElement).style.color = '#475569';
        }
      }}
    >
      {active && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
          style={{ background: '#818cf8' }}
        />
      )}
      <span style={{ color: active ? '#818cf8' : '#475569' }}>
        <NavIcon icon={icon} />
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className="text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    inventory: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    shopping_cart: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return <>{icons[icon]}</>;
}
