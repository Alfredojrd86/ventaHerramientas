import React from 'react';
import { WarrantyInfo, TrustSignal } from '../../types/product';

interface TrustSignalsProps {
  warranty?: WarrantyInfo;
  customSignals?: TrustSignal[];
  className?: string;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({
  warranty,
  customSignals = [],
  className = '',
}) => {
  // Default trust signals
  const defaultSignals: TrustSignal[] = [
    {
      type: 'security',
      title: 'Compra Segura',
      description: 'Transacciones protegidas con SSL 256-bit',
      icon: 'lock-closed',
      verified: true,
    },
    {
      type: 'shipping',
      title: 'Entrega Rápida',
      description: 'Envío a domicilio o retiro gratis',
      icon: 'truck',
      verified: true,
    },
    {
      type: 'support',
      title: 'Soporte Técnico',
      description: 'Asesoría especializada incluida',
      icon: 'support',
      verified: true,
    },
    {
      type: 'quality',
      title: 'Calidad Verificada',
      description: 'Herramientas revisadas y probadas',
      icon: 'badge-check',
      verified: true,
    },
  ];

  const allSignals = [...defaultSignals, ...customSignals];

  const getIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      'shield-check': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      'lock-closed': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      'truck': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      'support': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      'badge-check': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    };

    return icons[iconName] || icons['badge-check'];
  };

  const getSignalColor = (type: TrustSignal['type']) => {
    const colors = {
      guarantee: 'text-green-600 bg-green-100',
      security: 'text-blue-600 bg-blue-100',
      shipping: 'text-purple-600 bg-purple-100',
      support: 'text-orange-600 bg-orange-100',
      quality: 'text-indigo-600 bg-indigo-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Confianza y Seguridad
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSignals.map((signal, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className={`flex-shrink-0 p-2 rounded-lg ${getSignalColor(signal.type)}`}>
              {getIcon(signal.icon)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {signal.title}
                </h4>
                {signal.verified && (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {signal.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional warranty details */}
      {warranty && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Detalles de Garantía
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                {warranty.description || `Garantía ${warranty.type === 'manufacturer' ? 'oficial del fabricante' : 'extendida'} por ${warranty.duration} ${warranty.unit === 'months' ? 'meses' : 'años'}.`}
              </p>
              {warranty.coverage && warranty.coverage.length > 0 && (
                <ul className="text-xs text-blue-600 mt-2 space-y-1">
                  {warranty.coverage.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-3 h-3 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact for warranty */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          ¿Tienes dudas sobre la garantía?{' '}
          <button className="text-blue-600 hover:text-blue-700 underline">
            Contáctanos
          </button>
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;
