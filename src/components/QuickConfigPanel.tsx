import React, { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';

export default function QuickConfigPanel() {
  const { tenant, updateTenant, isLoading } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  const handleBusinessNameChange = async (newName: string) => {
    await updateTenant({
      business: {
        ...tenant.business,
        name: newName
      }
    });
  };

  const handleIndustryChange = async (industry: string) => {
    await updateTenant({
      business: {
        ...tenant.business,
        industry
      }
    });
  };

  const handleLayoutChange = async (field: string, value: any) => {
    await updateTenant({
      layout: {
        ...tenant.layout,
        [field]: value
      }
    });
  };

  const handleFeatureToggle = async (feature: string) => {
    await updateTenant({
      features: {
        ...tenant.features,
        [feature]: !tenant.features[feature as keyof typeof tenant.features]
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-tenant-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        title="Configuración rápida"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl border z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b bg-tenant-primary text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">⚙️ Configuración Rápida</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Nombre del negocio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Negocio
          </label>
          <input
            type="text"
            value={tenant.business.name}
            onChange={(e) => handleBusinessNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Industria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industria
          </label>
          <select
            value={tenant.business.industry}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
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

        {/* Layout */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vista de Productos
          </label>
          <select
            value={tenant.layout.productGridLayout}
            onChange={(e) => handleLayoutChange('productGridLayout', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="grid">Grid</option>
            <option value="list">Lista</option>
          </select>
        </div>

        {/* Productos por página */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Productos por Página
          </label>
          <select
            value={tenant.layout.productsPerPage}
            onChange={(e) => handleLayoutChange('productsPerPage', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={18}>18</option>
            <option value={24}>24</option>
          </select>
        </div>

        {/* Features principales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Características
          </label>
          <div className="space-y-2">
            {Object.entries(tenant.features).slice(0, 4).map(([feature, enabled]) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">
                  {feature.replace('enable', '').replace(/([A-Z])/g, ' $1')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Mostrar elementos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mostrar en Productos
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tenant.layout.showProductCode}
                onChange={(e) => handleLayoutChange('showProductCode', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Código de Producto</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tenant.layout.showStock}
                onChange={(e) => handleLayoutChange('showStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tenant.layout.showDiscount}
                onChange={(e) => handleLayoutChange('showDiscount', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-700">Descuentos</span>
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-2">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Actualizando...</span>
          </div>
        )}
      </div>
    </div>
  );
}
