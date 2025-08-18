# 🔧 Actualizar Roles de Usuario en Supabase

## 🎯 Objetivo
- Cambiar tu rol a `super_admin` en Supabase
- Asegurar que `tenant_owner` se muestre como "Admin" en la interfaz

## 📋 Pasos para Actualizar Roles

### 1. 🔍 Encontrar tu Usuario
```sql
-- Ver todos los usuarios y sus roles actuales
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as current_role,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC;
```

### 2. 🚀 Actualizar tu Rol a Super Admin
```sql
-- Cambiar tu rol a super_admin (reemplaza 'tu-email@gmail.com' con tu email real)
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'tu-email@gmail.com';
```

### 3. ✅ Verificar el Cambio
```sql
-- Verificar que el cambio se aplicó correctamente
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'tu-email@gmail.com';
```

### 4. 🔄 Actualizar Usuario Tenant (si es necesario)
```sql
-- Si quieres cambiar el rol de tompyviruta@gmail.com a tenant_owner
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"tenant_owner"'
)
WHERE email = 'tompyviruta@gmail.com';
```

## 🎨 Traducciones de Roles en la Interfaz

### ✅ Cambios Implementados:
- `super_admin` → **"Super Admin"**
- `tenant_owner` → **"Admin"** 
- `admin` → **"Administrador"**

### 📱 Dónde se Muestra:
- En la esquina superior derecha del AdminDashboard
- Debajo del nombre del usuario
- Se actualiza automáticamente al hacer login

## 🔧 Cómo Ejecutar los SQL

### En Supabase Dashboard:
1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Pega el SQL correspondiente
5. Reemplaza `'tu-email@gmail.com'` con tu email real
6. Ejecuta la query

### Ejemplo Completo:
```sql
-- 1. Ver estado actual
SELECT email, raw_user_meta_data->>'role' as role FROM auth.users;

-- 2. Actualizar tu rol
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'tu-email-real@gmail.com';

-- 3. Verificar cambio
SELECT email, raw_user_meta_data->>'role' as role FROM auth.users;
```

## 🎯 Resultado Esperado

### Después de los Cambios:
- **Tu usuario**: Se mostrará como "Super Admin"
- **tompyviruta@gmail.com**: Se mostrará como "Admin"
- **Los roles se actualizan** automáticamente al hacer login

### 🔄 Para Aplicar los Cambios:
1. Ejecuta el SQL en Supabase
2. Cierra sesión en la aplicación
3. Vuelve a iniciar sesión
4. ✅ Verás el nuevo rol en la interfaz

## ⚠️ Importante:
- Reemplaza `'tu-email@gmail.com'` con tu email real
- Los cambios requieren cerrar y volver a abrir sesión
- El rol se lee desde `raw_user_meta_data.role`
