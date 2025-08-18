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
