-- =====================================================================
-- Datos iniciales para desarrollo — Bodega Angelito
-- UUIDs fijos para referencia en NEXT_PUBLIC_DEFAULT_STORE_ID
-- =====================================================================

-- Sucursal principal
INSERT INTO stores (id, name, address, phone)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Bodega Angelito - Sede Principal',
  'Av. Principal 123, Lima',
  '+51 999 000 001'
) ON CONFLICT (id) DO NOTHING;

-- Categorías
INSERT INTO categories (id, name, slug) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Bebidas', 'bebidas'),
  ('22222222-2222-2222-2222-222222222202', 'Lácteos', 'lacteos'),
  ('22222222-2222-2222-2222-222222222203', 'Abarrotes', 'abarrotes'),
  ('22222222-2222-2222-2222-222222222204', 'Panadería', 'panaderia'),
  ('22222222-2222-2222-2222-222222222205', 'Limpieza', 'limpieza')
ON CONFLICT (id) DO NOTHING;

-- Productos
INSERT INTO products (id, sku, name, brand, category_id, price, cost) VALUES
  ('33333333-3333-3333-3333-333333333301', 'BEB-COLA-001', 'Coca Cola 1.5L', 'Coca Cola', '22222222-2222-2222-2222-222222222201', 5.50, 3.80),
  ('33333333-3333-3333-3333-333333333302', 'LAC-LECH-002', 'Leche Gloria Evaporada', 'Gloria', '22222222-2222-2222-2222-222222222202', 3.20, 2.10),
  ('33333333-3333-3333-3333-333333333303', 'ABA-ARRO-003', 'Arroz Costeño 1kg', 'Costeño', '22222222-2222-2222-2222-222222222203', 4.80, 3.20),
  ('33333333-3333-3333-3333-333333333304', 'PAN-MOLD-004', 'Panetón D''Onofrio 900g', 'D''Onofrio', '22222222-2222-2222-2222-222222222204', 19.90, 14.00),
  ('33333333-3333-3333-3333-333333333305', 'LIM-LAVA-005', 'Sapolio Lejía 2L', 'Sapolio', '22222222-2222-2222-2222-222222222205', 8.90, 6.20),
  ('33333333-3333-3333-3333-333333333306', 'BEB-INKA-006', 'Inka Cola 3L', 'Inka Cola', '22222222-2222-2222-2222-222222222201', 9.20, 6.50)
ON CONFLICT (id) DO NOTHING;

-- Niveles de stock (sucursal principal)
INSERT INTO stock_levels (store_id, product_id, current_stock, minimum_stock, safety_stock) VALUES
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333301', 45, 10, 5),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333302', 4, 15, 5),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333303', 80, 20, 10),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333304', 0, 8, 3),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333305', 12, 5, 2),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333306', 8, 10, 4)
ON CONFLICT (store_id, product_id) DO NOTHING;

-- Movimientos iniciales de inventario (Kardex)
INSERT INTO inventory_movements (store_id, product_id, quantity, movement_type, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333301', 45, 'initial', 'Stock inicial seed'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333302', 4, 'initial', 'Stock inicial seed'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333303', 80, 'initial', 'Stock inicial seed'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333304', 0, 'initial', 'Stock inicial seed'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333305', 12, 'initial', 'Stock inicial seed'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333306', 8, 'initial', 'Stock inicial seed');
