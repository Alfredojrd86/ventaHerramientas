# ⚡ QUICK START - VentaCarpinteria

**Para cuando regreses al proyecto después de un tiempo**

---

## 🚀 COMANDOS ESENCIALES

### **Desarrollo Local**
```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
# → http://localhost:5174

# Build para producción
npm run build

# Preview del build
npm run preview
```

### **Git Workflow**
```bash
# Estado actual
git status
git log --oneline -10

# Crear nueva feature
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/nueva-funcionalidad
```

---

## 🔑 CREDENCIALES Y ACCESOS

### **Usuarios de Prueba**
| Rol | Email | Uso |
|-----|-------|-----|
| Super Admin | `alfredojrd86@gmail.com` | Acceso total, gestión de tenants |
| Tenant Owner | `tompyviruta@gmail.com` | Gestión de su tienda |

### **URLs Importantes**
| Servicio | URL |
|----------|-----|
| **Producción** | https://venta-herramientas.vercel.app/ |
| **Admin Panel** | https://venta-herramientas.vercel.app/admin |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/qjrsnanzhcyatdrqrgbz |
| **Vercel Dashboard** | https://vercel.com/dashboard |

### **Tenant Activo**
```
ID: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
Slug: carpinteria
Owner: tompyviruta@gmail.com
Productos: 12 herramientas cargadas
```

---

## 📋 ESTADO ACTUAL (Checklist Rápido)

### ✅ **Funcionando**
- [x] Login/logout de usuarios
- [x] Roles y permisos básicos
- [x] Carga de productos desde BD
- [x] Carrito de compras funcional
- [x] WhatsApp integration básica
- [x] Deploy en Vercel estable
- [x] UI/UX profesional

### 🔥 **URGENTE - Falta para MVP**
- [ ] **Cargar tenants reales** en AdminDashboard (actualmente array vacío)
- [ ] **CRUD de productos** funcional en ProductManager
- [ ] **Sistema de orders** completo (tablas + servicios)
- [ ] **Checkout real** que genere pedidos
- [ ] **Integración MercadoPago** funcional

### 🟡 **Importante - Post MVP**
- [ ] Subida de imágenes
- [ ] Dashboard de estadísticas
- [ ] Gestión completa de tenants
- [ ] Notificaciones y emails

---

## 🔧 ARQUITECTURA RÁPIDA

### **Frontend (src/)**
```
components/
├── admin/AdminDashboard.tsx    🟡 UI completa, falta lógica
├── auth/LoginPage.tsx          ✅ Funcionando
├── FloatingCartIcon.tsx        ✅ UX mejorada
├── ProductGrid.tsx             ✅ Carga productos
└── debug/                      🔧 Solo desarrollo

contexts/
├── AuthContext.tsx             ✅ Roles funcionando
├── TenantContext.tsx           ✅ Multi-tenant
└── CartContext.tsx             ✅ Carrito funcional

services/
├── productService.ts           🟡 Básico, falta completar
├── tenantService.ts            ❌ No implementado
└── orderService.ts             ❌ No implementado
```

### **Backend (Supabase)**
```sql
-- ✅ Implementadas
auth.users     -- Usuarios con roles
tenants        -- Configuración multi-tenant
products       -- Productos por tenant

-- ❌ Faltan (CRÍTICO)
orders         -- Pedidos de clientes
order_items    -- Items de cada pedido
```

---

## 🚨 PROBLEMAS CONOCIDOS

### **🔥 Críticos**
1. **AdminDashboard.tsx línea ~29:** `const realTenants: TenantConfig[] = [];` 
   - Cambiar por llamada real a Supabase
2. **ProductManager.tsx:** CRUD no funcional
3. **No existe orderService.ts** - Necesario para checkout

### **⚠️ Importantes**  
1. **Falta validación** en formularios de productos
2. **RLS policies incompletas** en algunas tablas
3. **Error handling** básico en servicios

---

## 🎯 PLAN DE ACCIÓN INMEDIATO

### **Día 1: Reconexión**
1. ✅ Leer `PROJECT_TODOS.md` completo
2. ✅ Probar aplicación en local y producción
3. ✅ Verificar que login funciona con ambos usuarios
4. ✅ Revisar estado de la base de datos en Supabase

### **Día 2-3: Tenants**
1. 🔥 Implementar `tenantService.ts`
2. 🔥 Arreglar carga de tenants en AdminDashboard
3. 🔥 Probar creación/edición de tenants

### **Día 4-5: Productos**
1. 🔥 Completar CRUD en ProductManager
2. 🔥 Formularios de creación/edición
3. 🔥 Validaciones básicas

### **Semana 2: Orders**
1. 🔥 Crear tablas `orders` y `order_items`
2. 🔥 Implementar `orderService.ts`
3. 🔥 CheckoutPage funcional
4. 🔥 Integración MercadoPago

---

## 💡 TIPS PARA RETOMAR

### **🔍 Debugging**
```bash
# Ver logs de Supabase
# En Dashboard → Logs → API logs

# Debug local
# Componentes debug en src/components/debug/
# Solo usar en desarrollo

# Console del navegador
# F12 → Console para ver errores
```

### **🗄️ Base de Datos**
```sql
-- Ver tenants
SELECT * FROM tenants;

-- Ver productos  
SELECT * FROM products WHERE tenant_id = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';

-- Ver usuarios
SELECT id, email, raw_user_meta_data FROM auth.users;
```

### **📁 Archivos Clave**
| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `AdminDashboard.tsx` | Panel admin principal | 🟡 UI completa |
| `ProductManager.tsx` | CRUD productos | ❌ Básico |
| `productService.ts` | API productos | 🟡 Parcial |
| `AuthContext.tsx` | Autenticación | ✅ Completo |

---

## 🎯 OBJETIVO FINAL

**MVP Funcional con:**
- ✅ Login multi-rol
- 🔥 Admin panel completo
- 🔥 CRUD de productos  
- 🔥 Sistema de pedidos
- 🔥 Checkout funcional
- ✅ Deploy estable

**Meta: 2-4 semanas para MVP completo**

---

## 📞 RECURSOS

### **Documentación**
- `PROJECT_TODOS.md` - Lista completa de tareas
- `TECHNICAL_STATUS.md` - Estado técnico detallado
- `DEPLOYMENT_CHECKLIST.md` - Pre-deploy checklist

### **Debug**
- `src/components/debug/README.md` - Componentes debug
- `src/config/debug.ts` - Configuración debug

**🎯 REGLA DE ORO:** Siempre leer `PROJECT_TODOS.md` antes de empezar a codear.
