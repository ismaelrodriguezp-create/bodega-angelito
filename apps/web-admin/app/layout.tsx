import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bodega Angelito - Panel de Control",
  description: "Administración de Inventario y Ventas en Tiempo Real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#f1f3f4] text-[#1f1f1f]">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar w-[270px] flex-shrink-0 bg-white border-r border-[#dadce0] flex flex-col h-full overflow-y-auto">
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <SidebarItem icon="dashboard" label="Dashboard" href="/" active />
          <SidebarItem icon="inventory" label="Productos" href="#" />
          <SidebarItem icon="shopping_cart" label="Pedidos" href="#" badge="12" />
          <SidebarItem icon="people" label="Clientes" href="#" />
          <SidebarItem icon="bar_chart" label="Reportes" href="#" />
          <div className="pt-4 pb-2 px-3">
            <p className="text-[11px] font-semibold text-[#80868b] uppercase tracking-wider">Sistema</p>
          </div>
          <SidebarItem icon="settings" label="Configuración" href="#" />
          <SidebarItem icon="help" label="Ayuda" href="#" />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#dadce0]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#f1f3f4] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#1f1f1f] truncate">Administrador</p>
              <p className="text-[11px] text-[#5f6368] truncate">admin@bodega.com</p>
            </div>
            <span className="material-symbols-outlined text-[#5f6368] text-[18px]">more_vert</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top AppBar */}
        <header className="h-16 bg-white border-b border-[#dadce0] flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-20">
          {/* Mobile: Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-[15px]">Bodega Angelito</span>
          </div>

          {/* Desktop: Search bar */}
          <div className="hidden md:flex items-center bg-[#f1f3f4] rounded-full px-4 h-10 w-[380px] gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#5f6368] flex-shrink-0">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input className="bg-transparent flex-1 text-[14px] text-[#1f1f1f] placeholder-[#5f6368] outline-none" placeholder="Buscar productos, pedidos..." />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors relative md:hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#5f6368]">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#5f6368]">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#d93025] rounded-full border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-sm font-semibold cursor-pointer ml-1">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav fixed bottom-0 left-0 right-0 bg-white border-t border-[#dadce0] z-30 px-2 py-2 justify-around items-center">
        <MobileNavItem icon="dashboard" label="Inicio" active />
        <MobileNavItem icon="inventory" label="Productos" />
        <MobileNavItem icon="shopping_cart" label="Pedidos" />
        <MobileNavItem icon="people" label="Clientes" />
        <MobileNavItem icon="bar_chart" label="Más" />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, active, badge, href = "#" }: { icon: string; label: string; active?: boolean; badge?: string; href?: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>,
    inventory: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/></svg>,
    shopping_cart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    people: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/></svg>,
    bar_chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>,
    help: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  };

  return (
    <a
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[14px] font-medium transition-all relative ${
        active
          ? "bg-[#e8f0fe] text-[#1a73e8]"
          : "text-[#3c4043] hover:bg-[#f1f3f4]"
      }`}
    >
      <span className={active ? "text-[#1a73e8]" : "text-[#5f6368]"}>
        {icons[icon]}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-[#1a73e8] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
          {badge}
        </span>
      )}
    </a>
  );
}

function MobileNavItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>,
    inventory: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/></svg>,
    shopping_cart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    people: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>,
    bar_chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/></svg>,
  };
  return (
    <button className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all ${active ? "text-[#1a73e8]" : "text-[#5f6368]"}`}>
      <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all ${active ? "bg-[#e8f0fe]" : "hover:bg-[#f1f3f4]"}`}>
        {icons[icon]}
      </div>
      <span className={`text-[11px] font-medium ${active ? "text-[#1a73e8]" : "text-[#5f6368]"}`}>{label}</span>
    </button>
  );
}
