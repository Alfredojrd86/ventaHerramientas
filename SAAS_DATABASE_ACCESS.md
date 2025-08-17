# 🗄️ **Acceso a Base de Datos en SaaS Multi-Tenant**

## 🔑 **Arquitectura de Acceso**

### **🏢 Modelo: "Shared Database, Isolated by Tenant ID"**

```
┌─────────────────────────────────────────┐
│  🗄️  UNA SOLA BASE DE DATOS (Supabase)  │
├─────────────────────────────────────────┤
│  📊 Tabla: tenants                      │
│  ├── id: tenant-1 (Carpintería López)   │
│  ├── id: tenant-2 (Ferretería Central)  │
│  └── id: tenant-3 (Taller Maderas)      │
├─────────────────────────────────────────┤
│  🛠️  Tabla: products                    │
│  ├── tenant_id: tenant-1 → 50 productos │
│  ├── tenant_id: tenant-2 → 120 productos│
│  └── tenant_id: tenant-3 → 80 productos │
├─────────────────────────────────────────┤
│  📦 Tabla: orders                       │
│  ├── tenant_id: tenant-1 → 200 pedidos  │
│  ├── tenant_id: tenant-2 → 450 pedidos  │
│  └── tenant_id: tenant-3 → 300 pedidos  │
└─────────────────────────────────────────┘
```

---

## 👑 **TU Acceso como Super Admin**

### **✅ Acceso TOTAL:**
```sql
-- TÚ puedes hacer CUALQUIER consulta:

-- Ver TODOS los tenants
SELECT * FROM tenants;

-- Ver TODOS los productos de TODOS los tenants
SELECT * FROM products;

-- Ver productos de un tenant específico
SELECT * FROM products WHERE tenant_id = 'tenant-1';

-- Estadísticas globales
SELECT 
  tenant_id,
  COUNT(*) as total_productos,
  SUM(price * stock) as valor_inventario
FROM products 
GROUP BY tenant_id;

-- Ver TODAS las ventas de TODOS los tenants
SELECT * FROM orders;
```

### **🔧 Tu Dashboard Super Admin puede mostrar:**
```
📊 Panel Super Admin
├── 🏪 Carpintería López
│   ├── 📦 50 productos
│   ├── 💰 $2,340,000 en ventas
│   ├── 📊 200 pedidos este mes
│   └── 👥 1,250 clientes únicos
├── 🏪 Ferretería Central  
│   ├── 📦 120 productos
│   ├── 💰 $5,680,000 en ventas
│   ├── 📊 450 pedidos este mes
│   └── 👥 2,100 clientes únicos
└── 📈 Métricas Globales
    ├── 💰 $8,020,000 total ventas
    ├── 🏪 3 tiendas activas
    └── 📦 650 pedidos totales
```

---

## 🛡️ **Seguridad: Row Level Security (RLS)**

### **Cómo funciona la seguridad:**
```sql
-- Política para productos:
CREATE POLICY "tenant_isolation" ON products
  FOR ALL USING (
    -- Los tenants solo ven SUS productos
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
    OR
    -- PERO TÚ (super_admin) ves TODO
    auth.jwt() ->> 'role' = 'super_admin'
  );
```

### **En la práctica:**
```typescript
// Cuando Juan (tenant_owner) hace login:
const { data } = await supabase
  .from('products')
  .select('*');
// ☝️ Solo ve SUS 50 productos

// Cuando TÚ (super_admin) haces login:
const { data } = await supabase
  .from('products')
  .select('*');
// ☝️ Ves TODOS los productos (270 productos)
```

---

## 🎯 **Implementación en tu Código**

### **1. Verificar rol en queries:**
```typescript
// En ProductService.ts
export class ProductService {
  // Para tenants: solo sus productos
  static async getTenantProducts(tenantId: string) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId); // Filtro por tenant
    return data;
  }

  // Para super admin: todos los productos
  static async getAllProducts() {
    const { data } = await supabase
      .from('products')
      .select('*'); // Sin filtro = todos
    return data;
  }

  // Estadísticas globales (solo super admin)
  static async getGlobalStats() {
    const { data } = await supabase
      .from('products')
      .select(`
        tenant_id,
        tenants(business->name),
        count(*),
        sum(price * stock)
      `)
      .group('tenant_id');
    return data;
  }
}
```

### **2. Dashboard condicional:**
```typescript
// En SuperAdminDashboard.tsx
function SuperAdminDashboard() {
  const { user } = useAuth();
  const [globalStats, setGlobalStats] = useState([]);

  useEffect(() => {
    if (user?.role === 'super_admin') {
      // Solo si eres super admin
      ProductService.getGlobalStats()
        .then(setGlobalStats);
    }
  }, [user]);

  return (
    <div>
      <h1>Dashboard Super Admin</h1>
      
      {/* Métricas de TODOS los tenants */}
      {globalStats.map(tenant => (
        <div key={tenant.tenant_id}>
          <h3>{tenant.tenants.business.name}</h3>
          <p>Productos: {tenant.count}</p>
          <p>Valor inventario: ${tenant.sum}</p>
        </div>
      ))}
      
      {/* Lista de todos los tenants */}
      <TenantsList />
      
      {/* Poder "entrar" a cualquier tienda */}
      <TenantSwitcher />
    </div>
  );
}
```

---

## 🔄 **Comparación con Otros Modelos**

### **❌ Modelo "Database per Tenant" (NO recomendado):**
```
Tenant 1: database_carpinteria_lopez
Tenant 2: database_ferreteria_central  
Tenant 3: database_taller_maderas
```
**Problemas:**
- Difícil de mantener
- Costoso (múltiples DBs)
- Imposible hacer análisis global
- Backup complejo

### **✅ Modelo "Shared DB + Tenant ID" (Tu implementación):**
```
Una DB con tenant_id en cada tabla
```
**Ventajas:**
- Fácil mantenimiento
- Análisis global posible
- Backup centralizado
- Escalable

---

## 🚀 **Funcionalidades que puedes implementar**

### **1. "Impersonar" un tenant:**
```typescript
// Como super admin, puedes "entrar" a cualquier tienda
function impersonateTenant(tenantId: string) {
  // Cambiar contexto temporalmente
  setCurrentTenant(tenantId);
  navigate(`/tenant/${tenantId}/dashboard`);
}
```

### **2. Soporte técnico:**
```typescript
// Ver los productos de un tenant específico para dar soporte
function viewTenantProducts(tenantId: string) {
  return ProductService.getTenantProducts(tenantId);
}
```

### **3. Análisis de negocio:**
```sql
-- Consultas que solo TÚ puedes hacer:

-- ¿Qué tenant vende más?
SELECT 
  t.business->>'name' as tienda,
  SUM(o.total) as ventas_totales
FROM tenants t
JOIN orders o ON t.id = o.tenant_id
GROUP BY t.id
ORDER BY ventas_totales DESC;

-- ¿Qué productos son más populares globalmente?
SELECT 
  p.name,
  COUNT(oi.product_id) as veces_vendido
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id
ORDER BY veces_vendido DESC;
```

---

## ❓ **Preguntas Frecuentes**

**Q: ¿Los tenants pueden ver datos de otros tenants?**
**A:** ¡NO! Las políticas RLS lo impiden automáticamente.

**Q: ¿Puedo ver las ventas de todos los tenants?**
**A:** ¡SÍ! Como super_admin tienes acceso a todo.

**Q: ¿Cómo hago backup de datos específicos de un tenant?**
**A:** Puedes exportar datos filtrando por `tenant_id`.

**Q: ¿Los tenants pueden eliminar sus datos?**
**A:** Solo si les das esa funcionalidad. Por defecto, TÚ controlas todo.

---

## 🎯 **En Resumen:**

**✅ TÚ como dueño del SaaS:**
- Tienes acceso TOTAL a toda la base de datos
- Puedes ver datos de TODOS los tenants
- Puedes hacer análisis globales
- Puedes dar soporte técnico
- Controlas la seguridad y permisos

**🔒 Los tenants:**
- Solo ven SUS propios datos
- No pueden acceder a otros tenants
- Dependen de los permisos que TÚ les das

¿Te queda claro? ¿Quieres que implemente algún dashboard específico de super admin? 🚀
