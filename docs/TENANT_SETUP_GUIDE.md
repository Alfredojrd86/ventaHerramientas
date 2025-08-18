# 🏪 **Guía: Cómo Convertirte en Tenant de tu Propio SaaS**

## 🎯 **Objetivo**
Crear tu cuenta como **tenant_owner** para probar el flujo completo desde la perspectiva de un cliente que paga por usar tu SaaS.

---

## 📋 **Paso a Paso**

### **🔑 Paso 1: Crear Usuario Tenant en Supabase**

1. **Ve a tu proyecto Supabase:**
   - URL: https://supabase.com/dashboard
   - Entra a tu proyecto: `qjrsnanzhcyatdrqrgbz`

2. **Crear el usuario:**
   - Ve a **Authentication** → **Users**
   - Click **Add user**
   - **Email:** `carpintero@demo.com` (o el que prefieras)
   - **Password:** `carpintero123`
   - **Confirm user:** ✅ Marcado
   - Click **Create user**

3. **Configurar rol del usuario:**
   - Una vez creado, click en el usuario
   - En **Raw User Meta Data** pega:
   ```json
   {
     "role": "tenant_owner"
   }
   ```
   - **Save**

---

### **🏪 Paso 2: Crear Registro del Tenant**

1. **Ve a SQL Editor en Supabase**

2. **Copia y ejecuta este SQL:**
```sql
-- 1. Obtener el UUID del usuario que acabas de crear
-- (Reemplaza 'carpintero@demo.com' por el email que usaste)
SELECT id, email FROM auth.users WHERE email = 'carpintero@demo.com';

-- 2. Crear el tenant (reemplaza 'UUID-DEL-USUARIO' por el ID del paso anterior)
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
  layout
) VALUES (
  '7eac9d78-ebe1-4a6e-82b6-001d34badc25', -- El tenant ID que ya usas
  'carpinteria',
  'UUID-DEL-USUARIO', -- 🔧 REEMPLAZA por el UUID del usuario
  'active',
  'professional',
  '{
    "logo": "/logo-carpinteria.png",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  }'::jsonb,
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
      "region": "Región Metropolitana",
      "whatsapp": "+56 9 1234 5678"
    }
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
    "customFields": [
      {
        "id": "power",
        "name": "Potencia",
        "type": "text",
        "required": false
      },
      {
        "id": "warranty",
        "name": "Garantía",
        "type": "text",
        "required": false
      }
    ],
    "categories": ["Sierras", "Fresadoras", "Lijadoras", "Prensas", "Accesorios", "Discos y Fresas"],
    "conditions": ["Nuevo", "Usado - Excelente Estado", "Usado - Buen Estado", "Usado - Estado Regular"],
    "brands": ["Makita", "Bosch", "DeWalt", "Milwaukee", "Festool"],
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
);
```

3. **Verificar que se creó:**
```sql
-- Verificar el tenant
SELECT * FROM tenants WHERE slug = 'carpinteria';

-- Verificar productos del tenant
SELECT COUNT(*) FROM products WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

### **🔗 Paso 3: Verificar Productos**

Los productos ya deberían estar vinculados al tenant ID `7eac9d78-ebe1-4a6e-82b6-001d34badc25`. Si no:

```sql
-- Verificar productos existentes
SELECT tenant_id, COUNT(*) FROM products GROUP BY tenant_id;

-- Si hay productos con tenant_id diferente, actualizarlos:
UPDATE products 
SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
WHERE tenant_id != '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

### **🧪 Paso 4: Probar el Login**

1. **Ve a tu aplicación:**
   ```
   http://127.0.0.1:5173/login
   ```

2. **Haz login como tenant:**
   - **Email:** `carpintero@demo.com`
   - **Password:** `carpintero123`

3. **Deberías ver:**
   - Dashboard del tenant (no super admin)
   - Solo los productos de TU tenant
   - Opciones para gestionar TU tienda

---

## 🎯 **Verificación del Éxito**

### **✅ Señales de que funciona:**

1. **En el panel de diagnóstico:**
   ```
   ✅ Supabase: success
   ✅ Tenant: success: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
   ✅ Conteo: success: 12 productos
   ✅ Carga: success: 12 productos cargados
   ```

2. **En la página principal:**
   - Se muestran los 12 productos
   - El carrito funciona
   - Los filtros funcionan

3. **En el dashboard admin:**
   - Puedes gestionar productos
   - Ves estadísticas de TU tienda
   - Puedes personalizar la configuración

---

## 🔄 **Flujos que puedes probar:**

### **Como Tenant Owner:**
```
1. Login → carpintero@demo.com
2. Dashboard → Gestionar productos
3. Agregar nuevo producto
4. Personalizar tienda
5. Ver estadísticas de ventas
```

### **Como Super Admin:**
```
1. Login → tu-email-personal@gmail.com
2. Super Dashboard → Ver TODOS los tenants
3. Estadísticas globales
4. "Entrar" a cualquier tienda
```

### **Como Cliente Final:**
```
1. Ir a tienda pública → http://127.0.0.1:5173/
2. Navegar productos
3. Agregar al carrito
4. Checkout (sin login)
```

---

## 🚨 **Posibles Problemas y Soluciones**

### **❌ "No se encuentran productos"**
**Solución:**
```sql
-- Verificar tenant_id de productos
SELECT tenant_id, COUNT(*) FROM products GROUP BY tenant_id;

-- Corregir si es necesario
UPDATE products SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

### **❌ "Error de autenticación"**
**Solución:**
- Verificar que el usuario esté confirmado en Supabase
- Verificar que el role sea `tenant_owner`

### **❌ "Tenant no encontrado"**
**Solución:**
```sql
-- Verificar que existe el tenant
SELECT * FROM tenants WHERE id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

## 🎉 **¡Listo!**

Ahora tienes:
- ✅ Cuenta de Super Admin (tú)
- ✅ Cuenta de Tenant Owner (cliente)
- ✅ Productos vinculados al tenant
- ✅ Sistema multi-tenant funcionando

¿Quieres que te ayude con algún paso específico? 🚀
