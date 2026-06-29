import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bodega Angelito - Panel de Control",
  description: "Administración de Inventario en Tiempo Real",
};

import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-slate-50 text-slate-900">
        <Providers>
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-200">
              <span className="text-xl font-bold text-slate-800 tracking-tight">Bodega Angelito</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              <Link href="/" className="flex items-center px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link href="/products" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                <Package className="w-5 h-5 mr-3" />
                Productos
              </Link>
              <Link href="/orders" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Pedidos
              </Link>
              <Link href="/customers" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                <Users className="w-5 h-5 mr-3" />
                Clientes
              </Link>
            </nav>
            <div className="p-4 border-t border-slate-200">
              <Link href="/settings" className="flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Configuración
              </Link>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col min-h-screen">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
              <h1 className="text-xl font-semibold text-slate-800">Panel de Control</h1>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </div>
            </header>
            <div className="p-6 md:p-8 flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}

