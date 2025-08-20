-- 🔑 VERIFICAR Y CORREGIR USUARIO SUPER ADMIN
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Verificar usuarios existentes y sus roles
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at,
  CASE 
    WHEN raw_user_meta_data->>'role' = 'super_admin' THEN '✅ Super Admin'
    WHEN raw_user_meta_data->>'role' = 'tenant_owner' THEN '🏪 Tenant Owner'
    WHEN raw_user_meta_data->>'role' = 'admin' THEN '👨‍💼 Admin'
    ELSE '❌ Sin rol definido'
  END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Buscar tu email específico
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data as metadata_completo
FROM auth.users 
WHERE email = 'alfredojrd86@gmail.com';

-- 3. Si no existe el usuario, crearlo (descomenta y ejecuta solo si es necesario)
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
-- VALUES (
--   'alfredojrd86@gmail.com',
--   crypt('tu_password_aqui', gen_salt('bf')),
--   NOW(),
--   '{"role": "super_admin"}'::jsonb
-- );

-- 4. Actualizar rol del usuario existente (ejecuta solo si el rol está mal)
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'alfredojrd86@gmail.com';

-- 5. Verificar que se actualizó correctamente
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  updated_at
FROM auth.users 
WHERE email = 'alfredojrd86@gmail.com';

-- 6. Crear tenant de prueba si no existe
INSERT INTO tenants (
  id,
  slug,
  owner_id,
  status,
  plan,
  business,
  branding,
  features,
  payment,
  product,
  layout
) VALUES (
  '7eac9d78-ebe1-4a6e-82b6-001d34badc25',
  'carpinteria',
  (SELECT id FROM auth.users WHERE email = 'alfredojrd86@gmail.com'),
  'active',
  'professional',
  '{
    "name": "Herramientas Profesionales Premium",
    "industry": "carpinteria",
    "description": "Herramientas de carpintería y construcción de primera calidad",
    "currency": "CLP",
    "language": "es",
    "timezone": "America/Santiago",
    "contactInfo": {
      "phone": "+56 9 1234 5678",
      "email": "ventas@herramientas-pro.cl",
      "address": "Av. Principal 123",
      "city": "Santiago",
      "region": "Región Metropolitana"
    }
  }'::jsonb,
  '{
    "logo": "/logo-carpinteria.png",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  }'::jsonb,
  '{
    "enableWishlist": true,
    "enableFilters": true,
    "enableMultiCurrency": false,
    "enableReviews": true,
    "enableInventoryTracking": true,
    "enableDiscountCodes": true,
    "enableGuestCheckout": true,
    "enableSocialLogin": false
  }'::jsonb,
  '{
    "methods": ["mercadopago", "bank_transfer"],
    "currencies": ["CLP"],
    "taxRate": 0.19,
    "shippingCost": 8000,
    "freeShippingThreshold": 50000
  }'::jsonb,
  '{
    "categories": ["Sierras", "Fresadoras", "Lijadoras", "Prensas", "Accesorios"],
    "conditions": ["Nuevo", "Usado - Excelente", "Usado - Buen Estado"],
    "brands": ["Makita", "Bosch", "DeWalt", "Festool"],
    "customFields": [],
    "defaultImagePlaceholder": "/placeholder-tool.jpg"
  }'::jsonb,
  '{
    "headerStyle": "hero",
    "footerStyle": "extended",
    "productGridLayout": "grid",
    "productsPerPage": 12,
    "showProductCode": true,
    "showStock": true,
    "showDiscount": true
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 7. Verificar tenant creado
SELECT 
  id,
  slug,
  business->>'name' as nombre_negocio,
  owner_id,
  status,
  plan
FROM tenants 
WHERE slug = 'carpinteria';

-- 8. Verificar que los productos estén asociados al tenant correcto
UPDATE products 
SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
WHERE tenant_id IS NULL OR tenant_id != '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- 9. Verificar productos del tenant
SELECT 
  tenant_id,
  COUNT(*) as total_productos,
  STRING_AGG(name, ', ') as nombres_productos
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
GROUP BY tenant_id;
