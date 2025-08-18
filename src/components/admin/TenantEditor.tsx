import React, { useState, useEffect } from 'react';
import { TenantConfig, DEFAULT_TENANT_CONFIG } from '../../types/tenant';

interface TenantEditorProps {
  readonly tenant?: TenantConfig;
  readonly onSave: (tenantData: Partial<TenantConfig>) => void;
  readonly onCancel: () => void;
}

export default function TenantEditor({ tenant, onSave, onCancel }: TenantEditorProps) {
  const [formData, setFormData] = useState<Partial<TenantConfig>>(
    tenant || { ...DEFAULT_TENANT_CONFIG }
  );
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!tenant;

  useEffect(() => {
    if (tenant) {
      setFormData(tenant);
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      onSave(formData);
    } catch (error) {
      console.error('Error saving tenant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const tabs = [
    { id: 'basic', label: '🏢 Básico', icon: '🏢' },
    { id: 'branding', label: '🎨 Marca', icon: '🎨' },
    { id: 'business', label: '📞 Contacto', icon: '📞' },
    { id: 'features', label: '⚙️ Features', icon: '⚙️' },
    { id: 'payment', label: '💳 Pagos', icon: '💳' },
    { id: 'layout', label: '📱 Layout', icon: '📱' },
  ];

  const renderBasicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug (Identificador único) *
          </label>
          <input
            id="slug"
            type="text"
            value={formData.slug || ''}
            onChange={(e) => updateFormData('slug', e.target.value)}
            placeholder="mi-tienda"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Solo letras, números y guiones. No se puede cambiar después.
          </p>
        </div>

        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Dominio Personalizado
          </label>
          <input
            id="domain"
            type="text"
            value={formData.domain || ''}
            onChange={(e) => updateFormData('domain', e.target.value)}
            placeholder="mitienda.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="status"
            value={formData.status || 'active'}
            onChange={(e) => updateFormData('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
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
            value={formData.plan || 'starter'}
            onChange={(e) => updateFormData('plan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="starter">Starter - $29/mes</option>
            <option value="professional">Professional - $79/mes</option>
            <option value="enterprise">Enterprise - $199/mes</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBrandingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
            Color Primario
          </label>
          <div className="flex gap-2">
            <input
              id="primaryColor"
              type="color"
              value={formData.branding?.primaryColor || '#1e40af'}
              onChange={(e) => updateFormData('branding.primaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.branding?.primaryColor || '#1e40af'}
              onChange={(e) => updateFormData('branding.primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
            Color Secundario
          </label>
          <div className="flex gap-2">
            <input
              id="secondaryColor"
              type="color"
              value={formData.branding?.secondaryColor || '#1e3a8a'}
              onChange={(e) => updateFormData('branding.secondaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.branding?.secondaryColor || '#1e3a8a'}
              onChange={(e) => updateFormData('branding.secondaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
            Color de Acento
          </label>
          <div className="flex gap-2">
            <input
              id="accentColor"
              type="color"
              value={formData.branding?.accentColor || '#3b82f6'}
              onChange={(e) => updateFormData('branding.accentColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.branding?.accentColor || '#3b82f6'}
              onChange={(e) => updateFormData('branding.accentColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">
          Fuente
        </label>
        <select
          id="fontFamily"
          value={formData.branding?.fontFamily || 'Inter, sans-serif'}
          onChange={(e) => updateFormData('branding.fontFamily', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Open Sans, sans-serif">Open Sans</option>
          <option value="Poppins, sans-serif">Poppins</option>
          <option value="Montserrat, sans-serif">Montserrat</option>
        </select>
      </div>

      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
          Logo URL
        </label>
        <input
          id="logo"
          type="url"
          value={formData.branding?.logo || ''}
          onChange={(e) => updateFormData('branding.logo', e.target.value)}
          placeholder="https://ejemplo.com/logo.png"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Negocio *
          </label>
          <input
            id="businessName"
            type="text"
            value={formData.business?.name || ''}
            onChange={(e) => updateFormData('business.name', e.target.value)}
            placeholder="Mi Tienda Increíble"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industria
          </label>
          <select
            id="industry"
            value={formData.business?.industry || 'general'}
            onChange={(e) => updateFormData('business.industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="carpinteria">Carpintería</option>
            <option value="electronica">Electrónica</option>
            <option value="automotriz">Automotriz</option>
            <option value="hogar">Hogar y Jardín</option>
            <option value="deportes">Deportes</option>
            <option value="moda">Moda</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          value={formData.business?.description || ''}
          onChange={(e) => updateFormData('business.description', e.target.value)}
          placeholder="Describe tu negocio..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <select
            id="currency"
            value={formData.business?.currency || 'USD'}
            onChange={(e) => updateFormData('business.currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD - Dólar Americano</option>
            <option value="CLP">CLP - Peso Chileno</option>
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="EUR">EUR - Euro</option>
            <option value="ARS">ARS - Peso Argentino</option>
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Idioma
          </label>
          <select
            id="language"
            value={formData.business?.language || 'es'}
            onChange={(e) => updateFormData('business.language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Zona Horaria
          </label>
          <select
            id="timezone"
            value={formData.business?.timezone || 'America/Santiago'}
            onChange={(e) => updateFormData('business.timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="America/Santiago">Santiago (Chile)</option>
            <option value="America/Mexico_City">Ciudad de México</option>
            <option value="America/Buenos_Aires">Buenos Aires</option>
            <option value="America/New_York">Nueva York</option>
            <option value="Europe/Madrid">Madrid</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.business?.contactInfo?.phone || ''}
              onChange={(e) => updateFormData('business.contactInfo.phone', e.target.value)}
              placeholder="+56 9 1234 5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.business?.contactInfo?.email || ''}
              onChange={(e) => updateFormData('business.contactInfo.email', e.target.value)}
              placeholder="ventas@mitienda.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              id="city"
              type="text"
              value={formData.business?.contactInfo?.city || ''}
              onChange={(e) => updateFormData('business.contactInfo.city', e.target.value)}
              placeholder="Santiago"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={formData.business?.contactInfo?.whatsapp || ''}
              onChange={(e) => updateFormData('business.contactInfo.whatsapp', e.target.value)}
              placeholder="+56 9 1234 5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData.features || {}).map(([feature, enabled]) => (
          <label key={feature} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => updateFormData(`features.${feature}`, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">
                {feature.replace('enable', '').replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="text-sm text-gray-500">
                {getFeatureDescription(feature)}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const getFeatureDescription = (feature: string) => {
    const descriptions: Record<string, string> = {
      enableWishlist: 'Permite a los usuarios guardar productos favoritos',
      enableFilters: 'Sistema de filtros avanzado para productos',
      enableMultiCurrency: 'Soporte para múltiples monedas',
      enableReviews: 'Sistema de reseñas y calificaciones',
      enableInventoryTracking: 'Seguimiento de inventario en tiempo real',
      enableDiscountCodes: 'Códigos de descuento y cupones',
      enableGuestCheckout: 'Compra sin registro de usuario',
      enableSocialLogin: 'Inicio de sesión con redes sociales',
    };
    return descriptions[feature] || 'Característica adicional';
  };

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Métodos de Pago
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['mercadopago', 'stripe', 'paypal', 'bank_transfer'].map((method) => (
            <label key={method} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.payment?.methods?.includes(method) || false}
                onChange={(e) => {
                  const currentMethods = formData.payment?.methods || [];
                  const newMethods = e.target.checked
                    ? [...currentMethods, method]
                    : currentMethods.filter(m => m !== method);
                  updateFormData('payment.methods', newMethods);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="font-medium capitalize">{method.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
            Tasa de Impuesto (%)
          </label>
          <input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={((formData.payment?.taxRate || 0) * 100).toFixed(2)}
            onChange={(e) => updateFormData('payment.taxRate', parseFloat(e.target.value) / 100)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="shippingCost" className="block text-sm font-medium text-gray-700 mb-1">
            Costo de Envío
          </label>
          <input
            id="shippingCost"
            type="number"
            min="0"
            value={formData.payment?.shippingCost || 0}
            onChange={(e) => updateFormData('payment.shippingCost', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="headerStyle" className="block text-sm font-medium text-gray-700 mb-1">
            Estilo de Header
          </label>
          <select
            id="headerStyle"
            value={formData.layout?.headerStyle || 'standard'}
            onChange={(e) => updateFormData('layout.headerStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="minimal">Minimal</option>
            <option value="standard">Standard</option>
            <option value="hero">Hero</option>
          </select>
        </div>

        <div>
          <label htmlFor="productGridLayout" className="block text-sm font-medium text-gray-700 mb-1">
            Vista de Productos
          </label>
          <select
            id="productGridLayout"
            value={formData.layout?.productGridLayout || 'grid'}
            onChange={(e) => updateFormData('layout.productGridLayout', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="grid">Grid</option>
            <option value="list">Lista</option>
            <option value="masonry">Masonry</option>
          </select>
        </div>

        <div>
          <label htmlFor="productsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
            Productos por Página
          </label>
          <select
            id="productsPerPage"
            value={formData.layout?.productsPerPage || 12}
            onChange={(e) => updateFormData('layout.productsPerPage', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Mostrar en Productos
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'showProductCode', label: 'Código de Producto' },
            { key: 'showStock', label: 'Stock' },
            { key: 'showDiscount', label: 'Descuentos' },
          ].map((item) => (
            <label key={item.key} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.layout?.[item.key as keyof typeof formData.layout] || false}
                onChange={(e) => updateFormData(`layout.${item.key}`, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="font-medium">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'basic': return renderBasicTab();
      case 'branding': return renderBrandingTab();
      case 'business': return renderBusinessTab();
      case 'features': return renderFeaturesTab();
      case 'payment': return renderPaymentTab();
      case 'layout': return renderLayoutTab();
      default: return renderBasicTab();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? `Editar Tenant: ${tenant?.business.name}` : 'Crear Nuevo Tenant'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Modifica la configuración del tenant' : 'Configura todos los aspectos de la nueva tienda'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {renderCurrentTab()}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </span>
            ) : (
              isEditing ? 'Actualizar Tenant' : 'Crear Tenant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
