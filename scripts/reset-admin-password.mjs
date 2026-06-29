/**
 * Restablece la contraseña del admin y confirma el email.
 * Uso: node scripts/reset-admin-password.mjs [nueva-contraseña]
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

const USER_ID = 'eda3399e-0daf-4e31-8fb1-0db4100953e7';
const newPassword = process.argv[2] || 'BodegaAngelito2026!';

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

console.log('Proyecto:', url);
console.log('Usuario:', USER_ID);
console.log('Nueva contraseña:', newPassword);

const res = await fetch(`${url}/auth/v1/admin/users/${USER_ID}`, {
  method: 'PUT',
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password: newPassword,
    email_confirm: true,
  }),
});

const body = await res.text();
if (!res.ok) {
  console.error('Error', res.status, body);
  process.exit(1);
}

console.log('Contraseña actualizada y email confirmado.');
console.log('\nInicia sesión con:');
console.log('  Email: blean473@gmail.com');
console.log('  Contraseña:', newPassword);
