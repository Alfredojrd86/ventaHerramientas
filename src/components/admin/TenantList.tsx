import React, { useState } from 'react';
import { TenantConfig } from '../../types/tenant';

interface TenantListProps {
  readonly tenants: TenantConfig[];
  readonly onEdit: (tenant: TenantConfig) => void;
  readonly onPreview: (tenant: TenantConfig) => void;
  readonly onDelete: (tenantId: string) => void;
}

export default function TenantList({ tenants, onEdit, onPreview, onDelete }: TenantListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');

  // Safety check for tenants data
  if (!tenants || !Array.isArray(tenants)) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay tenants disponibles o los datos no están cargados correctamente.
      </div>
    );
  }

  // Filter out invalid tenants (contactInfo is optional)
  const validTenants = tenants.filter(tenant => {
    const isValid = tenant && 
      tenant.id && 
      tenant.business && 
      tenant.slug && 
      tenant.branding && 
      tenant.product;
    
    if (!isValid) {
      console.warn('Invalid tenant found:', tenant);
      console.warn('Missing required fields:', {
        id: !tenant?.id,
        business: !tenant?.business,
        slug: !tenant?.slug,
        branding: !tenant?.branding,
        product: !tenant?.product
      });
    }
    
    return isValid;
  });

  const filteredTenants = validTenants.filter(tenant => {
    const matchesSearch = (tenant.business?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (tenant.slug?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (tenant.business?.industry?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              id="search"
              type="text"
              placeholder="Nombre, slug o industria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              id="plan"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPlan('all');
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Mostrando {filteredTenants.length} de {validTenants.length} tenant{validTenants.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tenants Grid */}
      {validTenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay tenants válidos
          </h3>
          <p className="text-gray-600">
            Los datos de los tenants están incompletos o corruptos. Verifica la base de datos.
          </p>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron tenants
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterPlan !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no tienes tenants creados'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => {
            // Skip rendering if tenant is missing required data (contactInfo is optional)
            if (!tenant || !tenant.business || !tenant.slug) {
              console.warn('Skipping tenant due to missing data:', tenant?.id);
              return null;
            }
            
            return (
            <div key={tenant.id || `tenant-${Math.random()}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Header with status and plan */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {tenant.business?.name || 'Sin nombre'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tenant.slug || 'sin-slug'} • {tenant.business?.industry || 'Sin industria'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status || 'inactive')}`}>
                      {tenant.status || 'inactive'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(tenant.plan || 'starter')}`}>
                      {tenant.plan || 'starter'}
                    </span>
                  </div>
                </div>

                {/* Color preview */}
                {tenant.branding && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-gray-500">Colores:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: tenant.branding.primaryColor || '#cccccc' }}
                        title="Color primario"
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: tenant.branding.secondaryColor || '#cccccc' }}
                        title="Color secundario"
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: tenant.branding.accentColor || '#cccccc' }}
                        title="Color de acento"
                      ></div>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Dominio:</span>
                    <span className="font-medium">
                      {tenant.domain || `${tenant.slug || 'tenant'}.mitienda.com`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creado:</span>
                    <span>{tenant.createdAt ? formatDate(tenant.createdAt) : 'No especificado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actualizado:</span>
                    <span>{tenant.updatedAt ? formatDate(tenant.updatedAt) : 'No especificado'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onPreview(tenant)}
                    className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    disabled={!tenant.id}
                  >
                    👁️ Ver
                  </button>
                  <button
                    onClick={() => onEdit(tenant)}
                    className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    disabled={!tenant.id}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => tenant.id && onDelete(tenant.id)}
                    className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    disabled={!tenant.id}
                  >
                    🗑️ Eliminar
                  </button>
                </div>

                {/* Quick stats */}
                {tenant.product && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Categorías:</span>
                        <span className="ml-1">{tenant.product.categories?.length || 0}</span>
                      </div>
                      <div>
                        <span className="font-medium">Marcas:</span>
                        <span className="ml-1">{tenant.product.brands?.length || 0}</span>
                      </div>
                      <div>
                        <span className="font-medium">Moneda:</span>
                        <span className="ml-1">{tenant.business?.currency || 'No especificada'}</span>
                      </div>
                      <div>
                        <span className="font-medium">País:</span>
                        <span className="ml-1">{tenant.business?.contactInfo?.city || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Contacto:</span>
                        <span className="ml-1">
                          {tenant.business?.contactInfo ? 
                            `${tenant.business.contactInfo.phone || 'Sin teléfono'} • ${tenant.business.contactInfo.email || 'Sin email'}`
                            : 'No especificado'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
