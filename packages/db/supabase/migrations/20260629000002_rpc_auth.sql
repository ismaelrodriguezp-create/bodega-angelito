-- =====================================================================
-- RPC atómico + worker admin + políticas RLS mejoradas
-- =====================================================================

-- Sucursal principal (requerida por workers — idempotente si ya corriste el seed)
INSERT INTO stores (id, name, address, phone)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Bodega Angelito - Sede Principal',
  'Av. Principal 123, Lima',
  '+51 999 000 001'
) ON CONFLICT (id) DO NOTHING;

-- Worker admin inicial (vincular auth_user_id después del primer signup en Supabase Auth)
INSERT INTO workers (id, store_id, first_name, last_name, role, is_active)
VALUES (
  '44444444-4444-4444-4444-444444444401',
  '11111111-1111-1111-1111-111111111111',
  'Administrador',
  'Principal',
  'admin',
  true
) ON CONFLICT (id) DO NOTHING;

-- Políticas RLS: workers pueden leer su propio perfil
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Workers leen su propio perfil" ON workers;
CREATE POLICY "Workers leen su propio perfil" ON workers
  FOR SELECT USING (auth_user_id = auth.uid());

-- Mejorar políticas de productos (INSERT/UPDATE requieren WITH CHECK)
DROP POLICY IF EXISTS "Permitir gestión de productos a Admins y Managers" ON products;
CREATE POLICY "Admins y Managers gestionan productos" ON products
  FOR ALL
  USING (get_current_worker_role() IN ('admin', 'manager'))
  WITH CHECK (get_current_worker_role() IN ('admin', 'manager'));

-- Lectura de pedidos para empleados de la sucursal
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Empleados leen items de su sucursal" ON order_items;
CREATE POLICY "Empleados leen items de su sucursal" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.store_id = get_current_worker_store()
    )
  );

-- Lectura de categorías (público para catálogo)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lectura pública de categorías" ON categories;
CREATE POLICY "Lectura pública de categorías" ON categories
  FOR SELECT USING (true);

-- Lectura de movimientos de inventario para empleados
DROP POLICY IF EXISTS "Empleados leen movimientos de su sucursal" ON inventory_movements;
CREATE POLICY "Empleados leen movimientos de su sucursal" ON inventory_movements
  FOR SELECT USING (store_id = get_current_worker_store());

-- =====================================================================
-- RPC: crear producto + stock + kardex en una transacción
-- =====================================================================
CREATE OR REPLACE FUNCTION create_product_with_stock(
  p_store_id UUID,
  p_name TEXT,
  p_brand TEXT DEFAULT NULL,
  p_sku TEXT DEFAULT NULL,
  p_barcode TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_price NUMERIC DEFAULT 0,
  p_cost NUMERIC DEFAULT 0,
  p_initial_stock INTEGER DEFAULT 0,
  p_minimum_stock INTEGER DEFAULT 5,
  p_safety_stock INTEGER DEFAULT 2,
  p_location_in_store TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role worker_role;
  v_product_id UUID;
BEGIN
  v_role := get_current_worker_role();
  IF v_role IS NULL OR v_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'No autorizado: se requiere rol admin o manager';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM stores WHERE id = p_store_id AND is_active = true) THEN
    RAISE EXCEPTION 'Sucursal no válida';
  END IF;

  INSERT INTO products (name, brand, sku, barcode, description, category_id, price, cost, is_active)
  VALUES (p_name, p_brand, p_sku, p_barcode, p_description, p_category_id, p_price, p_cost, true)
  RETURNING id INTO v_product_id;

  INSERT INTO stock_levels (store_id, product_id, current_stock, minimum_stock, safety_stock, location_in_store)
  VALUES (p_store_id, v_product_id, p_initial_stock, p_minimum_stock, p_safety_stock, p_location_in_store);

  IF p_initial_stock > 0 THEN
    INSERT INTO inventory_movements (store_id, product_id, quantity, movement_type, notes)
    VALUES (p_store_id, v_product_id, p_initial_stock, 'initial', 'Stock inicial al registrar producto');
  END IF;

  RETURN v_product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION create_product_with_stock TO authenticated;
GRANT EXECUTE ON FUNCTION create_product_with_stock TO service_role;
