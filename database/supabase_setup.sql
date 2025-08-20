-- 🗄️ SCRIPT SQL PARA SUPABASE (Arquitectura actualizada)
-- Copia y pega esto en el SQL Editor de Supabase
--
-- Cambios clave:
-- 1) Unicidad por tienda en productos: UNIQUE(tenant_id, code)
-- 2) Campo tenant_specific_status para habilitar/deshabilitar producto por tienda
-- 3) Sección RLS dejada como OPCIONAL (comentada) para no bloquear ambientes de prueba

-- 1. Tabla de tenants (tiendas)
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  
  -- Configuraciones como JSONB para flexibilidad
  branding JSONB DEFAULT '{
    "logo": "",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a", 
    "accentColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  }'::jsonb,
  
  business JSONB DEFAULT '{
    "name": "Mi Tienda",
    "industry": "general",
    "description": "Tienda en línea",
    "currency": "USD",
    "language": "es",
    "timezone": "America/Santiago",
    "contactInfo": {
      "phone": "",
      "email": "",
      "address": "",
      "city": "",
      "region": ""
    }
  }'::jsonb,
  
  features JSONB DEFAULT '{
    "enableWishlist": true,
    "enableFilters": true,
    "enableMultiCurrency": false,
    "enableReviews": false,
    "enableInventoryTracking": true,
    "enableDiscountCodes": false,
    "enableGuestCheckout": true,
    "enableSocialLogin": false
  }'::jsonb,
  
  payment JSONB DEFAULT '{
    "methods": ["mercadopago"],
    "currencies": ["USD"],
    "taxRate": 0.19,
    "shippingCost": 0,
    "freeShippingThreshold": 50
  }'::jsonb,
  
  product JSONB DEFAULT '{
    "customFields": [],
    "categories": ["General"],
    "conditions": ["Nuevo", "Usado"],
    "brands": [],
    "defaultImagePlaceholder": "/placeholder.jpg"
  }'::jsonb,
  
  layout JSONB DEFAULT '{
    "headerStyle": "standard",
    "footerStyle": "standard", 
    "productGridLayout": "grid",
    "productsPerPage": 12,
    "showProductCode": true,
    "showStock": true,
    "showDiscount": true
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  condition TEXT DEFAULT 'Nuevo',
  original_price DECIMAL(12,2),
  price DECIMAL(12,2) NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  urgency TEXT,
  cta_text TEXT DEFAULT 'Comprar Ahora',
  discount TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  -- Estado específico por tienda (control granular por tenant)
  tenant_specific_status TEXT DEFAULT 'active' CHECK (tenant_specific_status IN ('active','inactive','out_of_stock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para búsqueda rápida
  UNIQUE(tenant_id, code)
);

-- 3. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Triggers para updated_at
CREATE TRIGGER update_tenants_updated_at 
  BEFORE UPDATE ON tenants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Políticas de seguridad (RLS) - OPCIONAL (dejado comentado para pruebas)
-- Habilita estas líneas cuando quieras aplicar seguridad por filas.
-- ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
--
-- -- Lectura de tenants para usuarios autenticados
-- CREATE POLICY tenants_auth_read ON tenants
--   FOR SELECT USING (auth.uid() IS NOT NULL);
--
-- -- Gestión solo de los tenants propios
-- CREATE POLICY tenants_manage_own ON tenants
--   FOR ALL USING (owner_id = auth.uid());
--
-- -- Lectura de productos para usuarios autenticados
-- CREATE POLICY products_auth_read ON products
--   FOR SELECT USING (auth.uid() IS NOT NULL);
--
-- -- Gestión de productos solo de los tenants del usuario
-- CREATE POLICY products_manage_tenant ON products
--   FOR ALL USING (
--     tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
--   );

-- 6. Insertar tu tenant inicial (CAMBIA LOS VALORES)
INSERT INTO tenants (
  slug,
  owner_id,
  business,
  branding,
  product
) VALUES (
  'mi-taller', -- 🔧 CAMBIA ESTO por el slug de tu taller
  auth.uid(), -- Esto tomará tu user ID cuando ejecutes desde Supabase autenticado
  '{
    "name": "Herramientas Mi Taller",
    "industry": "carpinteria", 
    "description": "Herramientas profesionales de carpintería y construcción",
    "currency": "CLP",
    "language": "es",
    "timezone": "America/Santiago",
    "contactInfo": {
      "phone": "+56 9 XXXX XXXX",
      "email": "contacto@mitaller.cl",
      "address": "Tu dirección",
      "city": "Tu ciudad",
      "region": "Tu región"
    }
  }',
  '{
    "logo": "/logo-taller.png",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#3b82f6", 
    "fontFamily": "Inter, sans-serif"
  }',
  '{
    "categories": ["Sierras", "Fresadoras", "Lijadoras", "Prensas", "Accesorios"],
    "conditions": ["Nuevo", "Usado - Excelente", "Usado - Buen Estado"],
    "brands": ["Makita", "Bosch", "DeWalt", "Milwaukee"],
    "customFields": [],
    "defaultImagePlaceholder": "/placeholder-tool.jpg"
  }'
);

-- 7. Índices para performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_owner ON tenants(owner_id);
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_active ON products(tenant_id, is_active);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('spanish', name || ' ' || description));
