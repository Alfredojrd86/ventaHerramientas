# 🔧 **Fix RLS: Solución Simple y Correcta**

## ❌ **Error que obtuviste:**
```
ERROR: 42601: syntax error at or near "\"
LINE 25: \d+ products
```

**Causa:** `\d+` es comando de psql, no SQL. En Supabase SQL Editor no funciona.

---

## ✅ **Solución Corregida**

### **Paso 1: Ver Políticas Actuales (SQL correcto)**
```sql
-- Ver políticas actuales de la tabla products
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'products';
```

### **Paso 2: Eliminar Políticas Restrictivas**
```sql
-- Eliminar políticas que bloquean acceso público
DROP POLICY IF EXISTS "Users can view products of their tenants" ON products;
DROP POLICY IF EXISTS "Users can manage products of their tenants" ON products;
DROP POLICY IF EXISTS "tenant_isolation" ON products;
DROP POLICY IF EXISTS "products_access_policy" ON products;
DROP POLICY IF EXISTS "public_read_active_products" ON products;
```

### **Paso 3: Crear Políticas Nuevas (Simples y Funcionales)**
```sql
-- Política 1: TODOS pueden VER productos activos (para tienda pública)
CREATE POLICY "public_can_read_active_products" ON products
  FOR SELECT 
  USING (is_active = true);

-- Política 2: Solo propietarios pueden GESTIONAR sus productos
CREATE POLICY "owners_can_manage_products" ON products
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'role') = 'super_admin'
  );
```

### **Paso 4: Verificar que se Crearon**
```sql
-- Ver las nuevas políticas
SELECT 
  policyname,
  cmd,
  permissive,
  qual
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;
```

**Deberías ver:**
```
policyname: owners_can_manage_products
cmd: ALL
permissive: PERMISSIVE

policyname: public_can_read_active_products  
cmd: SELECT
permissive: PERMISSIVE
```

---

## 🧪 **Paso 5: Probar la Solución**

### **A. Test desde SQL:**
```sql
-- Verificar productos activos del tenant
SELECT 
  id, 
  name, 
  price, 
  is_active,
  tenant_id
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
AND is_active = true
LIMIT 5;
```

### **B. Verificar estado de productos:**
```sql
-- Contar productos por estado
SELECT 
  tenant_id,
  is_active,
  COUNT(*) as total
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
GROUP BY tenant_id, is_active;
```

**Resultado esperado:**
```
tenant_id: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
is_active: true
total: 12
```

### **C. Si los productos no están activos, activarlos:**
```sql
-- Activar todos los productos del tenant
UPDATE products 
SET is_active = true
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Verificar que se activaron
SELECT COUNT(*) as productos_activos
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
AND is_active = true;
```

---

## 🎯 **Paso 6: Probar en la Aplicación**

1. **Recargar la página:** `http://127.0.0.1:5173/`

2. **El panel de diagnóstico debería mostrar:**
   ```
   ✅ Supabase: success
   ✅ Tenant: success: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
   ✅ Conteo: success: 12 productos      ← CAMBIÓ
   ✅ Carga: success: 12 productos cargados  ← CAMBIÓ
   ```

3. **Deberías ver:**
   - ✅ Grid con 12 productos
   - ✅ Precios y nombres
   - ✅ Carrito funcionando

---

## 🚨 **Solución de Emergencia**

Si todavía no funciona, usa esto **temporalmente**:

```sql
-- TEMPORAL: Deshabilitar RLS completamente
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

Esto debería hacer que funcione inmediatamente. Luego puedes volver a habilitar RLS:

```sql
-- Volver a habilitar después de probar
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

---

## 📋 **Comandos en Orden**

**Ejecuta estos comandos UNO POR UNO en SQL Editor:**

```sql
-- 1. Ver políticas actuales
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';

-- 2. Limpiar políticas
DROP POLICY IF EXISTS "Users can view products of their tenants" ON products;
DROP POLICY IF EXISTS "Users can manage products of their tenants" ON products;

-- 3. Crear política pública de lectura
CREATE POLICY "public_can_read_active_products" ON products
  FOR SELECT USING (is_active = true);

-- 4. Crear política de gestión para propietarios
CREATE POLICY "owners_can_manage_products" ON products
  FOR ALL USING (
    tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid()) OR
    (auth.jwt() ->> 'role') = 'super_admin'
  );

-- 5. Activar productos del tenant
UPDATE products 
SET is_active = true
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- 6. Verificar resultado
SELECT COUNT(*) FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25' AND is_active = true;
```

**¿Empezamos con el comando 1?** 🚀
