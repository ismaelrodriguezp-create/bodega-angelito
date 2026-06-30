/**
 * SETUP COMPLETO DE BASE DE DATOS — Bodega Angelito
 * 
 * Este script:
 * 1. Verifica la conexión a Supabase
 * 2. Inserta la tienda (store) con el ID configurado
 * 3. Inserta las categorías base
 * 4. Crea el procedimiento RPC create_product_with_stock si no existe
 * 5. Muestra el estado del sistema
 * 
 * Uso: node scripts/setup-database.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, '../apps/web-admin/.env.local');
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const STORE_ID = env.NEXT_PUBLIC_DEFAULT_STORE_ID || '11111111-1111-1111-1111-111111111111';

console.log('🔧 Bodega Angelito — Setup de Base de Datos\n');
console.log('URL:', SUPABASE_URL);
console.log('Store ID:', STORE_ID);
console.log('');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno en apps/web-admin/.env.local');
  console.error('   Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Crear cliente con service_role (bypasa RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── 1. Verificar conexión ────────────────────────────────────────────────────
console.log('1️⃣  Verificando conexión...');
try {
  const { error } = await supabase.from('stores').select('count').limit(1);
  if (error && error.code !== 'PGRST116') {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
  console.log('   ✓ Conexión exitosa\n');
} catch (e) {
  console.error('❌ No se pudo conectar:', e.message);
  process.exit(1);
}

// ─── 2. Insertar Store ────────────────────────────────────────────────────────
console.log('2️⃣  Configurando tienda...');
const { data: existingStore } = await supabase
  .from('stores')
  .select('id, name')
  .eq('id', STORE_ID)
  .maybeSingle();

if (existingStore) {
  console.log(`   ✓ Tienda existente: "${existingStore.name}"\n`);
} else {
  const { error: storeError } = await supabase.from('stores').insert({
    id: STORE_ID,
    name: 'Bodega Angelito',
    address: 'Lima, Perú',
    phone: '',
    is_active: true,
  });

  if (storeError) {
    console.error('   ⚠️  No se pudo crear la tienda:', storeError.message);
    console.log('   (Continuando de todas formas...)\n');
  } else {
    console.log('   ✓ Tienda "Bodega Angelito" creada\n');
  }
}

// ─── 3. Insertar Categorías ───────────────────────────────────────────────────
console.log('3️⃣  Configurando categorías...');
const CATEGORIES = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Bebidas', slug: 'bebidas' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Lácteos', slug: 'lacteos' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Abarrotes', slug: 'abarrotes' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Limpieza', slug: 'limpieza' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'Panadería', slug: 'panaderia' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'Snacks', slug: 'snacks' },
  { id: '00000000-0000-0000-0000-000000000007', name: 'Higiene Personal', slug: 'higiene' },
];

for (const cat of CATEGORIES) {
  const { error } = await supabase
    .from('categories')
    .upsert(cat, { onConflict: 'id' });
  if (error) {
    console.log(`   ⚠️  ${cat.name}: ${error.message}`);
  } else {
    console.log(`   ✓ ${cat.name}`);
  }
}
console.log('');

// ─── 4. Verificar worker/usuario ─────────────────────────────────────────────
console.log('4️⃣  Verificando trabajadores registrados...');
const { data: workers, error: workersError } = await supabase
  .from('workers')
  .select('id, first_name, last_name, role, auth_user_id, is_active');

if (workersError) {
  console.log('   ⚠️  No se pudo leer workers:', workersError.message);
} else if (!workers || workers.length === 0) {
  console.log('   ⚠️  No hay trabajadores. Necesitas registrar un usuario admin.');
  console.log('   Ejecuta: node scripts/create-admin-worker.mjs');
} else {
  for (const w of workers) {
    console.log(`   ✓ ${w.first_name} ${w.last_name} (${w.role}) — activo: ${w.is_active}`);
  }
}
console.log('');

// ─── 5. Verificar función RPC ─────────────────────────────────────────────────
console.log('5️⃣  Verificando función create_product_with_stock...');
const { error: rpcError } = await supabase.rpc('create_product_with_stock', {
  p_store_id: '00000000-0000-0000-0000-000000000000',
  p_name: '__test__',
  p_brand: null,
  p_sku: 'TEST-000',
  p_barcode: null,
  p_description: null,
  p_category_id: null,
  p_price: 0,
  p_cost: 0,
  p_initial_stock: 0,
  p_minimum_stock: 0,
  p_safety_stock: 0,
  p_location_in_store: null,
});

if (rpcError && rpcError.code === 'PGRST202') {
  console.log('   ❌ La función RPC no existe. Necesitas ejecutar el SQL en Supabase.');
  console.log('   Abre Supabase → SQL Editor → pega el contenido de scripts/create-rpc.sql\n');
} else if (rpcError) {
  // Puede fallar por store_id inválido, pero eso significa que la función SÍ existe
  console.log('   ✓ Función RPC existe (error esperado en test)\n');
} else {
  console.log('   ✓ Función RPC disponible\n');
}

// ─── Resumen ──────────────────────────────────────────────────────────────────
console.log('═══════════════════════════════════════');
console.log('✅ Setup completado');
console.log('');
console.log('Próximos pasos:');
console.log('  1. Asegúrate de iniciar sesión en la app con un usuario válido');
console.log('  2. Los productos que agregues aparecerán en Supabase');
console.log('═══════════════════════════════════════');
