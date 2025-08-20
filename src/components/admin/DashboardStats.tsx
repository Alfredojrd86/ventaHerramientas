import React from 'react';
import { TenantConfig } from '../../types/tenant';

interface DashboardStatsProps {
  readonly tenants: TenantConfig[];
}

export default function DashboardStats({ tenants }: DashboardStatsProps) {
  // Calcular estadísticas
  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'active').length,
    inactive: tenants.filter(t => t.status === 'inactive').length,
    suspended: tenants.filter(t => t.status === 'suspended').length,
    starter: tenants.filter(t => t.plan === 'starter').length,
    professional: tenants.filter(t => t.plan === 'professional').length,
    enterprise: tenants.filter(t => t.plan === 'enterprise').length,
  };

  const industryStats = tenants.reduce((acc, tenant) => {
    const industry = tenant.business?.industry || 'Sin categoría';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTenants = [...tenants].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  const recentTenants = sortedTenants.slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Professional</p>
              <p className="text-2xl font-bold text-purple-600">{stats.professional}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">E</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enterprise</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.enterprise}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Estado de Tenants</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Activos</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Inactivos</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.inactive}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Suspendidos</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.suspended}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Distribución de Planes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Starter</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.starter}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Professional</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.professional}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Enterprise</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.enterprise}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Industrias</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(industryStats).map(([industry, count]) => (
                <div key={industry} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{industry}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tenants */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Tenants Recientes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTenants.map((tenant) => (
              <div key={tenant.id || `tenant-${Math.random()}`} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tenant.business?.name || 'Sin nombre'}</p>
                    <p className="text-xs text-gray-500">
                      {tenant.slug || 'sin-slug'} • {formatDate(tenant.createdAt || '')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status || 'inactive')}`}>
                      {tenant.status || 'inactive'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(tenant.plan || 'starter')}`}>
                      {tenant.plan || 'starter'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">+</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Nuevo Tenant</p>
              <p className="text-xs text-gray-500">Crear nueva tienda</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">📊</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Reportes</p>
              <p className="text-xs text-gray-500">Ver métricas detalladas</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">⚙️</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Configuración</p>
              <p className="text-xs text-gray-500">Ajustes del sistema</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
