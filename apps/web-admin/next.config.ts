import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones para el build de producción (Netlify)
  typescript: {
    // Si hay errores de TS en CI, no bloquear el build
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
