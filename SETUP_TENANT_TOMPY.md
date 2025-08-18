# 🏪 **Setup Tenant: tompyviruta@gmail.com**

## 🎯 **Configuración Personalizada para tu Email**

### **📧 Email del Tenant:** `tompyviruta@gmail.com`
### **🔑 Password sugerido:** `tompy123` (o el que prefieras)
### **🏪 Tenant ID:** `7eac9d78-ebe1-4a6e-82b6-001d34badc25`

---

## 🔑 **Paso 1: Crear Usuario en Supabase**

1. **Ve a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Proyecto: `qjrsnanzhcyatdrqrgbz`

2. **Authentication → Users → Add user:**
   ```
   Email: tompyviruta@gmail.com
   Password: tompy123
   ✅ Confirm user: Marcado
   ```

3. **Configurar rol del usuario:**
   - Click en el usuario recién creado
   - En **Raw User Meta Data** pegar:
   ```json
   {
     "role": "tenant_owner"
   }
   ```
   - **Save**

---

## 🏪 **Paso 2: Crear Tenant en Base de Datos**

1. **Ve a SQL Editor en Supabase**

2. **Ejecuta PASO A PASO:**

### **A. Obtener UUID del usuario:**
```sql
SELECT id, email FROM auth.users WHERE email = 'tompyviruta@gmail.com';
```
**📝 Copia el UUID que aparece (algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)**

### **B. Crear el tenant (reemplaza el UUID):**
```sql
INSERT INTO tenants (
  id,
  slug,
  owner_id,  -- 🔧 AQUÍ va el UUID del paso anterior
  status,
  plan,
  branding,
  business,
  features,
  payment,
  product,
  layout
) VALUES (
  '7eac9d78-ebe1-4a6e-82b6-001d34badc25',
  'carpinteria',
  'PEGA-AQUI-EL-UUID-DE-TOMPYVIRUTA',  -- 🔧 REEMPLAZAR
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

### **C. Verificar que se creó correctamente:**
```sql
-- Ver el tenant creado
SELECT 
  id, 
  slug, 
  business->>'name' as nombre_negocio,
  business->>'email' as email_contacto
FROM tenants 
WHERE slug = 'carpinteria';

-- Ver productos del tenant
SELECT COUNT(*) as total_productos
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

## 🔗 **Paso 3: Verificar/Corregir Productos**

```sql
-- Verificar productos existentes
SELECT tenant_id, COUNT(*) FROM products GROUP BY tenant_id;

-- Si hay productos con tenant_id diferente, corregir:
UPDATE products 
SET tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25'
WHERE tenant_id != '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Verificar corrección
SELECT COUNT(*) as productos_tompy
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

---

## 🧪 **Paso 4: Probar Login como Tenant**

1. **Ve a la aplicación:**
   ```
   http://127.0.0.1:5173/login
   ```

2. **Haz login:**
   ```
   Email: tompyviruta@gmail.com
   Password: tompy123
   ```

3. **Verificar que funciona:**
   - ✅ Login exitoso
   - ✅ Ves dashboard de tenant (no super admin)
   - ✅ Panel de diagnóstico muestra tu tenant ID
   - ✅ Se muestran los 12 productos en la tienda

---

## 🎯 **Resultado Esperado**

### **Como Tenant (tompyviruta@gmail.com):**
```
🏪 Dashboard de "Herramientas Tompy Premium"
├── 🛠️ Mis Productos (12 productos)
│   ├── Sierra Circular Makita
│   ├── Fresadora Bosch
│   └── [Agregar Nuevo Producto]
├── 📊 Mis Ventas
│   └── (Estadísticas de tu tienda)
├── 🎨 Personalizar Tienda
│   └── (Colores, logo, información)
└── ⚙️ Configuración
    └── (Métodos de pago, envíos)
```

### **Panel de Diagnóstico:**
```
✅ Supabase: success
✅ Tenant: success: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
✅ Conteo: success: 12 productos
✅ Carga: success: 12 productos cargados
```

---

## 🚨 **Si algo falla:**

### **❌ Error: "User not found"**
- Verificar que creaste el usuario en Authentication
- Verificar que el email sea exactamente `tompyviruta@gmail.com`

### **❌ Error: "Invalid login credentials"**
- Verificar password
- Verificar que el usuario esté confirmado

### **❌ Error: "Tenant not found"**
- Ejecutar: `SELECT * FROM tenants WHERE slug = 'carpinteria';`
- Verificar que el `owner_id` sea el UUID correcto

### **❌ No se muestran productos**
- Ejecutar: `SELECT COUNT(*) FROM products WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';`
- Si es 0, ejecutar el UPDATE del Paso 3

---

## 🎉 **¡Listo para Probar!**

Una vez completado, tendrás:
- ✅ Cuenta tenant: `tompyviruta@gmail.com`
- ✅ Tienda: "Herramientas Tompy Premium" 
- ✅ 12 productos vinculados
- ✅ Dashboard funcional
- ✅ Sistema multi-tenant completo

**¿Empezamos con el Paso 1?** 🚀
