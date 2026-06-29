-- =====================================================================
-- 1. EXTENSIONES Y CONFIGURACIÓN INICIAL
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda difusa e indexación trigram

-- =====================================================================
-- 2. TIPOS ENUMERADOS (ENUMS)
-- =====================================================================
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE worker_role AS ENUM ('admin', 'manager', 'cashier', 'picker');
CREATE TYPE movement_type AS ENUM ('initial', 'purchase', 'sale', 'adjustment', 'transfer', 'waste');

-- =====================================================================
-- 3. TABLAS DEL SISTEMA
-- =====================================================================

-- Sucursales
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categorías de Productos
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Proveedores
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catálogo de Productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT UNIQUE, -- Código de barras EAN/UPC para escaneo directo
    sku TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    image_url TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Niveles de Stock por Sucursal (Multi-sucursal)
CREATE TABLE stock_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    minimum_stock INTEGER NOT NULL DEFAULT 5 CHECK (minimum_stock >= 0),
    safety_stock INTEGER NOT NULL DEFAULT 2 CHECK (safety_stock >= 0),
    location_in_store TEXT, -- Pasillo, estantería, etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_store_product UNIQUE (store_id, product_id)
);

-- Relación de Costos de Proveedor por Producto
CREATE TABLE product_suppliers (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    supply_price NUMERIC(10, 2) NOT NULL CHECK (supply_price >= 0),
    lead_time_days INTEGER DEFAULT 3,
    PRIMARY KEY (product_id, supplier_id)
);

-- Empleados / Trabajadores
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    auth_user_id UUID UNIQUE, -- Se asocia a auth.users(id) de Supabase
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role worker_role NOT NULL DEFAULT 'picker',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clientes
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Se asocia a auth.users(id) de Supabase
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Historial de Movimientos de Inventario (Kardex)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL, -- Positivo para entradas, negativo para salidas
    movement_type movement_type NOT NULL,
    reference_id UUID, -- ID de orden o compra que originó el movimiento
    notes TEXT,
    created_by UUID, -- ID del trabajador o usuario que realizó el ajuste
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pedidos (E-commerce / Ventas)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_gateway TEXT,
    gateway_reference TEXT,
    delivery_address TEXT,
    delivery_lat NUMERIC(9, 6),
    delivery_lng NUMERIC(9, 6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Detalle de Pedidos
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- Historial de Notificaciones Push
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 4. ÍNDICES DE RENDIMIENTO (Performance Tuning)
-- =====================================================================
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_stock_levels_store_product ON stock_levels(store_id, product_id);
CREATE INDEX idx_stock_levels_critical ON stock_levels(store_id) WHERE current_stock <= minimum_stock;
CREATE INDEX idx_orders_store_status ON orders(store_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_inventory_movements_query ON inventory_movements(store_id, product_id, created_at DESC);

-- Índice GIN para búsqueda full-text multilingüe/difusa en catálogo de productos
CREATE INDEX idx_products_search_trgm ON products USING gin (name gin_trgm_ops, description gin_trgm_ops);

-- =====================================================================
-- 5. TRIGGERS AUTOMÁTICOS
-- =====================================================================

-- Trigger de updated_at para mantener la marca de tiempo de modificación
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asignar trigger a todas las tablas con columna updated_at
CREATE TRIGGER set_timestamp_stores BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_suppliers BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_stock_levels BEFORE UPDATE ON stock_levels FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_workers BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger para decrementar stock automáticamente al confirmarse un pedido (status = 'preparing')
CREATE OR REPLACE FUNCTION process_order_stock_decrement()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    -- Se descuenta el stock cuando la orden pasa de 'pending' a 'preparing' (confirmada por el sistema/pago)
    IF (TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'preparing') OR
       (TG_OP = 'INSERT' AND NEW.status = 'preparing') THEN
        
        FOR item IN 
            SELECT product_id, quantity 
            FROM order_items 
            WHERE order_id = NEW.id
        LOOP
            -- 1. Actualizar el stock actual en stock_levels
            UPDATE stock_levels
            SET current_stock = current_stock - item.quantity
            WHERE store_id = NEW.store_id AND product_id = item.product_id;

            -- 2. Registrar el movimiento en el Kardex (inventory_movements)
            INSERT INTO inventory_movements (
                store_id,
                product_id,
                quantity,
                movement_type,
                reference_id,
                notes,
                created_by
            ) VALUES (
                NEW.store_id,
                item.product_id,
                -item.quantity,
                'sale',
                NEW.id,
                'Descuento automático por pedido #' || NEW.id,
                NEW.customer_id
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_order_stock_decrement
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION process_order_stock_decrement();

-- =====================================================================
-- 6. POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- =====================================================================

-- Habilitar RLS en tablas críticas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Funciones auxiliares para RLS
CREATE OR REPLACE FUNCTION get_current_worker_role()
RETURNS worker_role AS $$
  SELECT role FROM workers WHERE auth_user_id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_worker_store()
RETURNS UUID AS $$
  SELECT store_id FROM workers WHERE auth_user_id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS para Catálogo de Productos (Público para lectura, Escritura solo Administrador/Manager)
CREATE POLICY "Permitir lectura pública de productos" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Permitir gestión de productos a Admins y Managers" ON products
    FOR ALL USING (get_current_worker_role() IN ('admin', 'manager'));

-- RLS para Stock Levels (Público lee disponibilidad, solo empleados actualizan)
CREATE POLICY "Permitir lectura de stock" ON stock_levels
    FOR SELECT USING (true);

CREATE POLICY "Permitir actualización de stock a empleados" ON stock_levels
    FOR ALL USING (get_current_worker_role() IS NOT NULL);

-- RLS para Pedidos (Clientes leen/escriben los suyos propios, empleados leen de su sucursal)
CREATE POLICY "Clientes ven sus propios pedidos" ON orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND customer_id = (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
    );

CREATE POLICY "Empleados ven pedidos de su sucursal" ON orders
    FOR SELECT USING (
        get_current_worker_store() = store_id
    );

CREATE POLICY "Clientes crean sus pedidos" ON orders
    FOR INSERT WITH CHECK (
        (auth.uid() IS NOT NULL AND customer_id = (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
        OR customer_id IS NULL -- Permite checkout invitado
    );

CREATE POLICY "Empleados actualizan estado de pedidos" ON orders
    FOR UPDATE USING (
        get_current_worker_store() = store_id AND get_current_worker_role() IS NOT NULL
    );
