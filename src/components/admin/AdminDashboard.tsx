import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../../types/tenant';
import { useAuth } from '../../contexts/AuthContext';
import { TenantService } from '../../services/tenantService';
import TenantList from './TenantList';
import TenantEditor from './TenantEditor';
import DashboardStats from './DashboardStats';
import TenantPreview from './TenantPreview';
import ProductManager from './ProductManager';
import SupabaseSetup from './SupabaseSetup';
import OwnersHierarchy from './OwnersHierarchy';

// Los tenants ahora se cargan desde Supabase

type DashboardView = 'overview' | 'tenants' | 'create' | 'edit' | 'preview' | 'products' | 'setup' | 'hierarchy';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  // Calcular tenants válidos (misma lógica que TenantList)
  const validTenants = tenants.filter(tenant => 
    tenant && 
    tenant.id && 
    tenant.business && 
    tenant.slug && 
    tenant.branding && 
    tenant.product
  );

  // Cargar tenants reales desde Supabase
  useEffect(() => {
    const loadTenants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Solo super_admin puede ver todos los tenants
        if (user?.role === 'super_admin') {
          const allTenants = await TenantService.getAllTenants();
          setTenants(allTenants);
        } else {
          // Tenant owners solo ven su propio tenant
          const userTenants = await TenantService.getUserTenants();
          setTenants(userTenants);
        }
      } catch (error) {
        console.error('Error loading tenants:', error);
        setError('Error al cargar tenants');
        setTenants([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadTenants();
    }
  }, [user]);

  const handleCreateTenant = async (tenantData: Partial<TenantConfig>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Asignar el owner_id del usuario autenticado
      const tenantWithOwner = {
        ...tenantData,
        ownerId: user?.id // Asignar el ID del usuario actual
      };
      
      const newTenant = await TenantService.createTenant(tenantWithOwner);
      setTenants(prev => [...prev, newTenant]);
      setCurrentView('tenants');
      
      // Mostrar mensaje de éxito
      alert('Tenant creado exitosamente');
    } catch (error) {
      console.error('Error creating tenant:', error);
      setError('Error al crear tenant');
      alert('Error al crear tenant: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTenant = async (tenantId: string, updates: Partial<TenantConfig>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedTenant = await TenantService.updateTenant(tenantId, updates);
      setTenants(prev => prev.map(tenant => 
        tenant.id === tenantId ? updatedTenant : tenant
      ));
      setCurrentView('tenants');
      setSelectedTenant(null);
      
      // Mostrar mensaje de éxito
      alert('Tenant actualizado exitosamente');
    } catch (error) {
      console.error('Error updating tenant:', error);
      setError('Error al actualizar tenant');
      alert('Error al actualizar tenant: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tenant? Esta acción no se puede deshacer.')) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await TenantService.deleteTenant(tenantId);
      setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
      
      // Mostrar mensaje de éxito
      alert('Tenant eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setError('Error al eliminar tenant');
      alert('Error al eliminar tenant: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardStats tenants={validTenants} />;
      
      case 'tenants':
        return (
          <TenantList 
            tenants={tenants}
            onEdit={(tenant) => {
              setSelectedTenant(tenant);
              setCurrentView('edit');
            }}
            onPreview={(tenant) => {
              setSelectedTenant(tenant);
              setCurrentView('preview');
            }}
            onDelete={handleDeleteTenant}
          />
        );
      
      case 'create':
        return (
          <TenantEditor 
            onSave={handleCreateTenant}
            onCancel={() => setCurrentView('tenants')}
          />
        );
      
      case 'edit':
        return selectedTenant ? (
          <TenantEditor 
            tenant={selectedTenant}
            onSave={(updates) => handleUpdateTenant(selectedTenant.id, updates)}
            onCancel={() => {
              setSelectedTenant(null);
              setCurrentView('tenants');
            }}
          />
        ) : null;
      
      case 'preview':
        return selectedTenant ? (
          <TenantPreview 
            tenant={selectedTenant}
            onClose={() => {
              setSelectedTenant(null);
              setCurrentView('tenants');
            }}
          />
        ) : null;
      
      case 'products': {
        // Usar el tenant ID real
        const tenantId = '7eac9d78-ebe1-4a6e-82b6-001d34badc25';
        return (
          <ProductManager tenantId={tenantId} />
        );
      }
      
      case 'setup':
        return <SupabaseSetup />;
      
      case 'hierarchy':
        return <OwnersHierarchy />;
      
      default:
        return <DashboardStats tenants={validTenants} />;
    }
  };

  if (isLoading && currentView === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mejorado */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel Administrativo
                </h1>
                <p className="text-sm text-gray-600">
                  Gestiona tu plataforma SaaS desde aquí
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {currentView === 'tenants' && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nuevo Tenant
                </button>
              )}
              
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {validTenants.length} tenant{validTenants.length !== 1 ? 's' : ''}
                  {tenants.length !== validTenants.length && (
                    <span className="text-xs text-orange-600 ml-1">
                      ({tenants.length - validTenants.length} con datos incompletos)
                    </span>
                  )}
                </span>
              </div>

              {/* User Menu Mejorado */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0) || user?.avatar || '👤'}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name || 'Usuario'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role === 'super_admin' ? 'Super Admin' : 
                       user?.role === 'tenant_owner' ? 'Admin' :
                       user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                  title="Cerrar sesión"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Mejorada */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { 
                key: 'overview', 
                label: 'Resumen', 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              { 
                key: 'products', 
                label: 'Productos', 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              { 
                key: 'tenants', 
                label: 'Tiendas', 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              { 
                key: 'hierarchy', 
                label: 'Jerarquía', 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              { 
                key: 'setup', 
                label: 'Configuración', 
                icon: (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as DashboardView)}
                className={`inline-flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                  currentView === item.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && currentView !== 'overview' ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Procesando...</span>
          </div>
        ) : (
          renderCurrentView()
        )}
      </main>
    </div>
  );
}
