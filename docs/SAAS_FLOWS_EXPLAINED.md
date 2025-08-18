# 🏢 **Flujos del SaaS - Roles y Permisos Explicados**

## 👥 **Los 3 Tipos de Usuarios**

### **1. 🔧 TÚ - Super Administrador (Dueño del SaaS)**
**Quién eres:** El desarrollador/dueño de la plataforma SaaS
**Tu acceso:** Tienes control total sobre TODA la plataforma

**🔑 Tu cuenta en Supabase:**
- **Email:** Tu email personal (ej: `tumail@gmail.com`)
- **Password:** Tu contraseña personal
- **Rol en el sistema:** `super_admin`

**🎯 Lo que puedes hacer:**
- ✅ Ver TODOS los tenants (tiendas) que usan tu SaaS
- ✅ Crear, editar, eliminar cualquier tenant
- ✅ Ver estadísticas globales de la plataforma
- ✅ Configurar precios, planes, límites
- ✅ Soporte técnico a los tenants
- ✅ Acceder a cualquier tienda como "modo administrador"

---

### **2. 🏪 Tenant Owner (Dueño de Tienda) - Tus CLIENTES**
**Quién son:** Personas que PAGAN por usar tu SaaS para tener su tienda
**Su acceso:** Solo pueden administrar SU propia tienda

**🔑 Su cuenta en Supabase:**
- **Email:** El email del dueño del taller (ej: `juan@carpinteria-lopez.com`)
- **Password:** Su contraseña personal
- **Rol en el sistema:** `tenant_owner`
- **Tenant ID:** Solo el ID de SU tienda

**🎯 Lo que pueden hacer:**
- ✅ Administrar SOLO su tienda/tenant
- ✅ Agregar/editar/eliminar productos de su inventario
- ✅ Configurar su branding (colores, logo, nombre)
- ✅ Ver sus ventas y estadísticas
- ✅ Configurar métodos de pago
- ❌ NO pueden ver otras tiendas
- ❌ NO pueden crear nuevos tenants

---

### **3. 🛒 Cliente Final (Comprador)**
**Quién son:** Personas que COMPRAN en las tiendas de tus tenants
**Su acceso:** Solo pueden navegar y comprar

**🔑 Su "cuenta":**
- **Acceso:** Pueden comprar sin registrarse (guest checkout)
- **Opcional:** Pueden registrarse para historial de compras
- **Rol:** `customer` (si se registran)

**🎯 Lo que pueden hacer:**
- ✅ Ver productos de la tienda
- ✅ Agregar al carrito y comprar
- ✅ Ver historial de compras (si están registrados)
- ❌ NO pueden administrar nada

---

## 🔄 **Flujos Detallados**

### **📊 Flujo 1: TÚ como Super Admin**

```
1. Entras a: https://tu-saas.com/admin
2. Login con TU email personal
3. Dashboard Super Admin:
   📈 Estadísticas globales
   🏪 Lista de TODOS los tenants
   💰 Ingresos totales del SaaS
   👥 Gestión de usuarios
   ⚙️ Configuración de la plataforma
```

**Ejemplo de tu dashboard:**
```
📊 Panel Super Admin
├── 📈 Métricas Globales
│   ├── 🏪 127 tiendas activas
│   ├── 💰 $12,450 MRR
│   └── 👥 1,247 usuarios
├── 🏪 Gestión de Tenants
│   ├── "Carpintería López" - Plan Pro - $49/mes
│   ├── "Ferretería Central" - Plan Starter - $19/mes
│   └── "Taller Maderas" - Plan Enterprise - $99/mes
└── ⚙️ Configuración SaaS
    ├── Planes y precios
    ├── Límites por plan
    └── Configuración de pagos
```

---

### **🏪 Flujo 2: Tenant Owner (Tu Cliente)**

```
1. Juan (dueño de Carpintería López) entra a: carpinteria-lopez.tu-saas.com
2. Login con SU email: juan@carpinteria-lopez.com
3. Su Dashboard Tenant:
   🛠️ Gestión de productos
   🎨 Personalización de su tienda
   📊 Sus ventas y estadísticas
   ⚙️ Configuración de su negocio
```

**Ejemplo del dashboard de Juan:**
```
🏪 Panel de Carpintería López
├── 🛠️ Mis Productos (87 productos)
│   ├── Sierra Circular Makita - $89,000
│   ├── Fresadora Bosch - $156,000
│   └── [Agregar Nuevo Producto]
├── 📊 Mis Ventas
│   ├── 💰 $2,340,000 este mes
│   ├── 📦 23 pedidos
│   └── 📈 +15% vs mes anterior
├── 🎨 Mi Tienda
│   ├── Personalizar colores/logo
│   ├── Configurar información de contacto
│   └── Métodos de pago
└── ⚙️ Configuración
    ├── Perfil de la empresa
    ├── Configuración de envíos
    └── Notificaciones
```

---

### **🛒 Flujo 3: Cliente Final (Comprador)**

```
1. María busca herramientas en Google
2. Encuentra: carpinteria-lopez.tu-saas.com
3. Ve los productos de Juan
4. Compra sin registrarse (guest checkout)
5. Recibe su pedido
```

---

## 🔐 **Configuración Actual en tu Código**

### **En `AuthContext.tsx`:**
```typescript
// Usuarios DEMO para testing
const DEMO_USERS = {
  'admin@demo.com': {          // ← TÚ como Super Admin
    password: 'admin123',
    role: 'super_admin'
  },
  'tenant@demo.com': {         // ← Ejemplo de Tenant Owner
    password: 'tenant123', 
    role: 'tenant_owner',
    tenantIds: ['carpinteria-demo']
  }
};
```

### **Roles Definidos:**
- `super_admin` → TÚ (acceso total)
- `admin` → Empleados tuyos (acceso administrativo)
- `tenant_owner` → Dueños de tienda (solo su tienda)
- `tenant_admin` → Empleados del tenant (solo esa tienda)
- `customer` → Compradores finales

---

## 🚀 **Cómo Configurar Cada Tipo**

### **1. Tu Cuenta de Super Admin:**
```sql
-- En Supabase, crear tu usuario:
-- 1. Authentication → Users → Add User
-- Email: tumail@gmail.com
-- Password: tu-password-seguro

-- 2. Luego en SQL Editor:
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "super_admin"}'
WHERE email = 'tumail@gmail.com';
```

### **2. Cuenta de un Tenant (Cliente):**
```sql
-- Cuando un cliente se registra:
-- 1. Se crea su usuario en auth.users
-- 2. Se crea su tenant en la tabla tenants
-- 3. Se vincula: tenant.owner_id = user.id

INSERT INTO tenants (slug, owner_id, business) VALUES (
  'carpinteria-lopez',
  'uuid-del-usuario-juan',
  '{"name": "Carpintería López", "industry": "carpinteria"}'
);
```

---

## ❓ **Preguntas Frecuentes**

### **Q: ¿Los tenants necesitan cuenta en Supabase?**
**A:** ¡SÍ! Cada tenant owner necesita su propia cuenta de usuario en Supabase, pero con rol `tenant_owner`.

### **Q: ¿Cómo creo nuevos tenants?**
**A:** Como super admin, puedes:
1. Crear el usuario en Supabase Authentication
2. Crear el tenant en la tabla `tenants`
3. Vincular `tenant.owner_id = user.id`

### **Q: ¿Los clientes finales necesitan cuenta?**
**A:** NO obligatoriamente. Pueden comprar como "invitados", pero opcionalmente pueden registrarse.

### **Q: ¿Cómo accedo a la tienda de un tenant específico?**
**A:** Cada tenant tiene su propia URL:
- `carpinteria-lopez.tu-saas.com` (subdominio)
- O `tu-saas.com/tienda/carpinteria-lopez` (path)

---

¿Te queda claro ahora la diferencia entre los roles? ¿Quieres que implemente algún flujo específico? 🤔
