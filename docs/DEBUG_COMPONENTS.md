# 🔧 Componentes de Debug

Esta carpeta contiene todos los componentes utilizados para debugging y desarrollo. **NUNCA deben ir a producción**.

## 📋 Componentes Disponibles

### 🔍 `DebugInfo.tsx`
- **Propósito:** Mostrar información general de debug de la aplicación
- **Uso:** Información del estado global, configuraciones
- **Ubicación original:** `src/components/DebugInfo.tsx`

### 🩺 `DiagnosticPanel.tsx`
- **Propósito:** Panel de diagnóstico para problemas de carga de productos
- **Uso:** Verificar conexión Supabase, tenant config, conteo de productos
- **Ubicación original:** `src/components/DiagnosticPanel.tsx`
- **Creado para:** Resolver problemas de pantalla en blanco con productos

### 🔐 `SessionDebug.tsx`
- **Propósito:** Debug de sesiones de autenticación y roles de usuario
- **Uso:** Refrescar sesiones, ver metadatos de usuario, resolver problemas de roles
- **Ubicación original:** `src/components/admin/SessionDebug.tsx`
- **Creado para:** Resolver problemas de roles no actualizados en cache

## 🚨 Importante - Seguridad en Producción

### ❌ NO HACER:
- Importar estos componentes en código de producción
- Dejar console.log activos en producción
- Exponer información sensible en la UI

### ✅ BUENAS PRÁCTICAS:
- Usar solo en desarrollo local
- Comentar/remover antes de commits importantes
- Mantener organizados en esta carpeta
- Documentar el propósito de cada componente

## 🔧 Cómo Usar los Componentes de Debug

### Para SessionDebug:
```tsx
// Solo en desarrollo
import SessionDebug from '../debug/SessionDebug';

// En el componente (solo temporalmente)
{process.env.NODE_ENV === 'development' && <SessionDebug />}
```

### Para DiagnosticPanel:
```tsx
// Solo en desarrollo
import DiagnosticPanel from '../debug/DiagnosticPanel';

// En el componente (comentado para producción)
{/* <DiagnosticPanel /> */}
```

## 📝 Historial de Uso

### SessionDebug
- **Creado:** Para resolver problema de roles no actualizados
- **Problema:** raw_user_meta_data undefined en sesión cache
- **Solución:** Forzar re-login completo

### DiagnosticPanel  
- **Creado:** Para diagnosticar productos no cargando
- **Problema:** Pantalla en blanco en ProductGrid
- **Solución:** Verificar conexión y configuración tenant

### DebugInfo
- **Creado:** Para información general de debug
- **Uso:** Estado global de la aplicación

## 🎯 Reglas de Uso

1. **Desarrollo únicamente** - Nunca en producción
2. **Documentar propósito** - Cada componente debe tener su razón de ser
3. **Limpiar después** - Remover cuando se resuelva el problema
4. **Organizar aquí** - Todos los debugs en esta carpeta
5. **No hardcodear** - Usar variables de entorno cuando sea posible
