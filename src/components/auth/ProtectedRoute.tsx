import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly requireAdmin?: boolean;
  readonly requiredTenantId?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requiredTenantId 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, canAccessAdmin, canManageTenant } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permisos de admin si es requerido
  if (requireAdmin && !canAccessAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección del sistema.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              ← Volver
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              🏠 Ir a la tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar permisos específicos de tenant si es requerido
  if (requiredTenantId && !canManageTenant(requiredTenantId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tienda No Autorizada
          </h1>
          <p className="text-gray-600 mb-6">
            No tienes permisos para gestionar esta tienda específica.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
}
