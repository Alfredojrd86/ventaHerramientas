import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TenantConfig, DEFAULT_TENANT_CONFIG } from '../types/tenant';

interface TenantContextType {
  tenant: TenantConfig;
  isLoading: boolean;
  error: string | null;
  updateTenant: (updates: Partial<TenantConfig>) => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  readonly children: ReactNode;
  readonly tenantSlug?: string; // Para identificar el tenant actual
  readonly initialConfig?: TenantConfig; // Para SSR o testing
}

export function TenantProvider({ 
  children, 
  tenantSlug = 'demo',
  initialConfig 
}: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig>(
    initialConfig || {
      ...DEFAULT_TENANT_CONFIG,
      id: 'demo-tenant',
      slug: tenantSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: 'demo-owner',
    }
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular carga de configuración del tenant
  // En producción, esto vendría de una API
  const loadTenantConfig = async (slug: string): Promise<TenantConfig> => {
    // Por ahora, devolvemos configuración de demo basada en tu app actual
    const demoConfig: TenantConfig = {
      id: 'carpinteria-demo',
      slug: 'carpinteria',
      domain: undefined,
      status: 'active',
      plan: 'professional',
      
      branding: {
        logo: '/logo-carpinteria.png',
        primaryColor: '#1e40af', // blue-800
        secondaryColor: '#1e3a8a', // blue-900  
        accentColor: '#3b82f6', // blue-500
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
        customFields: [
          {
            id: 'power',
            name: 'Potencia',
            type: 'text',
            required: false,
          },
          {
            id: 'warranty',
            name: 'Garantía',
            type: 'text',
            required: false,
          }
        ],
        categories: [
          'Sierras',
          'Fresadoras', 
          'Lijadoras',
          'Prensas',
          'Accesorios',
          'Discos y Fresas'
        ],
        conditions: [
          'Nuevo',
          'Usado - Excelente Estado',
          'Usado - Buen Estado',
          'Usado - Estado Regular'
        ],
        brands: ['Makita', 'Bosch', 'DeWalt', 'Milwaukee', 'Festool'],
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
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: 'demo-owner',
    };

    return demoConfig;
  };

  // Cargar configuración del tenant al montar
  useEffect(() => {
    if (!initialConfig) {
      setIsLoading(true);
      setError(null);
      
      loadTenantConfig(tenantSlug)
        .then(config => {
          setTenant(config);
          setError(null);
        })
        .catch(err => {
          console.error('Error loading tenant config:', err);
          setError('Error al cargar la configuración');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [tenantSlug, initialConfig]);

  // Aplicar theming CSS dinámico
  useEffect(() => {
    if (tenant?.branding) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', tenant.branding.primaryColor);
      root.style.setProperty('--color-secondary', tenant.branding.secondaryColor);
      root.style.setProperty('--color-accent', tenant.branding.accentColor);
      root.style.setProperty('--font-family', tenant.branding.fontFamily);
      
      // Actualizar título y favicon
      document.title = tenant.business.name;
      if (tenant.branding.favicon) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = tenant.branding.favicon;
        }
      }
    }
  }, [tenant]);

  const updateTenant = async (updates: Partial<TenantConfig>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // En producción, esto sería una llamada API
      const updatedTenant = {
        ...tenant,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      setTenant(updatedTenant);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error('Error updating tenant:', err);
      setError('Error al actualizar la configuración');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const config = await loadTenantConfig(tenant.slug);
      setTenant(config);
      
    } catch (err) {
      console.error('Error refreshing tenant:', err);
      setError('Error al recargar la configuración');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TenantContextType = React.useMemo(() => ({
    tenant,
    isLoading,
    error,
    updateTenant,
    refreshTenant,
  }), [tenant, isLoading, error, updateTenant, refreshTenant]);

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Hook para acceder fácilmente a configuraciones específicas
export function useTenantConfig() {
  const { tenant } = useTenant();
  
  return {
    branding: tenant.branding,
    business: tenant.business,
    features: tenant.features,
    payment: tenant.payment,
    product: tenant.product,
    layout: tenant.layout,
    
    // Helpers útiles
    formatPrice: (price: number) => {
      return new Intl.NumberFormat(tenant.business.language === 'es' ? 'es-CL' : 'en-US', {
        style: 'currency',
        currency: tenant.business.currency,
        minimumFractionDigits: 0,
      }).format(price);
    },
    
    isFeatureEnabled: (feature: keyof typeof tenant.features) => {
      return tenant.features[feature];
    },
    
    getContactInfo: () => tenant.business.contactInfo,
    
    getPrimaryColor: () => tenant.branding.primaryColor,
    getSecondaryColor: () => tenant.branding.secondaryColor,
  };
}
