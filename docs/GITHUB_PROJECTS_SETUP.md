# 📊 GitHub Projects Setup - VentaCarpinteria

**Guía para crear un backlog visual del proyecto en GitHub Projects**

---

## 🎯 CONFIGURACIÓN INICIAL

### **1. Crear el Proyecto**
1. Ve a tu repositorio en GitHub
2. Click en **"Projects"** tab
3. Click **"New project"**
4. Selecciona **"Board"** template
5. Nombre: **"VentaCarpinteria MVP Backlog"**
6. Descripción: **"Roadmap hacia MVP - SaaS Multi-tenant E-commerce"**

### **2. Configurar Columnas**
```
📋 Backlog          🔄 In Progress      ✅ Done
🔥 Critical MVP      🟡 Important        🟢 Nice to Have
```

---

## 📋 ISSUES A CREAR

### **🔥 CRITICAL MVP (Bloqueantes)**

#### **Admin Dashboard & Tenants**
```markdown
**Title:** [CRITICAL] Implementar carga real de tenants en AdminDashboard
**Labels:** critical, mvp, backend, admin
**Milestone:** MVP v1.0
**Assignee:** @tu-usuario

**Description:**
Actualmente AdminDashboard muestra array vacío en lugar de tenants reales.

**Acceptance Criteria:**
- [ ] Implementar `tenantService.ts` con `getTenants()`
- [ ] Conectar AdminDashboard con Supabase
- [ ] Mostrar tenants reales en la interfaz
- [ ] Manejar estados de loading y error

**Files to modify:**
- `src/services/tenantService.ts` (crear)
- `src/components/admin/AdminDashboard.tsx` (línea ~29)

**Priority:** P0 - Bloqueante para MVP
```

```markdown
**Title:** [CRITICAL] CRUD completo de productos en ProductManager
**Labels:** critical, mvp, frontend, admin
**Milestone:** MVP v1.0

**Description:**
ProductManager solo tiene estructura básica, falta funcionalidad completa.

**Acceptance Criteria:**
- [ ] Formulario de creación de productos
- [ ] Formulario de edición de productos
- [ ] Eliminación de productos (soft delete)
- [ ] Validaciones de formularios
- [ ] Manejo de errores

**Files to modify:**
- `src/components/admin/ProductManager.tsx`
- `src/services/productService.ts`

**Priority:** P0 - Bloqueante para MVP
```

```markdown
**Title:** [CRITICAL] Implementar sistema de orders completo
**Labels:** critical, mvp, backend, database
**Milestone:** MVP v1.0

**Description:**
No existe sistema de pedidos. Crítico para checkout funcional.

**Acceptance Criteria:**
- [ ] Crear tablas `orders` y `order_items` en Supabase
- [ ] Implementar `orderService.ts`
- [ ] RLS policies para orders
- [ ] Integración con checkout

**Database Schema:**
```sql
-- Ver TECHNICAL_STATUS.md para schema completo
CREATE TABLE orders (...);
CREATE TABLE order_items (...);
```

**Priority:** P0 - Bloqueante para MVP
```

```markdown
**Title:** [CRITICAL] Checkout funcional con generación de pedidos
**Labels:** critical, mvp, frontend, payments
**Milestone:** MVP v1.0

**Description:**
CheckoutPage no procesa pedidos reales ni integra con MercadoPago.

**Acceptance Criteria:**
- [ ] Formulario completo de checkout
- [ ] Validación de datos del cliente
- [ ] Generación de order en base de datos
- [ ] Integración MercadoPago real
- [ ] Confirmación por WhatsApp/Email

**Dependencies:**
- Sistema de orders (#issue-number)

**Priority:** P0 - Bloqueante para MVP
```

### **🟡 IMPORTANT (Post-MVP Inmediato)**

```markdown
**Title:** [IMPORTANT] Subida de imágenes para productos
**Labels:** important, admin, storage
**Milestone:** MVP v1.1

**Description:**
Permitir subir imágenes de productos desde ProductManager.

**Acceptance Criteria:**
- [ ] Configurar Supabase Storage
- [ ] Componente de subida de imágenes
- [ ] Validación de tipos y tamaños
- [ ] Optimización automática de imágenes

**Priority:** P1 - Importante para UX
```

```markdown
**Title:** [IMPORTANT] Dashboard de estadísticas para tenants
**Labels:** important, admin, analytics
**Milestone:** MVP v1.1

**Description:**
Dashboard con métricas básicas para tenant owners.

**Acceptance Criteria:**
- [ ] Conteo de productos activos
- [ ] Número de pedidos del mes
- [ ] Ventas totales
- [ ] Productos más vendidos

**Priority:** P1 - Valor agregado
```

### **🟢 NICE TO HAVE (Futuro)**

```markdown
**Title:** [ENHANCEMENT] Tema personalizable por tenant
**Labels:** enhancement, ui, branding
**Milestone:** v2.0

**Description:**
Permitir a cada tenant personalizar colores y logo.

**Priority:** P2 - Diferenciador de producto
```

```markdown
**Title:** [ENHANCEMENT] PWA capabilities
**Labels:** enhancement, pwa, performance
**Milestone:** v2.0

**Description:**
Convertir en Progressive Web App para instalación móvil.

**Priority:** P2 - Experiencia móvil mejorada
```

---

## 🏷️ LABELS A CREAR

### **Por Prioridad**
- 🔴 `critical` - P0 - Bloqueante para MVP
- 🟡 `important` - P1 - Importante post-MVP
- 🟢 `enhancement` - P2 - Nice to have

### **Por Componente**
- 🏗️ `backend` - Lógica de servidor/base de datos
- 🎨 `frontend` - Interfaz de usuario
- 🔐 `auth` - Autenticación y permisos
- 👨‍💼 `admin` - Panel administrativo
- 🛒 `ecommerce` - Funcionalidades de tienda
- 💳 `payments` - Integración de pagos

### **Por Área Técnica**
- 🗄️ `database` - Cambios en BD
- 🎯 `api` - Servicios y endpoints
- 📱 `ui` - Mejoras de interfaz
- 🚀 `performance` - Optimizaciones
- 🧪 `testing` - Tests y QA

### **Por Estado**
- 🎯 `mvp` - Parte del MVP
- 🐛 `bug` - Error a corregir
- 📖 `documentation` - Docs y guías

---

## 🗓️ MILESTONES A CREAR

### **MVP v1.0** (Target: 4 semanas)
```
Fecha objetivo: [Fecha actual + 4 semanas]
Descripción: Producto mínimo viable funcional

Issues críticos:
- AdminDashboard con tenants reales
- CRUD completo de productos  
- Sistema de orders
- Checkout funcional
- Deploy estable
```

### **MVP v1.1** (Target: 6 semanas)
```
Fecha objetivo: [Fecha actual + 6 semanas]  
Descripción: Mejoras inmediatas post-MVP

Features importantes:
- Subida de imágenes
- Dashboard de estadísticas
- Optimizaciones de UX
- Testing básico
```

### **v2.0** (Target: 3 meses)
```
Fecha objetivo: [Fecha actual + 3 meses]
Descripción: Funcionalidades avanzadas

Enhancements:
- Multi-tema por tenant
- PWA capabilities  
- Analytics avanzados
- Integraciones adicionales
```

---

## 📊 VIEWS A CONFIGURAR

### **1. Board View (Principal)**
```
Columnas:
📋 Backlog | 🔄 In Progress | ✅ Done

Filtros:
- Por milestone (MVP v1.0, MVP v1.1, etc.)
- Por label (critical, important, enhancement)
- Por assignee
```

### **2. Roadmap View**
```
Timeline view mostrando:
- Milestones con fechas
- Dependencies entre issues
- Progress hacia MVP
```

### **3. Table View**
```
Columnas:
- Title
- Status  
- Priority (Label)
- Milestone
- Assignee
- Created date
```

---

## 🔄 WORKFLOW RECOMENDADO

### **Daily/Weekly**
1. **Revisar board** - Ver progreso y bloqueos
2. **Mover cards** - Actualizar estado de issues
3. **Crear nuevos issues** - Cuando surjan tareas
4. **Actualizar estimates** - Ajustar tiempos si es necesario

### **Sprint Planning** (cada 2 semanas)
1. **Review completed** - Cerrar issues terminados
2. **Prioritize backlog** - Ordenar por importancia
3. **Assign next tasks** - Seleccionar trabajo siguiente
4. **Update milestones** - Ajustar fechas si es necesario

### **Release Planning**
1. **Review MVP progress** - % completado hacia MVP
2. **Identify blockers** - Qué está frenando el progreso
3. **Adjust scope** - Mover features entre milestones si es necesario

---

## 🎯 TEMPLATES DE ISSUES

### **Feature Template**
```markdown
## 🎯 Descripción
[Descripción clara de la funcionalidad]

## ✅ Acceptance Criteria
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## 📁 Files to Modify
- `path/to/file1.tsx`
- `path/to/file2.ts`

## 🔗 Dependencies
- Depends on #issue-number
- Blocks #issue-number

## 📊 Priority
P0/P1/P2 - [Justificación]

## 🧪 Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing checklist
```

### **Bug Template**
```markdown
## 🐛 Bug Description
[Descripción del problema]

## 🔄 Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## ✅ Expected Behavior
[Lo que debería pasar]

## ❌ Actual Behavior  
[Lo que está pasando]

## 🌐 Environment
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]
- URL: [URL donde ocurre]

## 📸 Screenshots
[Si aplica]
```

---

## 🚀 COMANDOS ÚTILES

### **Vincular Commits a Issues**
```bash
# En commit messages
git commit -m "feat: implement tenant service (#issue-number)"
git commit -m "fix: resolve cart modal bug (closes #issue-number)"
```

### **Referencias en PRs**
```markdown
## Related Issues
- Closes #123
- Fixes #456  
- Related to #789
```

---

## 📈 MÉTRICAS A TRACKEAR

### **Progreso hacia MVP**
- Issues completados vs total
- Burndown por milestone
- Tiempo promedio por issue
- Blockers identificados

### **Velocity**
- Issues cerrados por semana
- Story points completados
- Cycle time por tipo de issue

### **Quality**
- Bugs reportados vs features
- Issues reopened
- Time to resolution

---

**🎯 RESULTADO:** Backlog visual y organizado que te permitirá trackear el progreso hacia MVP de manera profesional y eficiente.

**📊 BENEFICIOS:**
- Visibilidad completa del progreso
- Priorización clara de tareas
- Tracking de tiempo y esfuerzo
- Comunicación clara de estado
- Historial de decisiones
