# 🏪 VentaCarpinteria - SaaS Multi-Tenant E-commerce

**Plataforma SaaS para venta de herramientas con gestión multi-tenant**

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-brightgreen)](https://venta-herramientas.vercel.app/)
[![MVP Progress](https://img.shields.io/badge/MVP-70%25-orange)](./docs/PROJECT_TODOS.md)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Supabase-blue)](./docs/TECHNICAL_STATUS.md)

---

## 🚀 QUICK START

### **Para Desarrollo Local:**
```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
# → http://localhost:5174

# Build para producción
npm run build
```

### **URLs de Producción:**
- **🌐 App Principal:** https://venta-herramientas.vercel.app/
- **👨‍💼 Panel Admin:** https://venta-herramientas.vercel.app/admin

### **🔑 Credenciales de Prueba:**
- **Super Admin:** alfredojrd86@gmail.com
- **Tenant Owner:** tompyviruta@gmail.com

---

## 📋 ESTADO ACTUAL

### **✅ Funcionando (70% MVP):**
- Sistema de autenticación multi-rol
- Multi-tenancy con Supabase
- Carrito de compras con UX optimizada
- Panel administrativo con UI profesional
- Deploy estable en Vercel
- Integración básica con WhatsApp

### **🔥 Crítico para MVP (30% restante):**
- Carga real de tenants en AdminDashboard
- CRUD completo de productos
- Sistema de orders/pedidos
- Checkout funcional con MercadoPago

---

## 🛠️ STACK TECNOLÓGICO

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **Deploy:** Vercel + Supabase BaaS
- **Build Tool:** Vite

---

## 📚 DOCUMENTACIÓN

### **🎯 Para Empezar:**
- **[⚡ Quick Start](./docs/QUICK_START.md)** - Guía rápida para retomar el proyecto
- **[📋 Project TODOs](./docs/PROJECT_TODOS.md)** - Lista completa de tareas hacia MVP

### **🔧 Información Técnica:**
- **[🔧 Technical Status](./docs/TECHNICAL_STATUS.md)** - Estado técnico y arquitectura
- **[✅ Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)** - Lista pre-deploy

### **📊 Gestión de Proyecto:**
- **[📊 GitHub Projects Setup](./docs/GITHUB_PROJECTS_SETUP.md)** - Configurar backlog visual
- **[📊 GitHub Board Preview](./docs/GITHUB_BOARD_PREVIEW.md)** - Vista previa del board

### **📖 Ver Todos los Docs:**
- **[📚 Índice Completo](./docs/README.md)** - Todos los documentos organizados
- **[🗄️ Database Scripts](./database/README.md)** - Scripts SQL y configuración de BD

---

## 🎯 OBJETIVO

### **🏪 MVP - Plataforma SaaS Multi-Tenant:**
- **Super Admin:** Gestiona múltiples tiendas
- **Tenant Owner:** Gestiona su tienda de herramientas  
- **Customers:** Compran a través de WhatsApp/MercadoPago
- **Deploy:** Aplicación estable y escalable

### **📅 Timeline:**
- **MVP v1.0:** 4 semanas (funcionalidades core)
- **MVP v1.1:** 6 semanas (mejoras UX)
- **v2.0:** 3 meses (features avanzadas)

---

## 🚀 COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo
npm run build              # Build para producción
npm run preview            # Preview del build

# Git
git status                 # Ver cambios
git log --oneline -5       # Últimos commits

# GitHub Projects (requiere gh CLI)
./create-github-issues.sh  # Crear issues automáticamente
```

---

## 👨‍💻 DESARROLLADOR

**Alfredo Rebolledo** - ARdev  
- **Portfolio:** https://ajrddev.vercel.app/
- **Email:** alfredojrd86@gmail.com

---

## 📊 PROGRESO HACIA MVP

```
████████████████████████████████░░░░ 70% Completado

✅ Auth & Roles            ✅ Multi-tenancy
✅ Product Grid            ✅ Shopping Cart  
✅ UI/UX Polish            ✅ Deploy Setup
🔥 Admin CRUD              🔥 Orders System
🔥 Checkout Real           🔥 MercadoPago
```

---

**🎯 PRÓXIMO PASO:** Leer [📋 Project TODOs](./docs/PROJECT_TODOS.md) para ver qué hacer a continuación.

**🚀 META:** MVP completo en 2-4 semanas máximo.
