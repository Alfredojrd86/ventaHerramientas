-- 🚀 Actualizar rol del Super Admin
-- Usuario: alfredojrd86@gmail.com
-- ID: 3ae8a743-9b38-4a05-b471-b98f24f11781

-- 1. Ver estado actual del super admin
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'role' as current_role
FROM auth.users 
WHERE email = 'alfredojrd86@gmail.com';

-- 2. Actualizar el rol del super admin
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'alfredojrd86@gmail.com';

-- 3. Verificar que el cambio se aplicó correctamente
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'role' as new_role
FROM auth.users 
WHERE email = 'alfredojrd86@gmail.com';

-- 4. Verificar ambos usuarios (opcional)
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN raw_user_meta_data->>'role' = 'super_admin' THEN 'Super Admin'
    WHEN raw_user_meta_data->>'role' = 'tenant_owner' THEN 'Admin (Tenant Owner)'
    WHEN raw_user_meta_data->>'role' = 'admin' THEN 'Administrador'
    ELSE 'Sin rol asignado'
  END as display_role
FROM auth.users 
WHERE email IN ('alfredojrd86@gmail.com', 'tompyviruta@gmail.com')
ORDER BY 
  CASE 
    WHEN raw_user_meta_data->>'role' = 'super_admin' THEN 1
    WHEN raw_user_meta_data->>'role' = 'tenant_owner' THEN 2
    ELSE 3
  END;

-- 🔑 ACTUALIZAR POLÍTICAS RLS PARA SUPER ADMIN
-- Ejecuta este script en el SQL Editor de Supabase para permitir que los super_admin
-- vean y gestionen todos los tenants del sistema

-- 1. Eliminar políticas existentes de tenants
DROP POLICY IF EXISTS "Users can view their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can update their own tenants" ON tenants;
DROP POLICY IF EXISTS "Users can insert their own tenants" ON tenants;

-- 2. Crear nuevas políticas que permitan acceso completo a super_admin
CREATE POLICY "Super admin can manage all tenants" ON tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- 3. Política para tenant owners (mantener acceso a sus propios tenants)
CREATE POLICY "Tenant owners can manage their own tenants" ON tenants
  FOR ALL USING (
    owner_id = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- 4. Actualizar políticas de productos para super_admin
DROP POLICY IF EXISTS "Users can view products of their tenants" ON products;
DROP POLICY IF EXISTS "Users can manage products of their tenants" ON products;

-- 5. Política para super_admin (acceso total a productos)
CREATE POLICY "Super admin can manage all products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- 6. Política para tenant owners (acceso solo a sus productos)
CREATE POLICY "Tenant owners can manage their own products" ON products
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
