# 🔐 **Roles y Permisos del SaaS**

## 📋 **Tabla de Permisos**

| **Acción** | **🔧 Super Admin<br/>(TÚ)** | **🏪 Tenant Owner<br/>(Cliente)** | **👥 Tenant Admin<br/>(Empleado)** | **🛒 Customer<br/>(Comprador)** |
|------------|:---:|:---:|:---:|:---:|
| **📊 Ver estadísticas globales** | ✅ | ❌ | ❌ | ❌ |
| **🏪 Crear/eliminar tenants** | ✅ | ❌ | ❌ | ❌ |
| **💰 Ver ingresos de todos los tenants** | ✅ | ❌ | ❌ | ❌ |
| **⚙️ Configurar planes y precios** | ✅ | ❌ | ❌ | ❌ |
| **🔍 Acceder a cualquier tienda** | ✅ | ❌ | ❌ | ❌ |
| **🛠️ Gestionar productos propios** | ✅ | ✅ | ✅ | ❌ |
| **🎨 Personalizar tienda propia** | ✅ | ✅ | ❌ | ❌ |
| **📊 Ver ventas propias** | ✅ | ✅ | ✅ | ❌ |
| **👥 Gestionar empleados del tenant** | ✅ | ✅ | ❌ | ❌ |
| **💳 Configurar métodos de pago** | ✅ | ✅ | ❌ | ❌ |
| **🛒 Realizar compras** | ✅ | ✅ | ✅ | ✅ |
| **📦 Ver historial de compras** | ✅ | ✅ | ✅ | ✅* |

*Solo sus propias compras

---

## 🎭 **Definición de Roles**

### **🔧 Super Admin (TÚ)**
```typescript
role: 'super_admin'
permissions: ['*'] // Acceso total
tenantIds: [] // Puede acceder a todos
```
**Casos de uso:**
- Administrar la plataforma SaaS
- Dar soporte a tenants
- Ver métricas de negocio
- Configurar precios y planes

### **🏪 Tenant Owner (Dueño de Tienda)**
```typescript
role: 'tenant_owner'
permissions: ['manage_tenant', 'manage_products', 'view_analytics']
tenantIds: ['su-tenant-id'] // Solo su tienda
```
**Casos de uso:**
- Administrar su propia tienda
- Agregar/editar productos
- Ver sus ventas
- Personalizar su marca

### **👥 Tenant Admin (Empleado de Tienda)**
```typescript
role: 'tenant_admin'
permissions: ['manage_products', 'view_orders']
tenantIds: ['tenant-id-de-su-jefe'] // Solo donde trabaja
```
**Casos de uso:**
- Gestionar inventario
- Procesar pedidos
- Atender clientes
- NO puede cambiar configuraciones importantes

### **🛒 Customer (Cliente Final)**
```typescript
role: 'customer'
permissions: ['place_orders', 'view_own_orders']
tenantIds: [] // No administra nada
```
**Casos de uso:**
- Navegar tiendas
- Comprar productos
- Ver su historial
- Dejar reseñas

---

## 🔄 **Flujo de Registro**

### **1. Registro de Tenant Owner (Tu Cliente)**
```
1. Va a tu-saas.com/register
2. Completa formulario:
   - Email personal
   - Password
   - Nombre de su tienda
   - Industria (carpintería, ferretería, etc.)
3. Sistema crea:
   - Usuario en auth.users con role: 'tenant_owner'
   - Tenant en tabla tenants
   - Vincula owner_id = user.id
4. Recibe email de bienvenida
5. Puede acceder a su dashboard
```

### **2. Registro de Empleado (Por el Tenant Owner)**
```
1. Tenant Owner va a su dashboard
2. Sección "Gestionar Empleados"
3. Invita empleado por email
4. Sistema crea:
   - Usuario con role: 'tenant_admin'
   - Asocia al tenant del owner
5. Empleado recibe invitación
6. Acepta y puede trabajar en esa tienda
```

### **3. Registro de Cliente (Opcional)**
```
1. Cliente navega tienda pública
2. Puede comprar sin registrarse (guest)
3. Opcionalmente se registra:
   - Solo email/password
   - Role: 'customer'
   - Para historial y seguimiento
```

---

## 🛡️ **Seguridad en Base de Datos**

### **Row Level Security (RLS) Políticas:**

```sql
-- Tenants: Solo pueden ver/editar sus propios tenants
CREATE POLICY "tenant_owners_own_tenant" ON tenants
  FOR ALL USING (
    auth.uid() = owner_id OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Productos: Solo productos de sus tenants
CREATE POLICY "users_own_tenant_products" ON products
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM tenants 
      WHERE owner_id = auth.uid() OR
      auth.jwt() ->> 'role' = 'super_admin'
    )
  );
```

---

## 🚀 **Implementación en tu Código**

### **Verificar permisos en componentes:**
```typescript
// En cualquier componente
const { user } = useAuth();

// Verificar si puede administrar
const canManage = user?.role === 'super_admin' || 
                  user?.role === 'tenant_owner';

// Verificar si puede ver tenant específico
const canViewTenant = (tenantId: string) => {
  if (user?.role === 'super_admin') return true;
  return user?.tenantIds?.includes(tenantId);
};
```

### **Proteger rutas:**
```typescript
<ProtectedRoute 
  requireAdmin={true}
  allowedRoles={['super_admin', 'tenant_owner']}
>
  <TenantDashboard />
</ProtectedRoute>
```

---

## ❓ **Preguntas Frecuentes**

**Q: ¿Cómo diferencias entre tu dashboard y el de un tenant?**
A: Por la URL y el rol:
- `tu-saas.com/admin` → Super Admin (TÚ)
- `tu-saas.com/dashboard` → Tenant Owner
- `carpinteria-lopez.tu-saas.com/admin` → Tenant específico

**Q: ¿Un tenant puede tener múltiples empleados?**
A: ¡Sí! Un tenant_owner puede invitar múltiples tenant_admin.

**Q: ¿Los clientes ven los dashboards administrativos?**
A: ¡NO! Los clientes solo ven la tienda pública, nunca los dashboards.

**Q: ¿Cómo cobras a los tenants?**
A: Integras Stripe/MercadoPago para suscripciones mensuales basadas en el plan.

---

¿Te queda claro ahora la estructura de permisos? ¿Quieres que implemente algún middleware específico de autorización? 🔐
