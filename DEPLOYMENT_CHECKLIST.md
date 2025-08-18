# ✅ Lista de Verificación antes de Deployment

## 🚨 Elementos Críticos a Revisar

### 🔧 Debug y Desarrollo
- [ ] **No hay imports de `src/components/debug/`** en componentes de producción
- [ ] **No hay `console.log`** activos en el código
- [ ] **No hay componentes de debug** renderizados en la UI
- [ ] **Variables de debug** están deshabilitadas

### 🔍 Archivos a Verificar

#### `src/components/admin/AdminDashboard.tsx`
```bash
# Verificar que NO contenga:
grep -n "SessionDebug\|Debug de Sesión" src/components/admin/AdminDashboard.tsx
```

#### `src/contexts/AuthContext.tsx`
```bash
# Verificar que NO contenga console.log activos:
grep -n "console.log" src/contexts/AuthContext.tsx
```

#### `src/App.tsx`
```bash
# Verificar que imports de debug estén comentados:
grep -n "components/debug\|DiagnosticPanel\|DebugInfo" src/App.tsx
```

### 🔐 Configuraciones de Seguridad
- [ ] **Variables de entorno** configuradas en Vercel
- [ ] **Claves de Supabase** no hardcodeadas
- [ ] **Roles de usuario** funcionando correctamente

### 🎯 Funcionalidades Core
- [ ] **Login** funciona para super_admin y tenant_owner
- [ ] **ProductGrid** carga productos correctamente
- [ ] **Carrito flotante** funciona sin modales automáticos
- [ ] **Rutas protegidas** funcionan (`/admin`, `/login`)

## 🚀 Comandos de Verificación Rápida

### Buscar Debugs Activos:
```bash
# Buscar todos los console.log
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "console.log"

# Buscar imports de debug
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "components/debug"

# Buscar componentes de debug renderizados
find src -name "*.tsx" | xargs grep -l "SessionDebug\|DiagnosticPanel\|DebugInfo"
```

### Verificar Configuraciones:
```bash
# Ver variables de entorno
grep -r "VITE_" src/

# Ver configuraciones de debug
grep -r "DEBUG_CONFIG" src/
```

## 📋 Checklist Pre-Commit

### ✅ Antes de hacer `git commit`:
1. **Revisar cambios:** `git diff --cached`
2. **Buscar debugs:** Ejecutar comandos de verificación
3. **Probar localmente:** Verificar que todo funciona
4. **Revisar console:** No debe haber logs de debug

### ✅ Antes de hacer `git push`:
1. **Build exitoso:** `npm run build`
2. **No warnings críticos** en el build
3. **Archivos debug** no incluidos en el bundle
4. **Variables de entorno** configuradas en Vercel

## 🎯 Estructura Segura

### ✅ CORRECTO:
```
src/
├── components/
│   ├── debug/          ← Solo para desarrollo
│   │   ├── README.md
│   │   ├── SessionDebug.tsx
│   │   └── ...
│   ├── admin/
│   │   └── AdminDashboard.tsx  ← SIN imports de debug
│   └── ...
└── config/
    └── debug.ts        ← Configuración centralizada
```

### ❌ INCORRECTO:
```tsx
// En AdminDashboard.tsx (MALO)
import SessionDebug from './SessionDebug';  // ❌
<SessionDebug />  // ❌

// En AuthContext.tsx (MALO)  
console.log('Debug info:', data);  // ❌
```

## 🔄 Flujo de Deployment Seguro

1. **Desarrollo local** → Usar debugs libremente
2. **Pre-commit** → Ejecutar checklist
3. **Commit** → Sin debugs activos
4. **Push** → Trigger build automático
5. **Vercel deploy** → Verificar que funciona
6. **Post-deploy** → Probar funcionalidades core

## 🆘 Si algo sale mal:

### Debug fue a producción:
1. **Rollback rápido:** `git revert HEAD`
2. **Push inmediato:** `git push`
3. **Verificar deploy:** Esperar que Vercel actualice
4. **Arreglar local:** Remover debugs y re-deploy

### Variables no funcionan:
1. **Verificar Vercel:** Dashboard → Settings → Environment Variables
2. **Re-deploy:** Trigger manual rebuild
3. **Verificar logs:** Vercel Function Logs

¡Siempre mejor prevenir que lamentar! 🛡️
