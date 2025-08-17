import React from 'react';
import { TenantConfig } from '../../types/tenant';

interface TenantPreviewProps {
  readonly tenant: TenantConfig;
  readonly onClose: () => void;
}

export default function TenantPreview({ tenant, onClose }: TenantPreviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(tenant.business.language === 'es' ? 'es-CL' : 'en-US', {
      style: 'currency',
      currency: tenant.business.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Mock product for preview
  const mockProduct = {
    id: 1,
    code: 'DEMO-001',
    name: 'Producto de Demostración',
    condition: 'Nuevo',
    originalPrice: 150000,
    price: 120000,
    description: 'Este es un producto de ejemplo para mostrar cómo se ve la tienda',
    features: ['Característica 1', 'Característica 2', 'Característica 3'],
    urgency: '¡Oferta limitada!',
    ctaText: 'Comprar Ahora',
    discount: '-20%',
    image: 'https://via.placeholder.com/300x200?text=Producto+Demo',
    stock: 5
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Vista Previa: {tenant.business.name}
            </h2>
            <p className="text-gray-600">
              {tenant.slug} • {tenant.business.industry}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Simulated Browser */}
          <div className="bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Browser Bar */}
              <div className="bg-gray-200 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                  {tenant.domain || `${tenant.slug}.mitienda.com`}
                </div>
              </div>

              {/* Simulated Website */}
              <div 
                className="min-h-screen"
                style={{
                  fontFamily: tenant.branding.fontFamily,
                  '--color-primary': tenant.branding.primaryColor,
                  '--color-secondary': tenant.branding.secondaryColor,
                  '--color-accent': tenant.branding.accentColor,
                } as React.CSSProperties}
              >
                {/* Hero Section Preview */}
                <div 
                  className="relative text-white py-16 px-8"
                  style={{
                    background: `linear-gradient(135deg, ${tenant.branding.primaryColor}, ${tenant.branding.secondaryColor})`,
                  }}
                >
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">
                      {tenant.business.name}
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                      {tenant.business.description}
                    </p>
                    <button 
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-colors"
                      style={{ backgroundColor: tenant.branding.accentColor }}
                    >
                      Ver Productos
                    </button>
                  </div>
                </div>

                {/* Product Grid Preview */}
                <div className="py-16 px-8 bg-gray-50">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12" style={{ color: tenant.branding.primaryColor }}>
                      Nuestros Productos
                    </h2>
                    
                    <div className={
                      tenant.layout.productGridLayout === 'list' 
                        ? 'space-y-6' 
                        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    }>
                      {/* Mock Products */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <img 
                            src={`https://via.placeholder.com/300x200?text=Producto+${i}`}
                            alt={`Producto ${i}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-6">
                            {tenant.layout.showProductCode && (
                              <div className="text-xs text-gray-500 mb-2 font-mono">
                                DEMO-00{i}
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-800 mb-2">
                              Producto de Demostración {i}
                            </h3>
                            <div className="mb-3">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Nuevo
                              </span>
                            </div>
                            <div className="mb-3">
                              {tenant.layout.showDiscount && (
                                <div className="text-sm text-gray-500 line-through">
                                  {formatPrice(150000)}
                                </div>
                              )}
                              <div className="text-lg font-bold" style={{ color: tenant.branding.primaryColor }}>
                                {formatPrice(120000)}
                              </div>
                            </div>
                            {tenant.layout.showStock && (
                              <div className="text-xs text-orange-600 mb-3">
                                Solo quedan 5 unidades
                              </div>
                            )}
                            <button 
                              className="w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors"
                              style={{ backgroundColor: tenant.branding.primaryColor }}
                            >
                              Agregar al Carrito
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features Preview */}
                <div className="py-16 px-8 bg-white">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12" style={{ color: tenant.branding.primaryColor }}>
                      Características Habilitadas
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(tenant.features).filter(([, enabled]) => enabled).map(([feature, enabled]) => (
                        <div key={feature} className="text-center p-6 border border-gray-200 rounded-lg">
                          <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-xl"
                               style={{ backgroundColor: tenant.branding.accentColor }}>
                            {getFeatureIcon(feature)}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {feature.replace('enable', '').replace(/([A-Z])/g, ' $1')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {enabled ? 'Habilitado' : 'Deshabilitado'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Section Preview */}
                <div 
                  className="py-16 px-8 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${tenant.branding.secondaryColor}, ${tenant.branding.primaryColor})`,
                  }}
                >
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Contáctanos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <div className="text-2xl mb-2">📞</div>
                        <p>{tenant.business.contactInfo.phone || 'Teléfono no configurado'}</p>
                      </div>
                      <div>
                        <div className="text-2xl mb-2">✉️</div>
                        <p>{tenant.business.contactInfo.email || 'Email no configurado'}</p>
                      </div>
                      <div>
                        <div className="text-2xl mb-2">📍</div>
                        <p>{tenant.business.contactInfo.city || 'Ciudad no configurada'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="p-6 bg-gray-50 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Configuración</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Información Básica</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Slug:</strong> {tenant.slug}</li>
                  <li><strong>Estado:</strong> {tenant.status}</li>
                  <li><strong>Plan:</strong> {tenant.plan}</li>
                  <li><strong>Dominio:</strong> {tenant.domain || `${tenant.slug}.mitienda.com`}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Configuración Regional</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Moneda:</strong> {tenant.business.currency}</li>
                  <li><strong>Idioma:</strong> {tenant.business.language}</li>
                  <li><strong>Zona Horaria:</strong> {tenant.business.timezone}</li>
                  <li><strong>Impuesto:</strong> {(tenant.payment.taxRate * 100).toFixed(1)}%</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Configuración de Productos</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Vista:</strong> {tenant.layout.productGridLayout}</li>
                  <li><strong>Por página:</strong> {tenant.layout.productsPerPage}</li>
                  <li><strong>Categorías:</strong> {tenant.product.categories.length}</li>
                  <li><strong>Marcas:</strong> {tenant.product.brands.length}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFeatureIcon(feature: string): string {
  const icons: Record<string, string> = {
    enableWishlist: '❤️',
    enableFilters: '🔍',
    enableMultiCurrency: '💱',
    enableReviews: '⭐',
    enableInventoryTracking: '📦',
    enableDiscountCodes: '🎫',
    enableGuestCheckout: '🛒',
    enableSocialLogin: '👤',
  };
  return icons[feature] || '⚙️';
}
