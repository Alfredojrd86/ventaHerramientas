import React from 'react';
import { useTenant, useTenantConfig } from '../contexts/TenantContext';

export default function TenantDemo() {
  const { tenant, isLoading, updateTenant } = useTenant();
  const { branding, business, formatPrice } = useTenantConfig();

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const handleColorChange = async (colorType: 'primary' | 'secondary' | 'accent') => {
    const colors = {
      primary: ['#1e40af', '#dc2626', '#059669', '#7c3aed'],
      secondary: ['#1e3a8a', '#b91c1c', '#047857', '#6d28d9'],
      accent: ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6']
    };

    const currentIndex = colors[colorType].indexOf(branding[`${colorType}Color`]);
    const nextIndex = (currentIndex + 1) % colors[colorType].length;
    const newColor = colors[colorType][nextIndex];

    await updateTenant({
      branding: {
        ...branding,
        [`${colorType}Color`]: newColor
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-tenant-primary">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-tenant-primary mb-2">
          🏪 {business.name}
        </h2>
        <p className="text-gray-600">{business.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          Industria: {business.industry} | Moneda: {business.currency}
        </p>
      </div>

      {/* Demo de colores dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <button 
            className="w-full h-20 rounded-lg bg-tenant-primary mb-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleColorChange('primary')}
            title="Click para cambiar color primario"
            aria-label="Cambiar color primario"
          ></button>
          <p className="text-sm font-medium">Color Primario</p>
          <p className="text-xs text-gray-500">{branding.primaryColor}</p>
        </div>
        
        <div className="text-center">
          <button 
            className="w-full h-20 rounded-lg bg-tenant-secondary mb-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleColorChange('secondary')}
            title="Click para cambiar color secundario"
            aria-label="Cambiar color secundario"
          ></button>
          <p className="text-sm font-medium">Color Secundario</p>
          <p className="text-xs text-gray-500">{branding.secondaryColor}</p>
        </div>
        
        <div className="text-center">
          <button 
            className="w-full h-20 rounded-lg bg-tenant-accent mb-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleColorChange('accent')}
            title="Click para cambiar color de acento"
            aria-label="Cambiar color de acento"
          ></button>
          <p className="text-sm font-medium">Color de Acento</p>
          <p className="text-xs text-gray-500">{branding.accentColor}</p>
        </div>
      </div>

      {/* Demo de formateo de precios */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">💰 Formato de Precios:</h3>
        <div className="space-y-1">
          <p>Precio ejemplo: {formatPrice(150000)}</p>
          <p>Precio con descuento: <span className="line-through text-gray-500">{formatPrice(200000)}</span> {formatPrice(150000)}</p>
        </div>
      </div>

      {/* Demo de features habilitadas */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">⚙️ Características Habilitadas:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(tenant.features).map(([feature, enabled]) => (
            <div
              key={feature}
              className={`px-3 py-2 rounded-full text-sm text-center ${
                enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {enabled ? '✅' : '❌'} {feature.replace('enable', '').replace(/([A-Z])/g, ' $1')}
            </div>
          ))}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">📞 Información de Contacto:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <p><strong>Teléfono:</strong> {business.contactInfo.phone}</p>
          <p><strong>Email:</strong> {business.contactInfo.email}</p>
          <p><strong>Ciudad:</strong> {business.contactInfo.city}</p>
          <p><strong>Región:</strong> {business.contactInfo.region}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center space-y-2">
        <p>🎨 Haz click en los colores para cambiarlos dinámicamente</p>
        <p>Tenant ID: {tenant.id} | Plan: {tenant.plan}</p>
        <div className="pt-2 border-t border-gray-200">
          <a 
            href="/admin" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            🏢 Ir al Dashboard de Administración →
          </a>
        </div>
      </div>
    </div>
  );
}
