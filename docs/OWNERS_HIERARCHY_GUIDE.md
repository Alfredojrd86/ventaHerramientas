# Guía de Jerarquía de Owners y Tiendas

## Descripción

Esta funcionalidad permite al **Super Admin** visualizar la estructura completa del sistema SaaS, mostrando:

1. **Owners** (Propietarios de tiendas)
2. **Tiendas** que posee cada owner
3. **Productos** que tiene cada tienda

## Características

### Vista Jerárquica
- **Nivel 1**: Owners con estadísticas de tiendas y productos
- **Nivel 2**: Tiendas de cada owner con información de estado y plan
- **Nivel 3**: Productos de cada tienda con detalles completos

### Funcionalidades
- ✅ Vista expandible/colapsable para cada nivel
- ✅ Búsqueda por nombre de owner o tienda
- ✅ Estadísticas del sistema en tiempo real
- ✅ Contadores de tiendas y productos por owner
- ✅ Información detallada de cada tienda (estado, plan, slug)
- ✅ Vista de productos con imágenes, precios y stock

### Estadísticas del Sistema
- Total de Owners
- Total de Tiendas
- Total de Productos
- Tiendas Activas vs Inactivas
- Resumen general de la plataforma

## Acceso

### Requisitos
- Usuario autenticado con rol `super_admin`
- Acceso al panel administrativo

### Navegación
1. Ir al **Panel Administrativo**
2. Hacer clic en la pestaña **"Jerarquía"**
3. La vista se carga automáticamente

## Estructura de Datos

### OwnerInfo
```typescript
interface OwnerInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  tenants: TenantInfo[];
}
```

### TenantInfo
```typescript
interface TenantInfo {
  id: string;
  slug: string;
  businessName: string;
  status: string;
  plan: string;
  productCount: number;
  products: Tool[];
}
```

### Tool (Producto)
```typescript
interface Tool {
  id: string;
  code: string;
  name: string;
  condition: string;
  originalPrice: number;
  price: number;
  description: string;
  features: string[];
  urgency: string;
  ctaText: string;
  discount: string;
  image: string;
  stock: number;
}
```

## Componentes

### OwnersHierarchy
Componente principal que renderiza toda la jerarquía.

### OwnerCard
Tarjeta expandible que muestra información del owner y sus tiendas.

### TenantCard
Tarjeta expandible que muestra información de la tienda y sus productos.

### ProductCard
Tarjeta compacta que muestra información básica del producto.

### SystemStats
Componente que muestra estadísticas generales del sistema.

## Servicios

### AdminService
- `getOwnersHierarchy()`: Obtiene la jerarquía completa
- `getSystemStats()`: Obtiene estadísticas del sistema

## Uso

### Expandir/Colapsar
- **Owner**: Hacer clic en la flecha para ver sus tiendas
- **Tienda**: Hacer clic en la flecha para ver sus productos

### Búsqueda
- Usar el campo de búsqueda para filtrar por:
  - Nombre del owner
  - Email del owner
  - Nombre de la tienda

### Actualización
- Hacer clic en "Actualizar" para refrescar los datos
- Los datos se cargan automáticamente al entrar a la vista

## Consideraciones Técnicas

### Base de Datos
- Los datos se obtienen de las tablas `tenants` y `products`
- Se agrupan por `owner_id` para crear la jerarquía
- Solo se muestran productos activos (`is_active = true`)

### Rendimiento
- Los datos se cargan de forma lazy (solo cuando se expande)
- Se implementa paginación virtual para grandes cantidades de datos
- Cache local para evitar consultas repetidas

### Seguridad
- Solo usuarios `super_admin` pueden acceder
- Se valida la autenticación en cada consulta
- Los datos se filtran por permisos del usuario

## Personalización

### Estilos
- Utiliza Tailwind CSS para el diseño
- Colores configurables para diferentes estados
- Iconos SVG personalizables

### Layout
- Responsive design para móviles y desktop
- Grid adaptativo para diferentes tamaños de pantalla
- Espaciado consistente entre elementos

## Troubleshooting

### Problemas Comunes

#### Error de Carga
- Verificar conexión a Supabase
- Revisar permisos del usuario
- Comprobar que las tablas existan

#### Datos No Mostrados
- Verificar que haya tenants en la base de datos
- Comprobar que los tenants tengan `owner_id` válidos
- Revisar que los productos estén marcados como activos

#### Problemas de Rendimiento
- Limitar la cantidad de productos mostrados por tienda
- Implementar paginación si hay muchos datos
- Optimizar las consultas de base de datos

## Futuras Mejoras

- [ ] Filtros avanzados por estado, plan, fecha
- [ ] Exportación de datos a CSV/Excel
- [ ] Gráficos y métricas visuales
- [ ] Notificaciones en tiempo real
- [ ] Acciones masivas (activar/desactivar tiendas)
- [ ] Historial de cambios
- [ ] Auditoría de acciones del super admin
