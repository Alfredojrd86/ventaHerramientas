#!/bin/bash

# 🚀 Script para crear issues automáticamente en GitHub
# Requiere: GitHub CLI instalado (gh auth login)

echo "🚀 Creando issues para VentaCarpinteria MVP..."

# Verificar que gh está instalado y autenticado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI no está instalado. Instala con: brew install gh"
    exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
    echo "❌ No estás autenticado con GitHub CLI. Ejecuta: gh auth login"
    exit 1
fi

# Crear labels si no existen
echo "📋 Creando labels..."

gh label create "critical" --color "d73a4a" --description "P0 - Bloqueante para MVP" --force
gh label create "important" --color "fbca04" --description "P1 - Importante post-MVP" --force  
gh label create "enhancement" --color "a2eeef" --description "P2 - Nice to have" --force
gh label create "mvp" --color "0075ca" --description "Parte del MVP" --force
gh label create "backend" --color "1d76db" --description "Lógica de servidor/BD" --force
gh label create "frontend" --color "7057ff" --description "Interfaz de usuario" --force
gh label create "admin" --color "b60205" --description "Panel administrativo" --force
gh label create "auth" --color "0e8a16" --description "Autenticación y permisos" --force
gh label create "database" --color "5319e7" --description "Cambios en BD" --force
gh label create "payments" --color "f9d0c4" --description "Integración de pagos" --force
gh label create "storage" --color "c2e0c6" --description "Manejo de archivos" --force
gh label create "analytics" --color "fef2c0" --description "Métricas y estadísticas" --force
gh label create "validation" --color "d4c5f9" --description "Validaciones de formularios" --force
gh label create "ui" --color "c5def5" --description "Mejoras de interfaz" --force
gh label create "branding" --color "fad8c7" --description "Personalización visual" --force
gh label create "pwa" --color "bfd4f2" --description "Progressive Web App" --force
gh label create "performance" --color "e99695" --description "Optimizaciones" --force
gh label create "security" --color "b60205" --description "Seguridad y permisos" --force

# Crear milestones
echo "🎯 Creando milestones..."

gh api repos/:owner/:repo/milestones -f title="MVP v1.0" -f description="Producto mínimo viable funcional" -f due_on="2025-09-15T23:59:59Z"
gh api repos/:owner/:repo/milestones -f title="MVP v1.1" -f description="Mejoras inmediatas post-MVP" -f due_on="2025-09-30T23:59:59Z"
gh api repos/:owner/:repo/milestones -f title="v2.0" -f description="Funcionalidades avanzadas" -f due_on="2025-11-15T23:59:59Z"

# Issues críticos para MVP
echo "🔥 Creando issues críticos..."

gh issue create \
  --title "[CRITICAL] Implementar carga real de tenants en AdminDashboard" \
  --body-file - \
  --label "critical,mvp,backend,admin" \
  --milestone "MVP v1.0" << 'EOF'
## 🎯 Descripción
Actualmente AdminDashboard muestra array vacío en lugar de tenants reales desde Supabase.

## ✅ Acceptance Criteria
- [ ] Implementar `tenantService.ts` con `getTenants()`
- [ ] Conectar AdminDashboard con Supabase
- [ ] Mostrar tenants reales en la interfaz
- [ ] Manejar estados de loading y error
- [ ] Filtrar tenants por permisos de usuario

## 📁 Files to Modify
- `src/services/tenantService.ts` (crear)
- `src/components/admin/AdminDashboard.tsx` (línea ~29)

## 📊 Priority
P0 - Bloqueante para MVP

## 🧪 Testing
- [ ] Probar con super_admin (ve todos los tenants)
- [ ] Probar con tenant_owner (ve solo su tenant)
- [ ] Manejar errores de conexión
- [ ] Estados de loading apropiados
EOF

gh issue create \
  --title "[CRITICAL] CRUD completo de productos en ProductManager" \
  --body-file - \
  --label "critical,mvp,frontend,admin" \
  --milestone "MVP v1.0" << 'EOF'
## 🎯 Descripción
ProductManager solo tiene estructura básica, falta funcionalidad completa de gestión de productos.

## ✅ Acceptance Criteria
- [ ] Formulario de creación de productos
- [ ] Formulario de edición de productos
- [ ] Eliminación de productos (soft delete)
- [ ] Validaciones de formularios
- [ ] Manejo de errores y estados
- [ ] Paginación de productos
- [ ] Filtros básicos (activo/inactivo)

## 📁 Files to Modify
- `src/components/admin/ProductManager.tsx`
- `src/services/productService.ts`

## 📊 Priority
P0 - Bloqueante para MVP

## 🧪 Testing
- [ ] Crear producto nuevo
- [ ] Editar producto existente
- [ ] Eliminar producto (soft delete)
- [ ] Validaciones de campos requeridos
- [ ] Permisos por tipo de usuario
EOF

gh issue create \
  --title "[CRITICAL] Implementar sistema de orders completo" \
  --body-file - \
  --label "critical,mvp,backend,database" \
  --milestone "MVP v1.0" << 'EOF'
## 🎯 Descripción
No existe sistema de pedidos. Crítico para checkout funcional y tracking de ventas.

## ✅ Acceptance Criteria
- [ ] Crear tablas `orders` y `order_items` en Supabase
- [ ] Implementar `orderService.ts` completo
- [ ] RLS policies para orders por tenant
- [ ] Estados de pedidos (pending, confirmed, shipped, etc.)
- [ ] Integración con carrito actual

## 📁 Database Schema
```sql
-- Ver TECHNICAL_STATUS.md para schema completo
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid REFERENCES tenants(id),
  customer_email string,
  customer_name string,
  customer_phone string,
  status order_status DEFAULT 'pending',
  subtotal numeric,
  shipping_cost numeric,
  total numeric,
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  notes text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## 📊 Priority
P0 - Bloqueante para MVP
EOF

gh issue create \
  --title "[CRITICAL] Checkout funcional con generación de pedidos" \
  --body-file - \
  --label "critical,mvp,frontend,payments" \
  --milestone "MVP v1.0" << 'EOF'
## 🎯 Descripción
CheckoutPage no procesa pedidos reales ni integra correctamente con MercadoPago.

## ✅ Acceptance Criteria
- [ ] Formulario completo de checkout
- [ ] Validación de datos del cliente
- [ ] Generación de order en base de datos
- [ ] Integración MercadoPago real (no solo WhatsApp)
- [ ] Confirmación por WhatsApp/Email
- [ ] Página de confirmación de pedido
- [ ] Limpieza del carrito post-checkout

## 📁 Files to Modify
- `src/components/CheckoutPage.tsx`
- `src/components/EnhancedCheckoutPage.tsx`
- `src/services/orderService.ts`

## 📊 Priority
P0 - Bloqueante para MVP
EOF

# Issues importantes
echo "🟡 Creando issues importantes..."

gh issue create \
  --title "[IMPORTANT] Subida de imágenes para productos" \
  --body-file - \
  --label "important,admin,storage" \
  --milestone "MVP v1.1" << 'EOF'
## 🎯 Descripción
Permitir subir imágenes de productos desde ProductManager usando Supabase Storage.

## ✅ Acceptance Criteria
- [ ] Configurar Supabase Storage bucket
- [ ] Componente de subida de imágenes
- [ ] Validación de tipos (jpg, png, webp)
- [ ] Validación de tamaño (max 5MB)
- [ ] Optimización automática de imágenes
- [ ] Preview antes de subir
- [ ] Eliminar imágenes no usadas

## 📊 Priority
P1 - Importante para UX
EOF

gh issue create \
  --title "[IMPORTANT] Dashboard de estadísticas para tenants" \
  --body-file - \
  --label "important,admin,analytics" \
  --milestone "MVP v1.1" << 'EOF'
## 🎯 Descripción
Dashboard con métricas básicas para que tenant owners vean el performance de su tienda.

## ✅ Acceptance Criteria
- [ ] Conteo de productos activos
- [ ] Número de pedidos del mes
- [ ] Ventas totales del mes
- [ ] Productos más vendidos
- [ ] Gráficos básicos (Chart.js)
- [ ] Filtros por período (mes, semana)

## 📊 Priority
P1 - Valor agregado importante
EOF

# Enhancements
echo "🟢 Creando enhancements..."

gh issue create \
  --title "[ENHANCEMENT] Tema personalizable por tenant" \
  --body-file - \
  --label "enhancement,ui,branding" \
  --milestone "v2.0" << 'EOF'
## 🎯 Descripción
Permitir a cada tenant personalizar colores, logo y branding de su tienda.

## ✅ Acceptance Criteria
- [ ] Editor de colores primarios/secundarios
- [ ] Subida de logo personalizado
- [ ] Preview en tiempo real
- [ ] Aplicación automática en frontend
- [ ] Fallback a tema por defecto

## 📊 Priority
P2 - Diferenciador de producto
EOF

gh issue create \
  --title "[ENHANCEMENT] PWA capabilities" \
  --body-file - \
  --label "enhancement,pwa,performance" \
  --milestone "v2.0" << 'EOF'
## 🎯 Descripción
Convertir en Progressive Web App para mejor experiencia móvil.

## ✅ Acceptance Criteria
- [ ] Service Worker para cache
- [ ] Manifest.json configurado
- [ ] Funcionalidad offline básica
- [ ] Instalación en móvil
- [ ] Push notifications

## 📊 Priority
P2 - Experiencia móvil mejorada
EOF

echo "✅ Issues creados exitosamente!"
echo ""
echo "🔗 Ve tu proyecto en:"
echo "   https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name")/projects"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a GitHub → Projects → New project"
echo "2. Selecciona 'Board' template"
echo "3. Configura columnas: Backlog | In Progress | Done"
echo "4. Agrega los issues creados al proyecto"
echo "5. Organiza por prioridad (critical → important → enhancement)"
