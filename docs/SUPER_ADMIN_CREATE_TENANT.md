# 👑 **Como Super Admin: Crear Tenant tompyviruta@gmail.com**

## 🎯 **Tu Perspectiva como Dueño del SaaS**

Como **super admin**, tú puedes crear tenants directamente sin restricciones. Aquí está el proceso completo:

---

## 🔍 **Paso 0: Verificar Estado Actual**

### **A. Verificar tablas existentes:**
```sql
-- Ver estructura de tenants
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tenants';

-- Ver tenants actuales
SELECT id, slug, business->>'name' as nombre, owner_id 
FROM tenants;

-- Ver productos actuales
SELECT tenant_id, COUNT(*) as total
FROM products 
GROUP BY tenant_id;
```

---

## 🔑 **Paso 1: Crear Usuario en Authentication**

### **Opción A: Desde Supabase Dashboard (Recomendado)**
1. Ve a https://supabase.com/dashboard
2. **Authentication** → **Users** → **Add user**
3. Completa:
   ```
   Email: tompyviruta@gmail.com
   Password: tompy123
   ✅ Confirm user
   ```
4. Una vez creado, click en el usuario
5. En **Raw User Meta Data**:
   ```json
   {
     "role": "tenant_owner",
     "name": "Tompy Viruta",
     "tenant_id": "7eac9d78-ebe1-4a6e-82b6-001d34badc25"
   }
   ```

### **Opción B: Desde SQL (Avanzado)**
```sql
-- Solo si necesitas crear programáticamente
-- Normalmente no se hace así, pero es posible
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated', 
  'tompyviruta@gmail.com',
  crypt('tompy123', gen_salt('bf')),
  NOW(),
  '{"role": "tenant_owner"}'::jsonb,
  NOW(),
  NOW()
);
```

---

## 🏪 **Paso 2: Crear/Actualizar Tenant**

### **A. Obtener UUID del usuario creado:**
```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'tompyviruta@gmail.com';
```
**📝 Copia el UUID (ej: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)**

### **B. Crear/Actualizar el tenant:**

**Si el tenant NO existe:**
```sql
INSERT INTO tenants (
  id,
  slug,
  owner_id,
  status,
  plan,
  branding,
  business,
  features,
  payment,
  product,
  layout,
  created_at,
  updated_at
) VALUES (
  '7eac9d78-ebe1-4a6e-82b6-001d34badc25', -- Tu tenant ID existente
  'carpinteria',
  'PEGA-AQUI-UUID-DE-TOMPYVIRUTA', -- 🔧 UUID del paso A
  'active',
  'professional',
  '{
    "logo": "/logo-carpinteria.png",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  }',
  '{
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
  }',
  '{
    "enableWishlist": true,
    "enableFilters": true,
    "enableMultiCurrency": false,
    "enableReviews": true,
    "enableInventoryTracking": true,
    "enableDiscountCodes": true,
    "enableGuestCheckout": true,
    "enableSocialLogin": false
  }',
  '{
    "methods": ["mercadopago", "bank_transfer"],
    "currencies": ["CLP"],
    "taxRate": 0.19,
    "shippingCost": 8000,
    "freeShippingThreshold": 50000
  }',
  '{
    "customFields": [
      {"id": "power", "name": "Potencia", "type": "text", "required": false},
      {"id": "warranty", "name": "Garantía", "type": "text", "required": false}
    ],
    "categories": ["Sierras", "Fresadoras", "Lijadoras", "Prensas", "Accesorios", "Discos y Fresas"],
    "conditions": ["Nuevo", "Usado - Excelente Estado", "Usado - Buen Estado", "Usado - Estado Regular"],
    "brands": ["Makita", "Bosch", "DeWalt", "Milwaukee", "Festool"],
    "defaultImagePlaceholder": "/placeholder-tool.jpg"
  }',
  '{
    "headerStyle": "hero",
    "footerStyle": "extended",
    "productGridLayout": "grid",
    "productsPerPage": 12,
    "showProductCode": true,
    "showStock": true,
    "showDiscount": true
  }',
  NOW(),
  NOW()
);
```

**Si el tenant YA existe (solo actualizar owner):**
```sql
UPDATE tenants 
SET 
  owner_id = 'PEGA-AQUI-UUID-DE-TOMPYVIRUTA', -- 🔧 UUID del paso A
  business = jsonb_set(business, '{contactInfo,email}', '"tompyviruta@gmail.com"'),
  business = jsonb_set(business, '{name}', '"Herramientas Tompy Premium"'),
  updated_at = NOW()
WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

## 🔗 **Paso 3: Asociar Productos al Tenant**

### **A. Verificar productos actuales:**
```sql
-- Ver distribución actual de productos
SELECT 
  tenant_id,
  COUNT(*) as total_productos,
  string_agg(name, ', ') as algunos_productos
FROM products 
GROUP BY tenant_id;
```

### **B. Asociar productos al tenant de Tompy:**
```sql
-- Opción 1: Si todos los productos son de Tompy
UPDATE products 
SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
WHERE tenant_id IS NULL OR tenant_id != '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Opción 2: Si quieres ser más específico
UPDATE products 
SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
WHERE id IN (
  -- Lista específica de IDs de productos que pertenecen a Tompy
  SELECT id FROM products LIMIT 12  -- Los primeros 12
);
```

### **C. Verificar la asociación:**
```sql
-- Contar productos de Tompy
SELECT COUNT(*) as productos_tompy
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Ver algunos productos de ejemplo
SELECT id, name, price, tenant_id
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
LIMIT 5;
```

---

## ✅ **Paso 4: Verificación Final**

### **A. Verificar todo esté conectado:**
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

**Resultado esperado:**
```
tenant_id: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
slug: carpinteria
nombre_negocio: Herramientas Tompy Premium
owner_email: tompyviruta@gmail.com
role: tenant_owner
total_productos: 12
```

---

## 🧪 **Paso 5: Probar el Login**

1. **Ve a tu aplicación:**
   ```
   http://127.0.0.1:5173/login
   ```

2. **Login como tenant:**
   ```
   Email: tompyviruta@gmail.com
   Password: tompy123
   ```

3. **Verificar funcionalidad:**
   - ✅ Login exitoso
   - ✅ Dashboard de tenant (no super admin)
   - ✅ Ver los 12 productos
   - ✅ Panel de diagnóstico verde

---

## 🎯 **Comandos de Diagnóstico Útiles**

### **Ver todos los usuarios:**
```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  email_confirmed_at IS NOT NULL as confirmed
FROM auth.users
ORDER BY created_at DESC;
```

### **Ver todos los tenants y sus owners:**
```sql
SELECT 
  t.slug,
  t.business->>'name' as negocio,
  u.email as owner,
  t.status,
  t.plan
FROM tenants t
LEFT JOIN auth.users u ON t.owner_id = u.id;
```

### **Ver productos por tenant:**
```sql
SELECT 
  t.business->>'name' as tienda,
  COUNT(p.id) as productos,
  SUM(p.price * p.stock) as valor_inventario
FROM tenants t
LEFT JOIN products p ON t.id = p.tenant_id
GROUP BY t.id, t.business;
```

---

## 🚨 **Troubleshooting**

### **❌ Error: "duplicate key value violates unique constraint"**
**Causa:** Ya existe un tenant con ese ID
**Solución:** Usar UPDATE en lugar de INSERT

### **❌ Error: "foreign key constraint"**
**Causa:** El owner_id no existe en auth.users
**Solución:** Verificar que creaste el usuario primero

### **❌ No se muestran productos**
**Causa:** Los productos no están asociados al tenant
**Solución:** Ejecutar UPDATE products SET tenant_id = '...'

---

## 🎉 **¡Listo!**

Como **super admin**, ahora tienes:
- ✅ Usuario tenant creado: `tompyviruta@gmail.com`
- ✅ Tenant asociado al ID existente
- ✅ Productos vinculados al tenant
- ✅ Sistema multi-tenant funcionando

**¿Empezamos con el Paso 1?** 🚀
