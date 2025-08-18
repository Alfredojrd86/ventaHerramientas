# 🏪 VentaCarpinteria - SaaS Multi-Tenant E-commerce

**Plataforma SaaS para venta de herramientas con gestión multi-tenant**

---

## 📚 DOCUMENTACIÓN DEL PROYECTO

### 🎯 **Para Empezar Rápido**
- **[⚡ QUICK_START.md](./QUICK_START.md)** - Guía rápida para retomar el proyecto
- **[📋 PROJECT_TODOS.md](./PROJECT_TODOS.md)** - Lista completa de tareas y estado del MVP

### 🔧 **Información Técnica**
- **[🔧 TECHNICAL_STATUS.md](./TECHNICAL_STATUS.md)** - Estado técnico detallado y arquitectura
- **[✅ DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Lista de verificación pre-deploy

### 🛠️ **Componentes y Debug**
- **[🔧 src/components/debug/README.md](./src/components/debug/README.md)** - Componentes de debugging
- **[⚙️ src/config/debug.ts](./src/config/debug.ts)** - Configuración de debug

---

## 🎯 ESTADO ACTUAL

### ✅ **Funcionando**
- Autenticación multi-rol (super_admin, tenant_owner)
- Carga de productos desde Supabase
- Carrito de compras con UX mejorada
- Panel administrativo con UI profesional
- Deploy estable en Vercel
- Integración básica con WhatsApp

### 🔥 **Crítico para MVP**
- Carga real de tenants en AdminDashboard
- CRUD completo de productos
- Sistema de orders/pedidos
- Checkout funcional con MercadoPago
- Gestión completa de inventario

---

## 🚀 LINKS RÁPIDOS

### **🌐 URLs de Producción**
- **App Principal:** https://venta-herramientas.vercel.app/
- **Panel Admin:** https://venta-herramientas.vercel.app/admin

### **🔑 Credenciales de Prueba**
- **Super Admin:** alfredojrd86@gmail.com
- **Tenant Owner:** tompyviruta@gmail.com

### **🛠️ Dashboards**
- **Supabase:** https://supabase.com/dashboard/project/qjrsnanzhcyatdrqrgbz
- **Vercel:** https://vercel.com/dashboard

---

## 📋 ORDEN DE LECTURA RECOMENDADO

### **🆕 Si es tu primera vez:**
1. **[📋 PROJECT_TODOS.md](./PROJECT_TODOS.md)** - Entender el estado general
2. **[🔧 TECHNICAL_STATUS.md](./TECHNICAL_STATUS.md)** - Conocer la arquitectura
3. **[⚡ QUICK_START.md](./QUICK_START.md)** - Comandos y setup básico

### **🔄 Si regresas al proyecto:**
1. **[⚡ QUICK_START.md](./QUICK_START.md)** - Reconexión rápida
2. **[📋 PROJECT_TODOS.md](./PROJECT_TODOS.md)** - Ver qué falta por hacer
3. **[✅ DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Antes de deployar

### **🐛 Si hay problemas:**
1. **[🔧 src/components/debug/README.md](./src/components/debug/README.md)** - Herramientas de debug
2. **[🔧 TECHNICAL_STATUS.md](./TECHNICAL_STATUS.md)** - Issues conocidos
3. **Logs en Supabase Dashboard**

---

## 🎯 OBJETIVO DEL PROYECTO

### **🏪 MVP - Plataforma SaaS Multi-Tenant**
- **Super Admin:** Gestiona múltiples tiendas (tenants)
- **Tenant Owner:** Gestiona su propia tienda de herramientas
- **Customers:** Compran productos a través de WhatsApp/MercadoPago
- **Deploy:** Aplicación estable y escalable en producción

### **📈 Funcionalidades Core**
- ✅ Autenticación y roles
- ✅ Multi-tenancy
- ✅ Catálogo de productos
- ✅ Carrito de compras
- 🔥 Sistema de pedidos (pendiente)
- 🔥 Panel administrativo completo (pendiente)
- 🔥 Integración de pagos (pendiente)

---

## 🛠️ STACK TECNOLÓGICO

### **Frontend**
- **React 18** + **TypeScript**
- **Tailwind CSS** para estilos
- **Vite** como build tool
- **React Router** para navegación

### **Backend**
- **Supabase** (PostgreSQL + Auth + Real-time)
- **Row Level Security** para multi-tenancy
- **Storage** para imágenes (pendiente)

### **Deploy**
- **Vercel** para frontend
- **Supabase** como BaaS
- **CDN** para assets estáticos

---

## 📞 CONTACTO Y CRÉDITOS

### **👨‍💻 Desarrollador**
- **Alfredo Rebolledo** - ARdev
- **Portfolio:** https://ajrddev.vercel.app/
- **Email:** alfredojrd86@gmail.com

### **🏪 Cliente/Tenant Demo**
- **Tom Pyviruta** - tompyviruta@gmail.com
- **Tienda:** Carpintería y Herramientas

---

## ⚡ COMANDOS RÁPIDOS

```bash
# Desarrollo local
npm run dev

# Build para producción  
npm run build

# Ver estado del proyecto
git status
git log --oneline -5

# Probar funcionalidades
# 1. Ir a http://localhost:5174
# 2. Login con alfredojrd86@gmail.com o tompyviruta@gmail.com
# 3. Probar carrito y admin panel
```

---

**🎯 PRÓXIMO PASO:** Leer [📋 PROJECT_TODOS.md](./PROJECT_TODOS.md) para ver qué hacer a continuación.

**📅 META:** MVP completo en 2-4 semanas máximo.

**🚀 ESTADO:** 70% completo - Falta backend de orders y admin CRUD completo.
