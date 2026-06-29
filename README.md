# Bodega Angelito

Sistema de gestión para bodega con monorepo Turborepo.

## Estructura

| Paquete / App | Descripción |
|---------------|-------------|
| `apps/web-admin` | Panel de control — dashboard, productos, pedidos |
| `apps/web-client` | Tienda online (en desarrollo) |
| `apps/worker-app` | App para empleados (en desarrollo) |
| `packages/services` | Repositorios y lógica de acceso a datos |
| `packages/db` | Cliente Supabase + tipos + migraciones SQL |
| `packages/shared` | Schemas Zod, tipos y utilidades |
| `packages/ui` | Componentes UI compartidos (`@bodega-angelito/ui`) |

## Configuración

### 1. Dependencias

```sh
npm install
```

### 2. Variables de entorno

```sh
cp apps/web-admin/.env.example apps/web-admin/.env.local
```

Completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 3. Migraciones SQL (en orden)

En el SQL Editor de Supabase:

1. `packages/db/supabase/migrations/20260629000000_init.sql`
2. `packages/db/supabase/migrations/20260629000001_seed.sql`
3. `packages/db/supabase/migrations/20260629000002_rpc_auth.sql`

### 4. Crear usuario administrador

1. En Supabase → **Authentication → Users → Add user** (email + contraseña).
2. Copia el **UUID** del usuario creado.
3. En SQL Editor ejecuta:

```sql
UPDATE workers
SET auth_user_id = 'UUID-DEL-USUARIO-AUTH'
WHERE id = '44444444-4444-4444-4444-444444444401';
```

### 5. Desarrollo

```sh
npm run dev -- --filter=web-admin
```

Abre `http://localhost:3000` → redirige a `/login`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build |
| `npm run check-types` | TypeScript |
| `npm run lint` | ESLint |

## Arquitectura

- **Lecturas:** cliente Supabase con sesión (RLS)
- **Escrituras:** RPC `create_product_with_stock` con verificación de rol
- **Auth:** Supabase Auth + tabla `workers`
- **Estado servidor:** React Query en el cliente
