-- 🔧 CORREGIR POLÍTICAS RLS - SOLUCIÓN COMPLETA
-- Ejecuta este script en el SQL Editor de Supabase para resolver problemas de permisos

-- 1. Verificar estado actual de las políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('tenants', 'products')
ORDER BY tablename, policyname;

-- 2. Eliminar TODAS las políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can update their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can insert their own tenants" ON tenants;
DROP POLICY IF EXISTS "Super admin can manage all tenants" ON tenants;
DROP POLICY IF EXISTS "Tenant owners can manage their own tenants" ON tenants;

DROP POLICY IF EXISTS "Users can view products of their tenants" ON products;
DROP POLICY IF EXISTS "Users can manage products of their tenants" ON products;
DROP POLICY IF EXISTS "Super admin can manage all products" ON products;
DROP POLICY IF EXISTS "Tenant owners can manage their own products" ON products;

-- 3. Crear políticas CORRECTAS para tenants
-- Política para super_admin (acceso total)
CREATE POLICY "super_admin_tenants_all" ON tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- Política para tenant_owner (solo sus propios tenants)
CREATE POLICY "tenant_owner_tenants_own" ON tenants
  FOR ALL USING (
    owner_id = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- 4. Crear políticas CORRECTAS para productos
-- Política para super_admin (acceso total)
CREATE POLICY "super_admin_products_all" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- Política para tenant_owner (solo productos de sus tenants)
CREATE POLICY "tenant_owner_products_own" ON products
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    ) AND
    NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- 5. Política para acceso público a productos (tienda pública)
CREATE POLICY "public_products_view" ON products
  FOR SELECT USING (
    is_active = true
  );

-- 6. Política para acceso público a tenants (configuración pública)
CREATE POLICY "public_tenants_view" ON tenants
  FOR SELECT USING (
    status = 'active'
  );

-- 7. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('tenants', 'products')
ORDER BY tablename, policyname;

-- 8. Verificar usuarios y sus roles
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
WHERE raw_user_meta_data->>'role' IS NOT NULL
ORDER BY created_at DESC;

-- 9. Verificar tenants existentes
SELECT 
  id,
  slug,
  business->>'name' as nombre_negocio,
  owner_id,
  created_at
FROM tenants
ORDER BY created_at DESC;

-- 10. Verificar productos existentes
SELECT 
  tenant_id,
  COUNT(*) as total_productos
FROM products 
GROUP BY tenant_id
ORDER BY total_productos DESC;

-- 11. Test de permisos para super_admin
-- (Ejecutar esto como super_admin autenticado)
SELECT 
  'Tenants accesibles' as test,
  COUNT(*) as total
FROM tenants
UNION ALL
SELECT 
  'Productos accesibles' as test,
  COUNT(*) as total
FROM products;
