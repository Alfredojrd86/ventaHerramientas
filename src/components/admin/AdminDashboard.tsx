import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../../types/tenant';
import { useAuth } from '../../contexts/AuthContext';
import TenantList from './TenantList';
import TenantEditor from './TenantEditor';
import DashboardStats from './DashboardStats';
import TenantPreview from './TenantPreview';
import ProductManager from './ProductManager';
import SupabaseSetup from './SupabaseSetup';

// Simulación de datos de tenants para el demo
const DEMO_TENANTS: TenantConfig[] = [
  {
    id: 'carpinteria-demo',
    slug: 'carpinteria',
    domain: 'carpinteria.mitienda.com',
    status: 'active',
    plan: 'professional',
    branding: {
      logo: '/logo-carpinteria.png',
      primaryColor: '#1e40af',
      secondaryColor: '#1e3a8a',
      accentColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
    },
    business: {
      name: 'Herramientas Profesionales Premium',
      industry: 'carpinteria',
      description: 'Herramientas de carpintería y construcción de primera calidad',
      currency: 'CLP',
      language: 'es',
      timezone: 'America/Santiago',
      contactInfo: {
        phone: '+56 9 1234 5678',
        email: 'ventas@herramientas-pro.cl',
        address: 'Av. Principal 123',
        city: 'Santiago',
        region: 'Región Metropolitana',
        whatsapp: '+56 9 1234 5678',
      },
    },
    features: {
      enableWishlist: true,
      enableFilters: true,
      enableMultiCurrency: false,
      enableReviews: true,
      enableInventoryTracking: true,
      enableDiscountCodes: true,
      enableGuestCheckout: true,
      enableSocialLogin: false,
    },
    payment: {
      methods: ['mercadopago', 'bank_transfer'],
      currencies: ['CLP'],
      taxRate: 0.19,
      shippingCost: 8000,
      freeShippingThreshold: 50000,
    },
    product: {
      customFields: [],
      categories: ['Sierras', 'Fresadoras', 'Lijadoras', 'Prensas'],
      conditions: ['Nuevo', 'Usado - Excelente', 'Usado - Buen Estado'],
      brands: ['Makita', 'Bosch', 'DeWalt', 'Milwaukee'],
      defaultImagePlaceholder: '/placeholder-tool.jpg',
    },
    layout: {
      headerStyle: 'hero',
      footerStyle: 'extended',
      productGridLayout: 'grid',
      productsPerPage: 12,
      showProductCode: true,
      showStock: true,
      showDiscount: true,
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    ownerId: 'owner-1',
  },
  {
    id: 'electronica-demo',
    slug: 'electronica',
    domain: undefined,
    status: 'active',
    plan: 'starter',
    branding: {
      logo: '/logo-electronica.png',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      accentColor: '#ef4444',
      fontFamily: 'Roboto, sans-serif',
    },
    business: {
      name: 'TechStore Electrónicos',
      industry: 'electronica',
      description: 'Los mejores productos electrónicos y gadgets',
      currency: 'USD',
      language: 'es',
      timezone: 'America/Mexico_City',
      contactInfo: {
        phone: '+52 55 1234 5678',
        email: 'ventas@techstore.mx',
        address: 'Calle Tecnología 456',
        city: 'Ciudad de México',
        region: 'CDMX',
      },
    },
    features: {
      enableWishlist: true,
      enableFilters: true,
      enableMultiCurrency: true,
      enableReviews: false,
      enableInventoryTracking: true,
      enableDiscountCodes: false,
      enableGuestCheckout: true,
      enableSocialLogin: true,
    },
    payment: {
      methods: ['stripe', 'paypal'],
      currencies: ['USD', 'MXN'],
      taxRate: 0.16,
      shippingCost: 150,
      freeShippingThreshold: 1000,
    },
    product: {
      customFields: [
        { id: 'warranty', name: 'Garantía', type: 'text', required: false },
        { id: 'model', name: 'Modelo', type: 'text', required: true },
      ],
      categories: ['Smartphones', 'Laptops', 'Accesorios', 'Gaming'],
      conditions: ['Nuevo', 'Reacondicionado', 'Usado'],
      brands: ['Apple', 'Samsung', 'Sony', 'LG'],
      defaultImagePlaceholder: '/placeholder-electronics.jpg',
    },
    layout: {
      headerStyle: 'standard',
      footerStyle: 'minimal',
      productGridLayout: 'list',
      productsPerPage: 20,
      showProductCode: false,
      showStock: false,
      showDiscount: true,
    },
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    ownerId: 'owner-2',
  }
];

type DashboardView = 'overview' | 'tenants' | 'create' | 'edit' | 'preview' | 'products' | 'setup';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tenants, setTenants] = useState<TenantConfig[]>(DEMO_TENANTS);
  const [currentView, setCurrentView] = useState<DashboardView>('setup');
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateTenant = async (tenantData: Partial<TenantConfig>) => {
    setIsLoading(true);
    
    // Simular creación de tenant
    const newTenant: TenantConfig = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as TenantConfig;

    setTimeout(() => {
      setTenants(prev => [...prev, newTenant]);
      setCurrentView('tenants');
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateTenant = async (tenantId: string, updates: Partial<TenantConfig>) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setTenants(prev => prev.map(tenant => 
        tenant.id === tenantId 
          ? { ...tenant, ...updates, updatedAt: new Date().toISOString() }
          : tenant
      ));
      setCurrentView('tenants');
      setSelectedTenant(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tenant?')) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
      setIsLoading(false);
    }, 500);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardStats tenants={tenants} />;
      
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
      
      default:
        return <DashboardStats tenants={tenants} />;
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🏢 Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Gestiona todos tus tenants desde aquí
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {currentView === 'tenants' && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  + Nuevo Tenant
                </button>
              )}
              
              <div className="text-sm text-gray-500">
                {tenants.length} tenant{tenants.length !== 1 ? 's' : ''}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.avatar} {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.role === 'super_admin' ? 'Super Administrador' : 
                     user?.role === 'admin' ? 'Administrador' : 'Dueño de Tienda'}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'setup', label: '⚙️ Configurar', icon: '⚙️' },
              { key: 'products', label: '🔧 Productos', icon: '🔧' },
              { key: 'overview', label: '📊 Resumen', icon: '📊' },
              { key: 'tenants', label: '🏪 Tenants', icon: '🏪' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as DashboardView)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  currentView === item.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
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
