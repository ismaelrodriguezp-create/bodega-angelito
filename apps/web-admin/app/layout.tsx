import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bodega Angelito - Panel de Control',
  description: 'Administración de Inventario y Ventas en Tiempo Real',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#f1f3f4] text-[#1f1f1f]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
