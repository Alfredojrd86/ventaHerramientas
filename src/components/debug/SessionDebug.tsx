import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

export default function SessionDebug() {
  const { user } = useAuth();

  const handleRefreshSession = async () => {
    console.log('🔄 Refrescando sesión...');
    
    try {
      // Primero cerrar sesión
      await supabase.auth.signOut();
      
      // Esperar un momento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirigir al login para que inicie sesión de nuevo
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ Error al refrescar sesión:', error);
    }
  };

  const handleGetCurrentSession = async () => {
    const { data } = await supabase.auth.getSession();
    console.log('📊 Sesión actual completa:', {
      user: data.session?.user,
      raw_user_meta_data: data.session?.user?.raw_user_meta_data,
      role: data.session?.user?.raw_user_meta_data?.role
    });
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">🔧 Debug de Sesión</h3>
      
      <div className="text-xs text-yellow-700 mb-3">
        <p><strong>Usuario actual:</strong> {user?.email}</p>
        <p><strong>Rol detectado:</strong> {user?.role}</p>
        <p><strong>Rol esperado:</strong> super_admin</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleRefreshSession}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          🔄 Re-Login Completo
        </button>
        
        <button
          onClick={handleGetCurrentSession}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          📊 Ver Sesión en Consola
        </button>
      </div>
      
      <p className="text-xs text-yellow-600 mt-2">
        ⚠️ raw_user_meta_data está undefined. Usa "Re-Login Completo" para cargar datos frescos.
      </p>
    </div>
  );
}
