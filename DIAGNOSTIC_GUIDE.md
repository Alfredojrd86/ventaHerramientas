# 🔍 **Guía de Diagnóstico - Productos No Cargan**

## 📋 **Pasos para Diagnosticar**

### **1. Abrir la Aplicación**
```
http://127.0.0.1:5174/
```

### **2. Verificar Panel de Diagnóstico**
En la esquina superior derecha verás un panel con:

**✅ Escenario Exitoso:**
- ✅ Supabase: success
- ✅ Tenant: success: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
- ✅ Conteo: success: 12 productos
- ✅ Carga: success: 12 productos cargados

**❌ Escenario con Problemas:**
- ❌ Supabase: error: [mensaje de error]
- ❌ Tenant: warning: usando tenant demo
- ❌ Conteo: error: [mensaje de error]

### **3. Verificar Consola del Navegador (F12)**
Busca estos mensajes:
```
🔍 Test 1: Probando conexión a Supabase...
✅ Conexión exitosa
🔍 Test 2: Verificando tenant config...
Tenant ID: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
🔍 Test 3: Contando productos del tenant...
✅ Productos encontrados: 12
🔍 Test 4: Cargando productos con ProductService...
✅ Productos cargados: 12
```

### **4. Problemas Comunes y Soluciones**

#### **A. Error de Conexión a Supabase**
```
❌ Supabase: error: Failed to fetch
```
**Solución:**
1. Verificar que Supabase esté funcionando
2. Verificar las claves en `src/config/supabase.ts`

#### **B. Tenant Demo en Lugar del Real**
```
⚠️ Tenant: warning: usando tenant demo - demo-tenant
```
**Solución:**
1. El TenantContext no está encontrando el tenant real
2. Necesitas crear el tenant en Supabase

#### **C. Productos No Encontrados**
```
✅ Supabase: success
✅ Tenant: success: 7eac9d78-ebe1-4a6e-82b6-001d34badc25
❌ Conteo: success: 0 productos
```
**Solución:**
1. Los productos están en la DB pero con diferente tenant_id
2. Verificar que los productos tengan el tenant_id correcto

---

## 🔧 **Credenciales de Prueba**

### **Login Admin (Demo):**
- **Email:** `admin@demo.com`
- **Password:** `admin123`

### **Login Tenant (Demo):**
- **Email:** `tenant@demo.com`
- **Password:** `tenant123`

### **Login con Usuario Real de Supabase:**
- **Email:** El email que usaste en Supabase
- **Password:** La contraseña que configuraste

---

## 📊 **¿Qué Revisar Ahora?**

1. **Ve a la aplicación** → `http://127.0.0.1:5174/`
2. **Mira el panel de diagnóstico** (esquina superior derecha)
3. **Abre la consola** (F12) para ver logs detallados
4. **Reporta** exactamente qué ves:
   - ¿Qué dice cada línea del panel de diagnóstico?
   - ¿Qué errores aparecen en la consola?
   - ¿Ves algún producto en la página?

Con esta información podré identificar el problema exacto y solucionarlo. 🎯
