/**
 * Verifica que la URL de Supabase en .env.local responda.
 * Uso: node scripts/validate-supabase.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { lookup } from 'dns/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../apps/web-admin/.env.local');

function loadEnv() {
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL en apps/web-admin/.env.local');
  process.exit(1);
}

const hostname = new URL(url).hostname;
console.log('URL configurada:', url);
console.log('Hostname:', hostname);

try {
  await lookup(hostname);
  console.log('✓ DNS resuelve correctamente');
} catch {
  console.error('❌ DNS NO resuelve — la URL del proyecto es incorrecta');
  console.error('   Ve a Supabase → botón verde "Connect" → Next.js → copia Project URL');
  process.exit(1);
}

try {
  const res = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: key || '' },
  });
  console.log('✓ API responde:', res.status);
} catch (e) {
  console.error('❌ No se pudo conectar a la API:', e.message);
  process.exit(1);
}

console.log('\nSi el login falla, resetea contraseña:');
console.log('  node scripts/reset-admin-password.mjs "TuNuevaClave123!"');
