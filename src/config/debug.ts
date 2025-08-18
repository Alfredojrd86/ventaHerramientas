// 🔧 Configuración de Debug
// Controla qué componentes de debug están habilitados

export const DEBUG_CONFIG = {
  // Habilitar debug solo en desarrollo
  ENABLED: process.env.NODE_ENV === 'development',
  
  // Controles específicos por componente
  COMPONENTS: {
    SESSION_DEBUG: false,      // Debug de sesiones de autenticación
    DIAGNOSTIC_PANEL: false,   // Panel de diagnóstico de productos  
    DEBUG_INFO: false,         // Información general de debug
    CONSOLE_LOGS: false,       // Console.log en AuthContext
  },
  
  // URLs donde se permite debug (solo en desarrollo)
  ALLOWED_HOSTS: [
    'localhost',
    '127.0.0.1',
    '192.168.',  // Red local
  ],
  
  // Función para verificar si debug está permitido
  isAllowed(): boolean {
    if (!this.ENABLED) return false;
    
    const hostname = window.location.hostname;
    return this.ALLOWED_HOSTS.some(host => hostname.includes(host));
  },
  
  // Función para habilitar debug específico
  enable(component: keyof typeof DEBUG_CONFIG.COMPONENTS): boolean {
    if (!this.isAllowed()) return false;
    return this.COMPONENTS[component];
  }
};

// Hook para usar debug de manera segura
export const useDebugConfig = () => {
  return {
    isEnabled: DEBUG_CONFIG.isAllowed(),
    canShow: (component: keyof typeof DEBUG_CONFIG.COMPONENTS) => {
      return DEBUG_CONFIG.enable(component);
    },
    log: (message: string, data?: any) => {
      if (DEBUG_CONFIG.COMPONENTS.CONSOLE_LOGS && DEBUG_CONFIG.isAllowed()) {
        console.log(`🔧 [${new Date().toLocaleTimeString()}] ${message}`, data);
      }
    }
  };
};
