// 🔧 Debug Components - Solo para desarrollo
// NUNCA importar en producción

// Componentes de debug disponibles
export { default as DebugInfo } from './DebugInfo';
export { default as DiagnosticPanel } from './DiagnosticPanel';  
export { default as SessionDebug } from './SessionDebug';

// Función helper para debug condicional
export const isDebugMode = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.REACT_APP_DEBUG === 'true';
};

// Hook para debug condicional
export const useDebug = () => {
  return {
    isEnabled: isDebugMode(),
    log: (message: string, data?: any) => {
      if (isDebugMode()) {
        console.log(`🔧 DEBUG: ${message}`, data);
      }
    },
    warn: (message: string, data?: any) => {
      if (isDebugMode()) {
        console.warn(`⚠️ DEBUG: ${message}`, data);
      }
    },
    error: (message: string, data?: any) => {
      if (isDebugMode()) {
        console.error(`❌ DEBUG: ${message}`, data);
      }
    }
  };
};
