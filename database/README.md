# 🗄️ Database Scripts - VentaCarpinteria

**Scripts SQL para configuración y mantenimiento de la base de datos**

---

## 📋 ARCHIVOS SQL DISPONIBLES

### **🏗️ Setup Inicial**

#### `supabase_setup.sql`
```sql
-- Configuración inicial completa de Supabase
-- Incluye: tablas, RLS policies, triggers, funciones
```

**Propósito:** Script principal de configuración de la base de datos  
**Cuándo usar:** Primera configuración del proyecto  
**Incluye:**
- Creación de tablas (`tenants`, `products`)
- Políticas RLS (Row Level Security)
- Triggers y funciones
- Índices y constraints

**Cómo ejecutar:**
1. Ve a Supabase Dashboard → SQL Editor
2. Copia y pega el contenido completo
3. Ejecuta el script

---

### **👥 Gestión de Usuarios**

#### `UPDATE_SUPER_ADMIN_ROLE.sql`
```sql
-- Actualizar roles de usuarios específicos
-- Convierte usuarios a super_admin o tenant_owner
```

**Propósito:** Actualizar roles en `raw_user_meta_data`  
**Cuándo usar:** Cuando necesites cambiar roles de usuarios existentes  
**Usuarios objetivo:**
- `alfredojrd86@gmail.com` → `super_admin`
- `tompyviruta@gmail.com` → `tenant_owner`

**Cómo ejecutar:**
1. Reemplaza emails con los reales
2. Ejecuta en Supabase SQL Editor
3. Verifica cambios con SELECT

---

### **📦 Datos de Ejemplo**

#### `sample_products.sql`
```sql
-- Productos de muestra para testing
-- 12 herramientas con datos reales
```

**Propósito:** Cargar productos de ejemplo para desarrollo y testing  
**Cuándo usar:** Después del setup inicial para tener datos de prueba  
**Incluye:**
- 12 productos de herramientas
- Imágenes, precios, descripciones
- Asociados al tenant "carpinteria"

**Cómo ejecutar:**
1. Asegúrate de que las tablas estén creadas
2. Verifica que el tenant existe
3. Ejecuta el script completo

---

## 🔄 ORDEN DE EJECUCIÓN RECOMENDADO

### **🏗️ Primera Configuración (Proyecto Nuevo)**
```sql
1. supabase_setup.sql          -- Crear estructura de BD
2. sample_products.sql         -- Cargar datos de ejemplo
3. UPDATE_SUPER_ADMIN_ROLE.sql -- Configurar roles de usuario
```

### **🔧 Configuración Existente**
```sql
-- Si ya tienes la BD configurada, solo ejecuta:
UPDATE_SUPER_ADMIN_ROLE.sql   -- Para actualizar roles
```

---

## 📊 ESTRUCTURA DE BASE DE DATOS

### **Tablas Principales**
```
auth.users          -- Usuarios con autenticación
├── raw_user_meta_data: { "role": "super_admin|tenant_owner|admin" }

tenants             -- Configuración multi-tenant
├── id (uuid, PK)
├── slug (string, unique)
├── owner_id (uuid, FK → auth.users.id)
├── business (jsonb) -- Info del negocio
├── branding (jsonb) -- Colores, logo
└── features (jsonb) -- Funcionalidades habilitadas

products            -- Productos por tenant
├── id (uuid, PK)
├── tenant_id (uuid, FK → tenants.id)
├── code (string)
├── name (string)
├── price (numeric)
├── description (text)
├── image_url (string)
├── stock (integer)
├── is_active (boolean)
└── created_at, updated_at
```

### **Políticas RLS**
```sql
-- Productos: Lectura pública, escritura por owners
public_can_read_active_products
owners_can_manage_products

-- Tenants: Solo owners y super_admin
-- (Pendiente implementar)
```

---

## 🔑 USUARIOS Y ROLES

### **Roles Disponibles**
```
super_admin    -- Acceso total, gestiona todos los tenants
tenant_owner   -- Gestiona solo su tenant
admin          -- Funciones administrativas específicas
```

### **Usuarios Configurados**
```
alfredojrd86@gmail.com   → super_admin
tompyviruta@gmail.com    → tenant_owner
```

### **Tenant Activo**
```
ID: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
Slug: carpinteria
Owner: tompyviruta@gmail.com
Productos: 12 herramientas
```

---

## 🛠️ COMANDOS ÚTILES

### **Verificar Configuración**
```sql
-- Ver usuarios y roles
SELECT 
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users;

-- Ver tenants
SELECT id, slug, business->>'name' as name FROM tenants;

-- Ver productos por tenant
SELECT 
  name, 
  price, 
  is_active 
FROM products 
WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
```

### **Limpiar Datos de Prueba**
```sql
-- Eliminar productos de ejemplo
DELETE FROM products WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Resetear secuencias (si usas SERIAL)
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;
```

### **Backup de Datos**
```sql
-- Exportar productos
COPY (SELECT * FROM products) TO '/tmp/products_backup.csv' WITH CSV HEADER;

-- Exportar tenants
COPY (SELECT * FROM tenants) TO '/tmp/tenants_backup.csv' WITH CSV HEADER;
```

---

## 🚨 TROUBLESHOOTING

### **Error: Tabla no existe**
```sql
-- Verificar que las tablas estén creadas
\dt

-- Si no están, ejecutar supabase_setup.sql
```

### **Error: RLS Policy**
```sql
-- Ver políticas existentes
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';

-- Eliminar políticas conflictivas si es necesario
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### **Error: Usuario sin rol**
```sql
-- Verificar rol del usuario
SELECT raw_user_meta_data FROM auth.users WHERE email = 'tu-email@gmail.com';

-- Si está vacío, ejecutar UPDATE_SUPER_ADMIN_ROLE.sql
```

---

## 📝 MANTENIMIENTO

### **Actualizar Scripts**
- Siempre hacer backup antes de cambios importantes
- Probar scripts en entorno de desarrollo primero
- Documentar cambios en este README

### **Versionado**
- `v1.0` - Setup inicial con tenants y products
- `v1.1` - Roles de usuario implementados
- `v1.2` - Productos de ejemplo agregados

### **Próximas Mejoras**
- [ ] Tabla `orders` para sistema de pedidos
- [ ] Tabla `order_items` para items de pedidos
- [ ] Políticas RLS para todas las tablas
- [ ] Triggers para auditoría
- [ ] Funciones para cálculos automáticos

---

## 🔗 REFERENCIAS

### **Documentación Relacionada**
- `../docs/TECHNICAL_STATUS.md` - Estado técnico del proyecto
- `../docs/QUICK_START.md` - Comandos de desarrollo
- `../docs/PROJECT_TODOS.md` - Tareas pendientes de BD

### **Supabase Dashboard**
- **URL:** https://supabase.com/dashboard/project/qjrsnanzhcyatdrqrgbz
- **SQL Editor:** Para ejecutar scripts
- **Table Editor:** Para ver datos visualmente
- **Auth:** Para gestionar usuarios

---

**⚠️ IMPORTANTE:** Siempre hacer backup antes de ejecutar scripts en producción.

**📧 CONTACTO:** Para dudas sobre la BD, contactar al desarrollador principal.
