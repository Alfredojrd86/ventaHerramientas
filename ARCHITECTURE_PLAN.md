# 🏗️ Arquitectura SaaS Multi-Tenant

## Estructura de Proyecto Recomendada

```
src/
├── app/                    # Configuración principal de la app
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── tenant/                 # Código específico del tenant (tienda)
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── ProductGrid.tsx
│   │   └── Cart/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── CheckoutPage.tsx
│   └── hooks/
├── admin/                  # Dashboard de administración
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── TenantList.tsx
│   │   └── TenantEditor.tsx
│   ├── pages/
│   │   └── AdminPage.tsx
│   └── hooks/
├── shared/                 # Componentes y utilidades compartidas
│   ├── components/
│   │   ├── ui/            # Componentes base (Button, Modal, etc.)
│   │   └── forms/
│   ├── contexts/
│   │   ├── TenantContext.tsx
│   │   └── AuthContext.tsx
│   ├── hooks/
│   ├── utils/
│   └── services/
├── types/                  # Tipos TypeScript compartidos
│   ├── tenant.ts
│   ├── product.ts
│   └── api.ts
└── assets/                 # Assets estáticos
```

## Ventajas de esta Estructura

1. **Separación Clara**: Tenant y Admin separados pero en el mismo proyecto
2. **Código Compartido**: Tipos y utilidades en `/shared`
3. **Fácil Mantenimiento**: Todo en un solo repositorio
4. **Code Splitting**: Podemos cargar solo lo necesario
5. **Escalabilidad**: Fácil de convertir a proyectos separados después

## Rutas Propuestas

- `/` → Aplicación del tenant
- `/admin` → Dashboard de administración
- `/admin/tenants` → Lista de tenants
- `/admin/tenants/:id/edit` → Editor de tenant
- `/admin/tenants/:id/preview` → Vista previa

## Deploy Strategy

### Desarrollo
- Un solo servidor de desarrollo
- Hot reload para ambas aplicaciones

### Producción
- **Opción A**: Una sola aplicación con rutas
- **Opción B**: Subdominios (admin.miapp.com, tenant1.miapp.com)
- **Opción C**: Dominios separados con reverse proxy
