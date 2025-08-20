import { useState, useEffect } from 'react';
import { AdminService, OwnerInfo, TenantInfo } from '../../services/adminService';
import { Tool } from '../../types';
import SystemStats from './SystemStats';
import OwnerEditor from './OwnerEditor';
import TenantEditor from './TenantEditor';
import { useAuth } from '../../contexts/AuthContext';
import { OwnerData, OwnerService } from '../../services/ownerService';

export default function OwnersHierarchy() {
  const { user } = useAuth();
  const [owners, setOwners] = useState<OwnerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOwners, setExpandedOwners] = useState<Set<string>>(new Set());
  const [expandedTenants, setExpandedTenants] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOwner, setEditingOwner] = useState<OwnerData | null>(null);
  const [editingTenant, setEditingTenant] = useState<TenantInfo | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadOwnersHierarchy();
    }
  }, [user?.role]);

  const loadOwnersHierarchy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AdminService.getOwnersHierarchy();
      setOwners(data);
    } catch (err) {
      console.error('Error loading owners hierarchy:', err);
      setError('Error al cargar la información de owners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOwner = async (ownerId: string, updates: any) => {
    try {
      await OwnerService.updateOwner(ownerId, updates);
      await loadOwnersHierarchy(); // Recargar datos
      setEditingOwner(null);
    } catch (err) {
      console.error('Error updating owner:', err);
      setError('Error al actualizar el owner');
    }
  };

  const handleOwnerStatusChange = async (ownerId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await OwnerService.toggleOwnerStatus(ownerId, newStatus);
      await loadOwnersHierarchy(); // Recargar datos
    } catch (err) {
      console.error('Error changing owner status:', err);
      setError('Error al cambiar el estado del owner');
    }
  };

  const handleEditTenant = async (tenantId: string, updates: any) => {
    try {
      // Aquí se implementaría la actualización del tenant
      console.log('Updating tenant:', tenantId, updates);
      await loadOwnersHierarchy(); // Recargar datos
      setEditingTenant(null);
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError('Error al actualizar la tienda');
    }
  };

  const toggleOwnerExpansion = (ownerId: string) => {
    const newExpanded = new Set(expandedOwners);
    if (newExpanded.has(ownerId)) {
      newExpanded.delete(ownerId);
    } else {
      newExpanded.add(ownerId);
    }
    setExpandedOwners(newExpanded);
  };

  const toggleTenantExpansion = (tenantId: string) => {
    const newExpanded = new Set(expandedTenants);
    if (newExpanded.has(tenantId)) {
      newExpanded.delete(tenantId);
    } else {
      newExpanded.add(tenantId);
    }
    setExpandedTenants(newExpanded);
  };

  const filteredOwners = owners.filter(owner => 
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.tenants.some(tenant => 
      tenant.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Verificar acceso solo para super_admin
  if (user?.role !== 'super_admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Acceso Denegado</h3>
            <div className="mt-2 text-sm text-red-700">
              Solo los super administradores pueden acceder a esta vista.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando jerarquía de owners...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <button
                onClick={loadOwnersHierarchy}
                className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas del Sistema */}
      <SystemStats />
      
      {/* Header y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Jerarquía de Owners y Tiendas</h2>
            <p className="text-gray-600 mt-1">
              Vista completa del sistema: {owners.length} owner{owners.length !== 1 ? 's' : ''}, 
              {owners.reduce((total, owner) => total + owner.tenants.length, 0)} tienda{owners.reduce((total, owner) => total + owner.tenants.length, 0) !== 1 ? 's' : ''}, 
              {owners.reduce((total, owner) => total + owner.tenants.reduce((tTotal, tenant) => tTotal + tenant.productCount, 0), 0)} producto{owners.reduce((total, owner) => total + owner.tenants.reduce((tTotal, tenant) => tTotal + tenant.productCount, 0), 0) !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar owners o tiendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={loadOwnersHierarchy}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Owners */}
      <div className="space-y-4">
        {filteredOwners.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No hay owners o tiendas que coincidan con "${searchTerm}"` : 'No hay owners registrados en el sistema'}
            </p>
          </div>
        ) : (
                      filteredOwners.map((owner) => (
              <OwnerCard
                key={owner.id}
                owner={owner}
                isExpanded={expandedOwners.has(owner.id)}
                onToggleExpansion={() => toggleOwnerExpansion(owner.id)}
                expandedTenants={expandedTenants}
                onToggleTenantExpansion={toggleTenantExpansion}
                                 onEditOwner={(owner) => {
                   // Convertir OwnerInfo a OwnerData para el editor
                   const ownerData: OwnerData = {
                     id: owner.id,
                     email: owner.email,
                     name: owner.name,
                     role: owner.role,
                     status: 'active', // Por defecto
                     subscriptionStatus: 'active', // Por defecto
                     plan: 'starter', // Por defecto
                     tenantCount: owner.tenants.length,
                     createdAt: new Date().toISOString(),
                     updatedAt: new Date().toISOString()
                   };
                   setEditingOwner(ownerData);
                 }}
                 onEditTenant={(tenant) => setEditingTenant(tenant)}
               />
             ))
        )}
      </div>

      {/* Modal de Edición de Owner */}
      {editingOwner && (
        <OwnerEditor
          owner={editingOwner}
          onSave={handleEditOwner}
          onCancel={() => setEditingOwner(null)}
          onStatusChange={handleOwnerStatusChange}
        />
      )}

      {/* Modal de Edición de Tenant */}
      {editingTenant && (
        <TenantEditor
          tenant={{
            id: editingTenant.id,
            slug: editingTenant.slug,
            domain: undefined,
            status: editingTenant.status as 'active' | 'inactive' | 'suspended',
            plan: editingTenant.plan as 'starter' | 'professional' | 'enterprise',
            branding: {
              logo: '/default-logo.png',
              primaryColor: '#1e40af',
              secondaryColor: '#1e3a8a',
              accentColor: '#3b82f6',
              fontFamily: 'Inter, sans-serif',
            },
            business: {
              name: editingTenant.businessName,
              industry: 'general',
              description: 'Tienda en línea',
              currency: 'CLP',
              language: 'es',
              timezone: 'America/Santiago',
              contactInfo: {
                phone: '',
                email: '',
                address: '',
                city: '',
                region: '',
              },
            },
            features: {
              enableWishlist: true,
              enableFilters: true,
              enableMultiCurrency: false,
              enableReviews: false,
              enableInventoryTracking: true,
              enableDiscountCodes: false,
              enableGuestCheckout: true,
              enableSocialLogin: false,
            },
            payment: {
              methods: ['mercadopago'],
              currencies: ['CLP'],
              taxRate: 0.19,
              shippingCost: 8000,
              freeShippingThreshold: 50000,
            },
            product: {
              customFields: [],
              categories: ['General'],
              conditions: ['Nuevo', 'Usado - Excelente', 'Usado - Buen Estado'],
              brands: [],
              defaultImagePlaceholder: '/placeholder-product.jpg',
            },
            layout: {
              headerStyle: 'standard',
              footerStyle: 'standard',
              productGridLayout: 'grid',
              productsPerPage: 12,
              showProductCode: true,
              showStock: true,
              showDiscount: true,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: editingTenant.id,
          }}
          onSave={(updates) => handleEditTenant(editingTenant.id, updates)}
          onCancel={() => setEditingTenant(null)}
        />
      )}
    </div>
  );
}

interface OwnerCardProps {
  readonly owner: OwnerInfo;
  readonly isExpanded: boolean;
  readonly onToggleExpansion: () => void;
  readonly expandedTenants: Set<string>;
  readonly onToggleTenantExpansion: (tenantId: string) => void;
  readonly onEditOwner: (owner: OwnerInfo) => void;
  readonly onEditTenant: (tenant: TenantInfo) => void;
}

function OwnerCard({ owner, isExpanded, onToggleExpansion, expandedTenants, onToggleTenantExpansion, onEditOwner, onEditTenant }: OwnerCardProps) {
  const totalProducts = owner.tenants.reduce((total, tenant) => total + tenant.productCount, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header del Owner */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {owner.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{owner.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{owner.email}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {owner.role}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botón de Editar Owner */}
            <button
              onClick={() => onEditOwner(owner)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Editar Owner"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{owner.tenants.length}</div>
                <div className="text-sm text-gray-500">Tienda{owner.tenants.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                <div className="text-sm text-gray-500">Producto{totalProducts !== 1 ? 's' : ''}</div>
              </div>
              <button
                onClick={onToggleExpansion}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg 
                  className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50">
          <div className="space-y-4">
            {owner.tenants.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Este owner no tiene tiendas registradas
              </div>
            ) : (
                              owner.tenants.map((tenant) => (
                  <TenantCard
                    key={tenant.id}
                    tenant={tenant}
                    isExpanded={expandedTenants.has(tenant.id)}
                    onToggleExpansion={() => onToggleTenantExpansion(tenant.id)}
                    onEditTenant={onEditTenant}
                  />
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TenantCardProps {
  readonly tenant: TenantInfo;
  readonly isExpanded: boolean;
  readonly onToggleExpansion: () => void;
  readonly onEditTenant: (tenant: TenantInfo) => void;
}

function TenantCard({ tenant, isExpanded, onToggleExpansion, onEditTenant }: TenantCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header de la Tienda */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              🏪
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{tenant.businessName}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {tenant.slug}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  tenant.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.status}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {tenant.plan}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Botón de Editar Tienda */}
            <button
              onClick={() => onEditTenant(tenant)}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Editar Tienda"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{tenant.productCount}</div>
                <div className="text-xs text-gray-500">Productos</div>
              </div>
              <button
                onClick={onToggleExpansion}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg 
                  className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Productos expandibles */}
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50">
          {tenant.products.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Esta tienda no tiene productos registrados
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tenant.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  readonly product: Tool;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-16 w-16 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium text-gray-900 truncate">{product.name}</h5>
          <p className="text-xs text-gray-500 truncate">{product.code}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-green-600">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
