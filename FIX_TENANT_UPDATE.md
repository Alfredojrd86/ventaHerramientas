# 🔧 **Fix: Error de Multiple Assignments**

## ❌ **Error que obtuviste:**
```
ERROR: 42601: multiple assignments to same column "business"
```

## 🎯 **Causa:**
Intentaste actualizar la columna `business` dos veces en la misma query UPDATE.

---

## ✅ **Solución Corregida**

### **Opción A: UPDATE con JSONB combinado (Recomendado)**
```sql
UPDATE tenants 
SET 
  owner_id = '00396f95-9893-4d0f-80ce-fda33c04bace',
  business = business 
    || '{"contactInfo": {"phone": "+56 9 1234 5678", "email": "tompyviruta@gmail.com", "address": "Av. Principal 123", "city": "Santiago", "region": "Región Metropolitana", "whatsapp": "+56 9 1234 5678"}}'::jsonb
    || '{"name": "Herramientas Tompy Premium"}'::jsonb,
  updated_at = NOW()
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

### **Opción B: UPDATE paso a paso (Más fácil de entender)**
```sql
-- Paso 1: Actualizar owner_id
UPDATE tenants 
SET owner_id = '00396f95-9893-4d0f-80ce-fda33c04bace'
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Paso 2: Actualizar nombre del negocio
UPDATE tenants 
SET business = jsonb_set(business, '{name}', '"Herramientas Tompy Premium"')
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Paso 3: Actualizar email de contacto
UPDATE tenants 
SET business = jsonb_set(business, '{contactInfo,email}', '"tompyviruta@gmail.com"')
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Paso 4: Actualizar timestamp
UPDATE tenants 
SET updated_at = NOW()
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

### **Opción C: UPDATE completo del business (Más directo)**
```sql
UPDATE tenants 
SET 
  owner_id = '00396f95-9893-4d0f-80ce-fda33c04bace',
  business = '{
    "name": "Herramientas Tompy Premium",
    "industry": "carpinteria",
    "description": "Herramientas de carpintería y construcción de primera calidad",
    "currency": "CLP",
    "language": "es",
    "timezone": "America/Santiago",
    "contactInfo": {
      "phone": "+56 9 1234 5678",
      "email": "tompyviruta@gmail.com",
      "address": "Av. Principal 123",
      "city": "Santiago",
      "region": "Región Metropolitana",
      "whatsapp": "+56 9 1234 5678"
    }
  }'::jsonb,
  updated_at = NOW()
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

## 🎯 **Mi Recomendación: Usa la Opción B**

Es más fácil de entender y menos propensa a errores. Ejecuta estos comandos **uno por uno**:

```sql
-- 1. Verificar que el tenant existe
SELECT id, slug, business->>'name' as nombre_actual 
FROM tenants 
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- 2. Actualizar owner_id
UPDATE tenants 
SET owner_id = '00396f95-9893-4d0f-80ce-fda33c04bace'
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- 3. Actualizar nombre del negocio
UPDATE tenants 
SET business = jsonb_set(business, '{name}', '"Herramientas Tompy Premium"')
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- 4. Actualizar email de contacto
UPDATE tenants 
SET business = jsonb_set(business, '{contactInfo,email}', '"tompyviruta@gmail.com"')
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- 5. Verificar que se actualizó correctamente
SELECT 
  id,
  slug,
  owner_id,
  business->>'name' as nombre,
  business->'contactInfo'->>'email' as email
FROM tenants 
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

**Resultado esperado:**
```
id: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
slug: carpinteria
owner_id: 00396f95-9893-4d0f-80ce-fda33c04bace
nombre: Herramientas Tompy Premium
email: tompyviruta@gmail.com
```

---

## 📋 **Siguiente Paso: Verificar Productos**

Una vez que el tenant esté actualizado, ejecuta:

```sql
-- Verificar productos actuales
SELECT tenant_id, COUNT(*) FROM products GROUP BY tenant_id;

-- Si no hay productos con tu tenant_id, asociarlos:
UPDATE products 
SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
WHERE tenant_id IS NULL OR tenant_id != '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Verificar que se asociaron
SELECT COUNT(*) as productos_tompy
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

## ✅ **Verificación Final**

```sql
-- Query completa de verificación
SELECT 
  t.id as tenant_id,
  t.slug,
  t.business->>'name' as nombre_negocio,
  u.email as owner_email,
  u.raw_user_meta_data->>'role' as role,
  COUNT(p.id) as total_productos
FROM tenants t
LEFT JOIN auth.users u ON t.owner_id = u.id
LEFT JOIN products p ON t.id = p.tenant_id
WHERE t.id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
GROUP BY t.id, t.slug, t.business, u.email, u.raw_user_meta_data;
```

¿Quieres que empecemos con la **Opción B** paso a paso? 🚀
