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
    <div className="flex h-screen overflow-hidden">
      <aside className="desktop-sidebar w-[270px] flex-shrink-0 bg-white border-r border-[#dadce0] flex flex-col h-full overflow-y-auto">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-[#dadce0]">
          <div className="w-9 h-9 rounded-xl bg-[#1a73e8] flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[15px] text-[#1f1f1f] leading-tight">Bodega Angelito</p>
            <p className="text-[11px] text-[#5f6368]">Panel de Control</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
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

        <div className="p-4 border-t border-[#dadce0]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#1f1f1f] truncate">
                {worker.firstName} {worker.lastName}
              </p>
              <p className="text-[11px] text-[#5f6368] truncate capitalize">{worker.role}</p>
            </div>
          </div>
          <form action={signOut} className="mt-2 px-2">
            <button
              type="submit"
              className="w-full text-left text-[13px] text-[#5f6368] hover:text-[#1a73e8] py-2 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#dadce0] flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-[15px]">Bodega Angelito</span>
          </div>
          <div className="hidden md:block text-[14px] text-[#5f6368]">
            Gestión de bodega en tiempo real
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 bg-[#f0f2f5]">{children}</main>
      </div>

      <nav className="mobile-nav fixed bottom-0 left-0 right-0 bg-white border-t border-[#dadce0] z-30 px-2 py-2 justify-around items-center">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all ${
              pathname === item.href ? 'text-[#1a73e8]' : 'text-[#5f6368]'
            }`}
          >
            <div
              className={`w-14 h-8 rounded-full flex items-center justify-center transition-all ${
                pathname === item.href ? 'bg-[#e8f0fe]' : 'hover:bg-[#f1f3f4]'
              }`}
            >
              <NavIcon icon={item.icon} />
            </div>
            <span className={`text-[11px] font-medium ${pathname === item.href ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`}>
              {item.label}
            </span>
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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[14px] font-medium transition-all relative ${
        active ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'text-[#3c4043] hover:bg-[#f1f3f4]'
      }`}
    >
      <span className={active ? 'text-[#1a73e8]' : 'text-[#5f6368]'}>
        <NavIcon icon={icon} />
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-[#1a73e8] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
          {badge}
        </span>
      )}
    </Link>
  );
}

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>,
    inventory: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/></svg>,
    shopping_cart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return <>{icons[icon]}</>;
}
